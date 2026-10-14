import { useEffect, useState } from "react";
import { RefreshCcw, XCircle, FileText, Plus, Search, CheckCircle2, User, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrderTable } from "../orders/components/OrderTable";
import { OrderForm } from "../orders/components/OrderForm";
import { getOrders, getOrderById, createOrder, cancelOrder, updateOrderNote, updateOrderStatus, updatePaymentStatus } from "../orders/services/admin-orders.service";
import type { OrderListItem, GetOrderDetailResponse, CreateOrderRequest } from "../orders/types/admin-orders.types";

import { currencyFormatter } from "@/lib/formatters";

export function AdminOrdersPage() {
    const [orders, setOrders] = useState<OrderListItem[]>([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    
    // Filters & Search
    const [keyword, setKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");

    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // State cho Form Tạo đơn mới
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

    // State cho Modal Chi tiết & Sửa Note
    const [selectedOrderDetail, setSelectedOrderDetail] = useState<GetOrderDetailResponse | null>(null);
    const [editingNote, setEditingNote] = useState<string>("");
    const [isSavingNote, setIsSavingNote] = useState(false);

    async function loadOrders() {
        try {
            setIsLoading(true);
            setErrorMessage(null);
            const response = await getOrders({
                pageNumber,
                pageSize,
                status: statusFilter === "all" ? undefined : statusFilter,
                paymentStatus: paymentStatusFilter === "all" ? undefined : paymentStatusFilter,
            });
            setOrders(response.items);
            setTotalPages(response.totalPages);
        } catch {
            setErrorMessage("Không thể tải danh sách đơn hàng.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadOrders();
    }, [pageNumber, statusFilter, paymentStatusFilter]);

    // Xử lý tạo đơn hàng mới
    async function handleCreateOrder(values: CreateOrderRequest) {
        try {
            setIsSubmitting(true);
            setErrorMessage(null);
            await createOrder(values);
            setIsCreateFormOpen(false);
            await loadOrders();
        } catch (err: any) {
            setErrorMessage(err?.response?.data?.message || "Không thể tạo đơn hàng.");
        } finally {
            setIsSubmitting(false);
        }
    }

    // Xem chi tiết đơn hàng
    async function handleViewDetail(order: OrderListItem) {
        try {
            setErrorMessage(null);
            const detail = await getOrderById(order.orderId);
            setSelectedOrderDetail(detail);
            setEditingNote(detail.note || "");
        } catch {
            setErrorMessage("Không thể tải chi tiết đơn hàng.");
        }
    }

    // Lưu cập nhật ghi chú đơn hàng
    async function handleSaveNote() {
        if (!selectedOrderDetail) return;
        try {
            setIsSavingNote(true);
            await updateOrderNote(selectedOrderDetail.orderId, { note: editingNote });
            setSelectedOrderDetail({ ...selectedOrderDetail, note: editingNote });
            await loadOrders();
        } catch {
            setErrorMessage("Không thể cập nhật ghi chú đơn hàng.");
        } finally {
            setIsSavingNote(false);
        }
    }

    // Hủy đơn hàng (dùng cho cả bảng và modal chi tiết)
    async function handleCancelOrder(orderId: number) {
        if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) return;
        try {
            await cancelOrder(orderId);
            setSelectedOrderDetail(null);
            await loadOrders();
        } catch {
            setErrorMessage("Không thể hủy đơn hàng.");
        }
    }

    function handleCancelFromTable(order: OrderListItem) {
        handleCancelOrder(order.orderId);
    }

    // Lọc client-side theo từ khóa (Mã đơn hoặc Tên khách hàng)
    const filteredOrders = orders.filter((o) => {
        const q = keyword.trim().toLowerCase();
        if (!q) return true;
        return (
            o.orderCode.toLowerCase().includes(q) ||
            (o.customerName && o.customerName.toLowerCase().includes(q))
        );
    });

    //Xử lý đổi trạng thái đơn hàng
    async function handleUpdateStatus(newStatus:string)
    {
        if(!selectedOrderDetail)
        {
            return;   
        }
        try{
            setErrorMessage(null);
            const result = await updateOrderStatus(selectedOrderDetail.orderId, newStatus);
            setSelectedOrderDetail({...selectedOrderDetail, status:result.status});
            await loadOrders();
        }
        catch(err:any) 
        {
            setErrorMessage(err?.response?.data?.message || "Không thể cập nhật trạng thái đơn hàng.");       
        }
    }

     async function handleUpdatePayment(newPaymentStatus: string) {
        if (!selectedOrderDetail) return;
        try {
            setErrorMessage(null);
            const result = await updatePaymentStatus(selectedOrderDetail.orderId, newPaymentStatus);
            setSelectedOrderDetail({
                ...selectedOrderDetail,
                paymentStatus: result.paymentStatus
            });
            await loadOrders();
        } catch (err: any) {
            setErrorMessage(err?.response?.data?.message || "Không thể cập nhật trạng thái thanh toán.");
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Quản lý Đơn hàng</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Xem, tìm kiếm và quản lý tất cả đơn hàng bán ra của hệ thống
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={loadOrders} title="Tải lại">
                        <RefreshCcw className="h-4 w-4 mr-1" /> Tải lại
                    </Button>
                    <Button onClick={() => setIsCreateFormOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
                        <Plus className="h-4 w-4 mr-1" />
                        Tạo đơn hàng mới
                    </Button>
                </div>
            </div>

            {/* Form Tạo đơn mới */}
            {isCreateFormOpen && (
                <OrderForm
                    isSubmitting={isSubmitting}
                    onSubmit={handleCreateOrder}
                    onCancel={() => setIsCreateFormOpen(false)}
                />
            )}

            {/* Thanh Tìm kiếm & Filter bar */}
            <div className="rounded-lg border bg-white p-4 space-y-4">
                <div className="relative max-w-md">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Tìm kiếm theo Mã đơn hàng (ORD...) hoặc Tên khách..."
                        className="pl-9"
                    />
                </div>

                <div className="flex flex-wrap gap-4 items-center justify-between border-t pt-3">
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-sm font-medium text-muted-foreground mr-2">Trạng thái đơn:</span>
                        {["all", "pending", "confirmed", "shipping", "completed", "cancelled"].map((st) => (
                            <Button
                                key={st}
                                type="button"
                                variant={statusFilter === st ? "default" : "outline"}
                                className={statusFilter === st ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600" : ""}
                                size="sm"
                                onClick={() => { setStatusFilter(st); setPageNumber(1); }}
                            >
                                {st === "all" ? "Tất cả" :
                                 st === "pending" ? "Chờ xử lý" :
                                 st === "confirmed" ? "Đã xác nhận" :
                                 st === "shipping" ? "Đang giao" :
                                 st === "completed" ? "Hoàn thành" : "Đã hủy"}
                            </Button>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-sm font-medium text-muted-foreground mr-2">Thanh toán:</span>
                        {["all", "paid", "unpaid"].map((pst) => (
                            <Button
                                key={pst}
                                type="button"
                                variant={paymentStatusFilter === pst ? "default" : "outline"}
                                className={paymentStatusFilter === pst ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600" : ""}
                                size="sm"
                                onClick={() => { setPaymentStatusFilter(pst); setPageNumber(1); }}
                            >
                                {pst === "all" ? "Tất cả" : pst === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errorMessage}
                </div>
            )}

            {/* Bảng Đơn hàng */}
            <OrderTable
                orders={filteredOrders}
                isLoading={isLoading}
                onViewDetail={handleViewDetail}
                onCancel={handleCancelFromTable}
            />

            {/* Phân trang */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Trang {pageNumber}/{totalPages}
                </p>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={pageNumber <= 1 || isLoading}
                        onClick={() => setPageNumber((curr) => curr - 1)}
                    >
                        Trang trước
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={pageNumber >= totalPages || isLoading}
                        onClick={() => setPageNumber((curr) => curr + 1)}
                    >
                        Trang sau
                    </Button>
                </div>
            </div>

            {/* Modal / Dialog Chi tiết Đơn hàng & Cập nhật Note */}
            {selectedOrderDetail && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6">
                        <div className="flex justify-between items-start border-b pb-4">
                            <div>
                                <h2 className="text-xl font-bold">Chi tiết đơn hàng #{selectedOrderDetail.orderCode}</h2>
                                <div className="flex flex-wrap items-center gap-3 mt-3">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-semibold text-slate-500">Trạng thái đơn:</span>
                                        <select
                                            value={selectedOrderDetail.status.toLowerCase()}
                                            onChange={(e) => handleUpdateStatus(e.target.value)}
                                            disabled={selectedOrderDetail.status.toLowerCase() === "cancelled" || selectedOrderDetail.status.toLowerCase() === "completed"}
                                            className="text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-1 bg-white text-slate-700 focus:outline-none focus:border-emerald-500 disabled:bg-slate-100 cursor-pointer"
                                        >
                                            <option value="pending">Chờ xử lý</option>
                                            <option value="confirmed">Đã xác nhận</option>
                                            <option value="shipping">Đang giao hàng</option>
                                            <option value="completed">Hoàn thành</option>
                                            <option value="cancelled">Hủy đơn</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-semibold text-slate-500">Thanh toán:</span>
                                        <select
                                            value={selectedOrderDetail.paymentStatus.toLowerCase()}
                                            onChange={(e) => handleUpdatePayment(e.target.value)}
                                            disabled={selectedOrderDetail.status.toLowerCase() === "cancelled"}
                                            className="text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-1 bg-white text-slate-700 focus:outline-none focus:border-emerald-500 disabled:bg-slate-100 cursor-pointer"
                                        >
                                            <option value="unpaid">Chưa thanh toán</option>
                                            <option value="paid">Đã thanh toán</option>
                                            <option value="refunded">Đã hoàn tiền</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedOrderDetail(null)}>
                                X
                            </Button>
                        </div>

                        {/* Thẻ Thông tin Khách hàng & Giao hàng */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border text-sm">
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                                    <User className="h-4 w-4 text-blue-600" />
                                    Khách hàng / Người nhận:
                                </div>
                                <p className="font-medium text-slate-900">
                                    {selectedOrderDetail.recipientName || selectedOrderDetail.customerName || "Khách mua tại quầy"}
                                </p>
                                {selectedOrderDetail.shippingPhone && (
                                    <p className="text-slate-600 flex items-center gap-1 text-xs">
                                        <Phone className="h-3.5 w-3.5 text-slate-500" />
                                        {selectedOrderDetail.shippingPhone}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                                    <MapPin className="h-4 w-4 text-emerald-600" />
                                    Địa chỉ giao hàng:
                                </div>
                                <p className="text-slate-800 text-xs leading-relaxed">
                                    {selectedOrderDetail.shippingAddress || selectedOrderDetail.address || "Bán tại quầy (Không có địa chỉ ship)"}
                                </p>
                            </div>
                        </div>

                        {/* Thẻ Ghi chú với Chức năng Sửa & Lưu */}
                        <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2 border">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 font-semibold text-gray-700">
                                    <FileText className="h-4 w-4 text-blue-600" />
                                    Ghi chú đơn hàng:
                                </div>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    disabled={isSavingNote}
                                    onClick={handleSaveNote}
                                    className="h-7 text-xs"
                                >
                                    <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                                    Lưu ghi chú
                                </Button>
                            </div>
                            <Input
                                value={editingNote}
                                onChange={(e) => setEditingNote(e.target.value)}
                                placeholder="Nhập ghi chú cho đơn hàng này..."
                                className="bg-white text-sm"
                            />
                        </div>

                        {/* Bảng Mặt hàng trong đơn */}
                        <div className="space-y-2">
                            <h3 className="font-semibold text-sm">Danh sách sản phẩm mua:</h3>
                            <div className="border rounded-lg overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-100 border-b">
                                        <tr>
                                            <th className="p-3">SKU</th>
                                            <th className="p-3">Sản phẩm</th>
                                            <th className="p-3 text-center">SL</th>
                                            <th className="p-3 text-right">Đơn giá</th>
                                            <th className="p-3 text-right">Thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {(selectedOrderDetail.items || []).map((item, index) => (
                                            <tr key={index}>
                                                <td className="p-3 font-medium">{item.sku}</td>
                                                <td className="p-3">{item.productName}</td>
                                                <td className="p-3 text-center">{item.quantity}</td>
                                                <td className="p-3 text-right">{currencyFormatter.format(item.unitPrice)}</td>
                                                <td className="p-3 text-right font-medium">{currencyFormatter.format(item.lineTotal)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Tổng cộng */}
                        <div className="border-t pt-4 space-y-1.5 text-right text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tạm tính:</span>
                                <span>{currencyFormatter.format(selectedOrderDetail.subtotal)}</span>
                            </div>
                            {selectedOrderDetail.discountAmount > 0 && (
                                <div className="flex justify-between text-red-600">
                                    <span>Giảm giá:</span>
                                    <span>-{currencyFormatter.format(selectedOrderDetail.discountAmount)}</span>
                                </div>
                            )}
                            {selectedOrderDetail.shippingFee && selectedOrderDetail.shippingFee > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Phí vận chuyển:</span>
                                    <span>{currencyFormatter.format(selectedOrderDetail.shippingFee)}</span>
                                </div>
                            )}
                            {selectedOrderDetail.taxAmount && selectedOrderDetail.taxAmount > 0 && (
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Thuế VAT ({((selectedOrderDetail.taxRate || 0) * 100).toFixed(0)}%):</span>
                                    <span>{currencyFormatter.format(selectedOrderDetail.taxAmount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-base font-bold pt-2 border-t">
                                <span>Tổng thanh toán:</span>
                                <span className="text-emerald-600">{currencyFormatter.format(selectedOrderDetail.totalAmount)}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between items-center pt-4 border-t">
                            {selectedOrderDetail.status.toLowerCase() !== "cancelled" ? (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleCancelOrder(selectedOrderDetail.orderId)}
                                >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Hủy đơn hàng này
                                </Button>
                            ) : (
                                <span className="text-xs text-red-600 font-medium">Đơn hàng này đã bị hủy</span>
                            )}

                            <Button variant="outline" onClick={() => setSelectedOrderDetail(null)}>
                                Đóng
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
