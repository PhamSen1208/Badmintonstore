import React, { useEffect, useState } from "react";
import {
    Ticket, Plus, Search, Filter, Edit, Eye, EyeOff, Loader2, Calendar, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { currencyFormatter } from "@/lib/formatters";
import { toast } from "sonner";
import {
    GetCoupons, CreateCoupon, UpdateCoupon, ToggleCouponStatus
} from "../coupons/services/admin-coupons.service";
import type {
    CouponListItem, CreateCouponPayload
} from "../coupons/types/admin-coupons-types";


export function AdminCouponsPage()
{
    //State danh sach va phan trang 
    const [coupons, setCoupons] = useState<CouponListItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    //State Model form 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditting, setIsEditting] = useState<CouponListItem | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    //State form 
    const [formData, setFormData] = useState<CreateCouponPayload>({
        couponCode: "",
        description: "",
        discountType: 1, // 1: %, 2: Tiền cố định
        discountValue: 0,
        minOrderAmount: 0,
        maxDiscountAmount: undefined,
        quantity: 100,
        maxUsageUser: 1,
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        isActive: true,
    });

    async function loadCoupons()
    {
        try{
            setIsLoading(true);
            const data = await GetCoupons({
                keyword: keyword,
                status: statusFilter,
                pageNumber: pageNumber,
                pageSize: 10,
            });
            setCoupons(data.items);
            setTotalPages(data.totalPages);
        }
        catch(err)
        {
            toast.error("Không thể lấy danh sách mã giảm giá");
        }
        finally
        {
            setIsLoading(false);
        }
    }

    //useEffect để load danh sách couponCode
    useEffect(() => {
        loadCoupons();
    }, [pageNumber, keyword, statusFilter]);

    async function handleToggleStatus(couponId: number)
    {
        try{
            const newStatus = await ToggleCouponStatus(couponId);
            toast.success(newStatus ? "Đã kích hoạt mã giảm giá" : "Đã ẩn mã giảm giá");
            //Cập nhật lại state tại đây

            setCoupons((prev) => 
                prev.map((item) => 
                    item.couponId === couponId ? {...item, isActive: newStatus} : item
                )
            );
        }
        catch(err)
        {
            toast.error("Không thể cập nhật trạng thái mã giảm giá");
        }
    }

    async function handleOpenModal()
    {
        setIsEditting(null);
        setFormData(
            {
                couponCode: "",
                description: "",
                discountType: 1,
                discountValue: 0,
                minOrderAmount: 0,
                maxDiscountAmount: undefined,
                quantity: 100,
                maxUsageUser: 1,
                startDate: new Date().toISOString().split("T")[0],
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                isActive: true,
            }
        );
        setIsModalOpen(true);
    }

    async function handleOpenEditModal(coupon: CouponListItem)
    {
        setIsEditting(coupon);
        setFormData(
            {
                couponCode: coupon.couponCode,
                description: coupon.description || "",
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                minOrderAmount: coupon.minOrderAmount,
                maxDiscountAmount: coupon.maxDiscountAmount,
                quantity: coupon.quantity,
                maxUsageUser: coupon.maxUsageUser,
                startDate: coupon.startDate.split("T")[0],
                endDate: coupon.endDate.split("T")[0],
                isActive: coupon.isActive,
            }
        );
        setIsModalOpen(true);
    }

    //Hàm xử lý form create hoặc Edit
    async function handleSubmit(e: React.FormEvent)
    {
        e.preventDefault();
        if(!formData.couponCode.trim())
        {
            toast.error("Vui lòng nhập mã giảm giá");
            return;
        }
        if(formData.discountValue <= 0)
        {
            toast.error("Giá trị giảm giá phải lớn hơn 0");
        }
        setIsSubmitting(true);

        try
        {
            if(isEditting)
            {
                await UpdateCoupon(isEditting.couponId, formData);
                toast.success("Cập nhật phiếu giảm giá thành công");
            }
            else
            {
                await CreateCoupon(formData);
                toast.success("Tạo phiếu giảm giá thành công");
            }
            setIsModalOpen(false);
            await loadCoupons(); ///Tải lại ds
        }
        catch(err : any) {
            const msg = err?.response?.data?.message || "Thao tác không thành công";
            toast.error(msg);
        }
        finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* 1. HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <Ticket className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Quản lý mã giảm giá</h1>
                        <p className="text-sm text-slate-500">Tạo và quản lý các chương trình ưu đãi cho khách hàng</p>
                    </div>
                </div>
                <Button 
                    onClick={handleOpenModal}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center gap-2 rounded-xl shadow-sm"
                >
                    <Plus className="w-4 h-4" /> Tạo mã giảm giá
                </Button>
            </div>

            {/* 2. FILTER & SEARCH */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo mã coupon..."
                        value={keyword}
                        onChange={(e) => {
                            setKeyword(e.target.value);
                            setPageNumber(1);
                        }}
                        className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter className="w-4 h-4 text-slate-500" />
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPageNumber(1);
                        }}
                        className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:border-emerald-500 w-full md:w-auto"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="active">Đang hoạt động</option>
                        <option value="inactive">Đã ẩn</option>
                    </select>
                </div>
            </div>

            {/* 3. BẢNG DANH SÁCH (TABLE) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <th className="p-4">Mã Coupon</th>
                                <th className="p-4">Giảm giá</th>
                                <th className="p-4">Đơn tối thiểu</th>
                                <th className="p-4">Lượt sử dụng</th>
                                <th className="p-4">Thời gian áp dụng</th>
                                <th className="p-4">Trạng thái</th>
                                <th className="p-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-500">
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                                            <span>Đang tải danh sách...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : coupons.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-500">
                                        Không tìm thấy mã giảm giá nào
                                    </td>
                                </tr>
                            ) : (
                                coupons.map((item) => (
                                    <tr key={item.couponId} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md inline-block border border-emerald-200">
                                                {item.couponCode}
                                            </div>
                                            {item.description && (
                                                <p className="text-xs text-slate-500 mt-1 max-w-xs truncate">{item.description}</p>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className="font-semibold text-slate-800">
                                                {item.discountType === 1 
                                                    ? `${item.discountValue}%` 
                                                    : currencyFormatter.format(item.discountValue)}
                                            </span>
                                            {item.discountType === 1 && item.maxDiscountAmount && (
                                                <p className="text-xs text-slate-400">Tối đa: {currencyFormatter.format(item.maxDiscountAmount)}</p>
                                            )}
                                        </td>
                                        <td className="p-4 text-slate-600">
                                            {item.minOrderAmount > 0 ? currencyFormatter.format(item.minOrderAmount) : "0 đ"}
                                        </td>
                                        <td className="p-4">
                                            <span className="font-medium text-slate-700">
                                                {item.quantityUsed} / {item.quantity}
                                            </span>
                                        </td>
                                        <td className="p-4 text-xs text-slate-500">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                <span>{new Date(item.startDate).toLocaleDateString("vi-VN")}</span>
                                                <span>-</span>
                                                <span>{new Date(item.endDate).toLocaleDateString("vi-VN")}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                item.isActive 
                                                    ? "bg-emerald-100 text-emerald-800" 
                                                    : "bg-slate-100 text-slate-600"
                                            }`}>
                                                {item.isActive ? "Hoạt động" : "Đã ẩn"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleToggleStatus(item.couponId)}
                                                    title={item.isActive ? "Ẩn mã" : "Hiện mã"}
                                                    className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors"
                                                >
                                                    {item.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => handleOpenEditModal(item)}
                                                    title="Sửa mã"
                                                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between p-4 border-t border-slate-100 text-sm">
                        <span className="text-slate-500">Trang {pageNumber} / {totalPages}</span>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={pageNumber <= 1}
                                onClick={() => setPageNumber(prev => prev - 1)}
                            >
                                Trước
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={pageNumber >= totalPages}
                                onClick={() => setPageNumber(prev => prev + 1)}
                            >
                                Sau
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* 4. MODAL CREATION / EDITING */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-800">
                                {isEditting ? "Chỉnh sửa mã giảm giá" : "Tạo mã giảm giá mới"}
                            </h2>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Mã Coupon *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="VD: KHUYENMAI10"
                                        value={formData.couponCode}
                                        onChange={(e) => setFormData({...formData, couponCode: e.target.value.toUpperCase()})}
                                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 uppercase font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Loại giảm giá</label>
                                    <select
                                        value={formData.discountType}
                                        onChange={(e) => setFormData({...formData, discountType: Number(e.target.value)})}
                                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-white"
                                    >
                                        <option value={1}>Phần trăm (%)</option>
                                        <option value={2}>Số tiền cố định (VNĐ)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Giá trị giảm {formData.discountType === 1 ? "(%)" : "(VNĐ)"} *
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        required
                                        value={formData.discountValue}
                                        onChange={(e) => setFormData({...formData, discountValue: Number(e.target.value)})}
                                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                                    />
                                </div>

                                {formData.discountType === 1 && (
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Mức giảm tối đa (VNĐ)</label>
                                        <input
                                            type="number"
                                            placeholder="Không giới hạn"
                                            value={formData.maxDiscountAmount || ""}
                                            onChange={(e) => setFormData({
                                                ...formData, 
                                                maxDiscountAmount: e.target.value ? Number(e.target.value) : undefined
                                            })}
                                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Đơn tối thiểu (VNĐ)</label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={formData.minOrderAmount}
                                        onChange={(e) => setFormData({...formData, minOrderAmount: Number(e.target.value)})}
                                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Tổng số lượng phát hành</label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})}
                                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày bắt đầu</label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày kết thúc</label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả mã giảm giá</label>
                                <textarea
                                    rows={2}
                                    placeholder="VD: Áp dụng cho đơn hàng vợt Yonex..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 resize-none"
                                />
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium text-slate-700 cursor-pointer">
                                    Kích hoạt mã ngay sau khi lưu
                                </label>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-xl"
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-2"
                                >
                                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {isEditting ? "Cập nhật" : "Tạo mới"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );




    
}