import { useEffect, useState } from "react";
import { Users, Search, RefreshCcw, UserCheck, UserX, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CustomerTable } from "../customers/components/CustomerTable";
import { CustomerForm } from "../customers/components/CustomerForm";
import { CustomerDetailModal } from "../customers/components/CustomerDetailModal";
import { getCustomers, updateCustomer, toggleCustomerStatus } from "../customers/services/admin-customers.service";
import type { CustomerListItem, UpdateCustomerRequest } from "../customers/types/admin-customers.types";

export function AdminCustomersPage() {
    const [customers, setCustomers] = useState<CustomerListItem[]>([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [keyword, setKeyword] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [togglingId, setTogglingId] = useState<number | null>(null);

    // States cho Modals
    const [editingCustomer, setEditingCustomer] = useState<CustomerListItem | null>(null);
    const [viewingCustomer, setViewingCustomer] = useState<CustomerListItem | null>(null);

    async function loadCustomers() {
        try {
            setIsLoading(true);
            const response = await getCustomers({
                pageNumber,
                pageSize,
                keyword: keyword.trim() || undefined,
            });
            setCustomers(response.items || []);
            setTotalPages(response.totalPages || 1);
            setTotalItems(response.totalCount || response.items?.length || 0);
        } catch {
            toast.error("Không thể tải danh sách khách hàng");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadCustomers();
    }, [pageNumber]);

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        setPageNumber(1);
        loadCustomers();
    }

    async function handleUpdateCustomer(values: UpdateCustomerRequest) {
        if (!editingCustomer) return;
        try {
            setIsSubmitting(true);
            await updateCustomer(editingCustomer.customerId, values);
            toast.success("Cập nhật thông tin khách hàng thành công");
            setEditingCustomer(null);
            await loadCustomers();
        } catch {
            toast.error("Không thể cập nhật thông tin khách hàng");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleToggleStatus(customerId: number) {
        try {
            setTogglingId(customerId);
            const newIsActive = await toggleCustomerStatus(customerId);
            const newStatusStr = newIsActive ? "Active" : "Locked";

            toast.success(newIsActive ? "Đã mở khóa tài khoản khách hàng" : "Đã khóa tài khoản khách hàng");

            setCustomers((prev) =>
                prev.map((item) =>
                    item.customerId === customerId
                        ? { ...item, userStatus: newStatusStr }
                        : item
                )
            );

            if (viewingCustomer && viewingCustomer.customerId === customerId) {
                setViewingCustomer((prev) => prev ? { ...prev, userStatus: newStatusStr } : null);
            }
        } catch {
            toast.error("Không thể thay đổi trạng thái tài khoản");
        } finally {
            setTogglingId(null);
        }
    }

    // KPI Metrics calculation
    const activeCount = customers.filter((c) => c.userStatus?.toLowerCase() !== "locked").length;
    const lockedCount = customers.filter((c) => c.userStatus?.toLowerCase() === "locked").length;
    const totalSpentRevenue = customers.reduce((acc, c) => acc + (c.totalSpent || 0), 0);
   // const totalOrdersCount = customers.reduce((acc, c) => acc + (c.totalOrders || 0), 0);

    function formatVND(amount: number) {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
    }

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* 1. HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Quản lý Khách hàng</h1>
                        <p className="text-sm text-slate-500">Xem danh sách, thông tin chi tiết và quản lý quyền truy cập tài khoản</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={loadCustomers}
                        className="rounded-xl flex items-center gap-2 text-slate-700"
                    >
                        <RefreshCcw className="w-4 h-4" /> Tải lại
                    </Button>
                </div>
            </div>

            {/* 2. KPI SUMMARY CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase">Tổng số khách hàng</p>
                        <p className="text-2xl font-black text-slate-800">{totalItems}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <UserCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase">Tài khoản hoạt động</p>
                        <p className="text-2xl font-black text-emerald-600">{activeCount}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                        <UserX className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase">Tài khoản bị khóa</p>
                        <p className="text-2xl font-black text-red-600">{lockedCount}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase">Tổng doanh thu từ KH</p>
                        <p className="text-lg font-black text-slate-800 truncate">{formatVND(totalSpentRevenue)}</p>
                    </div>
                </div>
            </div>

            {/* 3. BAR TÌM KIẾM */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Tìm kiếm theo Tên, Mã KH, Email hoặc Số điện thoại..."
                            className="pl-9 bg-slate-50 border-slate-200 focus:bg-white rounded-xl text-sm"
                        />
                    </div>
                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold px-5">
                        Tìm kiếm
                    </Button>
                </form>
            </div>

            {/* 4. BẢNG DANH SÁCH KHÁCH HÀNG */}
            <CustomerTable
                customers={customers}
                isLoading={isLoading}
                togglingId={togglingId}
                onViewDetail={(c) => setViewingCustomer(c)}
                onEdit={(c) => setEditingCustomer(c)}
                onToggleStatus={handleToggleStatus}
            />

            {/* Modal Chỉnh sửa Khách hàng */}
            {editingCustomer && (
                <CustomerForm
                    customer={editingCustomer}
                    isSubmitting={isSubmitting}
                    onSubmit={handleUpdateCustomer}
                    onCancel={() => setEditingCustomer(null)}
                />
            )}

            {/* Modal Xem chi tiết Khách hàng */}
            {viewingCustomer && (
                <CustomerDetailModal
                    customer={viewingCustomer}
                    onClose={() => setViewingCustomer(null)}
                    onToggleStatus={handleToggleStatus}
                    isToggling={togglingId === viewingCustomer.customerId}
                />
            )}

            {/* Phân trang */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm text-sm">
                    <span className="text-slate-500 font-medium">
                        Trang {pageNumber} / {totalPages} (Tổng {totalItems} khách hàng)
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={pageNumber <= 1 || isLoading}
                            onClick={() => setPageNumber((curr) => curr - 1)}
                            className="rounded-xl font-bold"
                        >
                            Trang trước
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={pageNumber >= totalPages || isLoading}
                            onClick={() => setPageNumber((curr) => curr + 1)}
                            className="rounded-xl font-bold"
                        >
                            Trang sau
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
