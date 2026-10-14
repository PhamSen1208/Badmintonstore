import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Package, Clock, CheckCircle2, XCircle, Eye, RefreshCw, X, MapPin, ShoppingBag } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getMyOrders, getOrderDetail, cancelMyOrder } from "../services/client-order.service";
import { currencyFormatter } from "@/lib/formatters";
import { toast } from "sonner";

export function MyOrdersPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState<number | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

    // State Filter & Search
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    // Fetch danh sách đơn hàng
    useEffect(() => {
        async function loadOrders() {
            if (!user?.customerId) {
                setIsLoading(false);
                return;
            }
            try {
                setIsLoading(true);
                const data = await getMyOrders(user.customerId);
                setOrders(data.items || []);
            } catch (error) {
                console.error("Error when fetching orders:", error);
                toast.error("Không thể lấy danh sách đơn hàng");
            } finally {
                setIsLoading(false);
            }
        }
        loadOrders();
    }, [user?.customerId]);

    // Xử lý Hủy đơn hàng
    async function handleCancelOrder(orderId: number) {
        if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) return;

        setCancellingId(orderId);
        try {
            await cancelMyOrder(orderId);
            toast.success("Đã hủy đơn hàng thành công!");

            setOrders(prevOrders => prevOrders.map(order =>
                order.orderId === orderId
                    ? { ...order, status: "cancelled" }
                    : order
            ));

            if (selectedOrder && selectedOrder.orderId === orderId) {
                setSelectedOrder((prev: any) => prev ? { ...prev, status: "cancelled" } : null);
            }
        } catch (error) {
            console.error("Error when cancelling order:", error);
            toast.error("Không thể hủy đơn hàng");
        } finally {
            setCancellingId(null);
        }
    }

    // Xử lý Xem chi tiết đơn hàng
    async function handleViewDetail(orderId: number) {
        try {
            const detail = await getOrderDetail(orderId);
            setSelectedOrder(detail);
        } catch (error) {
            toast.error("Không thể tải chi tiết đơn hàng!");
        }
    }

    // Tính toán Thống kê Summary Statistics
    const stats = useMemo(() => {
        const safeOrders = Array.isArray(orders) ? orders : [];
        const total = safeOrders.length;
        const pending = safeOrders.filter(o => o.status?.toLowerCase() === "confirmed" || o.status?.toLowerCase() === "pending").length;
        const completed = safeOrders.filter(o => o.status?.toLowerCase() === "completed").length;
        const totalSpent = safeOrders
            .filter(o => o.status?.toLowerCase() !== "cancelled")
            .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        return { total, pending, completed, totalSpent };
    }, [orders]);

    // Lọc danh sách đơn theo Search & Tab Filter
    const filteredOrders = useMemo(() => {
        const safeOrders = Array.isArray(orders) ? orders : [];
        return safeOrders.filter(order => {
            const matchesSearch = !searchQuery || 
                order.orderCode?.toLowerCase().includes(searchQuery.toLowerCase());

            let matchesStatus = true;
            const status = order.status?.toLowerCase();
            if (statusFilter === "pending") {
                matchesStatus = status === "confirmed" || status === "pending";
            } else if (statusFilter === "shipping") {
                matchesStatus = status === "shipping";
            } else if (statusFilter === "completed") {
                matchesStatus = status === "completed";
            } else if (statusFilter === "cancelled") {
                matchesStatus = status === "cancelled";
            }

            return matchesSearch && matchesStatus;
        });
    }, [orders, searchQuery, statusFilter]);

    // Helper Badge Trạng thái Đơn hàng
    function renderStatusBadge(status: string) {
        const s = status?.toLowerCase();
        if (s === "confirmed" || s === "pending") {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                    <Clock className="h-3.5 w-3.5" /> Chờ xử lý
                </span>
            );
        }
        if (s === "shipping") {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                    <Package className="h-3.5 w-3.5" /> Đang giao hàng
                </span>
            );
        }
        if (s === "completed") {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Hoàn thành
                </span>
            );
        }
        if (s === "cancelled") {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold">
                    <XCircle className="h-3.5 w-3.5" /> Đã hủy
                </span>
            );
        }
        return <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">{status}</span>;
    }

    return (
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 space-y-8">
            {/* 1. HEADER TIÊU ĐỀ */}
            <div className="border-b border-slate-200 pb-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        Đơn hàng của tôi
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Quản lý và theo dõi quá trình xử lý đơn hàng của bạn.
                    </p>
                </div>
                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold text-xs transition-colors"
                >
                    <ShoppingBag className="h-4 w-4" /> Tiếp tục mua sắm
                </Link>
            </div>

            {/* 2. THỐNG KÊ SUMMARY STATISTICS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tổng đơn hàng</p>
                    <p className="text-xl sm:text-2xl font-black text-slate-900">{stats.total}</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-1">
                    <p className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">Đang xử lý</p>
                    <p className="text-xl sm:text-2xl font-black text-amber-600">{stats.pending}</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-1">
                    <p className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider">Đã hoàn thành</p>
                    <p className="text-xl sm:text-2xl font-black text-emerald-600">{stats.completed}</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-1">
                    <p className="text-[11px] font-bold text-orange-500 uppercase tracking-wider">Tổng tích lũy</p>
                    <p className="text-lg sm:text-xl font-black text-orange-600 truncate">
                        {currencyFormatter.format(stats.totalSpent)}
                    </p>
                </div>
            </div>

            {/* 3. THANH TÌM KIẾM & BỘ LỌC TRẠNG THÁI (TAB FILTER) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-sm space-y-4">
                {/* Search input */}
                <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm kiếm theo mã đơn hàng (VD: ORD000001)..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                </div>

                {/* Tabs trạng thái */}
                <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 text-xs font-bold no-scrollbar border-t border-slate-100 pt-3">
                    {[
                        { id: "all", label: "Tất cả" },
                        { id: "pending", label: "Chờ xử lý" },
                        { id: "shipping", label: "Đang giao" },
                        { id: "completed", label: "Hoàn thành" },
                        { id: "cancelled", label: "Đã hủy" },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setStatusFilter(tab.id)}
                            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                                statusFilter === tab.id
                                    ? "bg-slate-900 text-white shadow-sm"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 4. TẢI DỮ LIỆU HOẶC DANH SÁCH ĐƠN HÀNG */}
            {isLoading ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 font-medium shadow-sm animate-pulse">
                    ⏳ Đang nạp danh sách đơn hàng...
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
                    <div className="h-16 w-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto text-3xl">
                        📦
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Không tìm thấy đơn hàng phù hợp</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Thử tìm kiếm mã đơn khác hoặc chuyển sang tab trạng thái khác xem sao nhé!
                    </p>
                </div>
            ) : (
                /* 5. CARD ĐƠN HÀNG PRODUCT PREVIEW */
                <div className="space-y-4">
                    {filteredOrders.map((order) => {
                        const isCancelled = order.status?.toLowerCase() === "cancelled";
                        return (
                            <div
                                key={order.orderId}
                                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
                            >
                                {/* Header Card */}
                                <div className="bg-slate-50/80 px-5 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <span className="font-black text-slate-900 text-sm">
                                            #{order.orderCode}
                                        </span>
                                        <span className="text-xs text-slate-400">
                                            • {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {renderStatusBadge(order.status)}
                                    </div>
                                </div>

                                {/* Body Card: Preview thông tin tổng quát */}
                                <div className="p-5 sm:p-6 flex flex-wrap items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-orange-100/80 text-orange-600 font-bold flex items-center justify-center text-xl shrink-0">
                                            🏸
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm">
                                                Đơn hàng dụng cụ cầu lông
                                            </p>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                Phương thức: <span className="font-semibold text-slate-700">{order.paymentStatus === "Paid" ? "Đã thanh toán (Banking)" : "Thanh toán khi nhận (COD)"}</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Giá tiền */}
                                    <div className="text-right">
                                        <p className="text-xs text-slate-400">Tổng tiền thanh toán</p>
                                        <p className="text-lg sm:text-xl font-black text-orange-600">
                                            {currencyFormatter.format(order.totalAmount)}
                                        </p>
                                    </div>
                                </div>

                                {/* Footer Card: Các nút Hành động */}
                                <div className="px-5 py-3.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-3">
                                    {/* Nút Xem chi tiết */}
                                    <button
                                        type="button"
                                        onClick={() => handleViewDetail(order.orderId)}
                                        className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                                    >
                                        <Eye className="h-3.5 w-3.5 text-slate-500" /> Xem chi tiết
                                    </button>

                                    {/* Nút Hủy đơn (Tinh tế, không nổi lòe loẹt) */}
                                    {!isCancelled && (
                                        <button
                                            type="button"
                                            disabled={cancellingId === order.orderId}
                                            onClick={() => handleCancelOrder(order.orderId)}
                                            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 text-xs font-semibold transition-all disabled:opacity-50"
                                        >
                                            {cancellingId === order.orderId ? "⏳ Đang hủy..." : "✕ Hủy đơn"}
                                        </button>
                                    )}

                                    {/* Nút Đánh giá sản phẩm cho đơn Completed */}
                                    {order.status?.toLowerCase() === "completed" && (
                                        <button
                                            type="button"
                                            onClick={() => handleViewDetail(order.orderId)}
                                            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                                        >
                                            ⭐ Đánh giá sản phẩm
                                        </button>
                                    )}

                                    {/* Nút Mua lại cho đơn đã hủy hoặc completed */}
                                    {isCancelled && (
                                        <Link
                                            to="/products"
                                            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                                        >
                                            <RefreshCw className="h-3.5 w-3.5" /> Mua lại
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* 6. MODAL XEM CHI TIẾT ĐƠN HÀNG */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
                        {/* Header Modal */}
                        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-base flex items-center gap-2">
                                    Chi tiết đơn hàng #{selectedOrder.orderCode}
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Ngày đặt: {new Date(selectedOrder.orderDate || Date.now()).toLocaleDateString("vi-VN")}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedOrder(null)}
                                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Body Modal */}
                        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
                            {/* Thông tin giao hàng */}
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
                                <h4 className="font-bold text-orange-600 uppercase text-xs tracking-wider flex items-center gap-1.5">
                                    <MapPin className="h-4 w-4" /> Thông tin nhận hàng
                                </h4>
                                <div className="space-y-1 text-slate-700 pt-1">
                                    <p><span className="text-slate-400 font-normal">Người nhận:</span> <strong className="text-slate-900">{selectedOrder.recipientName || selectedOrder.customerName}</strong></p>
                                    <p><span className="text-slate-400 font-normal">Số điện thoại:</span> <strong>{selectedOrder.shippingPhone || "Chưa cập nhật"}</strong></p>
                                    <p><span className="text-slate-400 font-normal">Địa chỉ giao:</span> <strong>{selectedOrder.shippingAddress || "Tại cửa hàng"}</strong></p>
                                    {selectedOrder.note && <p><span className="text-slate-400 font-normal">Ghi chú:</span> <em>{selectedOrder.note}</em></p>}
                                </div>
                            </div>

                            {/* Danh sách sản phẩm trong đơn */}
                            <div className="space-y-3">
                                <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider flex items-center gap-1.5">
                                    <Package className="h-4 w-4 text-orange-600" /> Danh sách sản phẩm ({selectedOrder.items?.length || 0})
                                </h4>
                                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                                    {selectedOrder.items?.map((item: any, idx: number) => (
                                        <div key={idx} className="p-4 flex items-center justify-between gap-4 bg-white hover:bg-slate-50/50">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-500 font-bold flex items-center justify-center text-lg shrink-0">
                                                    🏸
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800">{item.productName}</p>
                                                    <p className="text-xs text-slate-400">SKU: {item.sku} | Số lượng: x{item.quantity}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-slate-900">
                                                    {currencyFormatter.format(item.lineTotal || (item.unitPrice * item.quantity))}
                                                </span>
                                                {selectedOrder.status?.toLowerCase() === "completed" && item.productId && (
                                                    <Link
                                                        to={`/products/${item.productId}?tab=reviews`}
                                                        onClick={() => setSelectedOrder(null)}
                                                        className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs rounded-lg border border-amber-200 transition-colors"
                                                    >
                                                        ⭐ Đánh giá
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tổng thanh toán */}
                            <div className="border-t border-slate-200 pt-4 space-y-1.5 text-right">
                                <p className="text-xs text-slate-500">Tạm tính: <strong>{currencyFormatter.format(selectedOrder.subtotal)}</strong></p>
                                <p className="text-xs text-slate-500">Phí vận chuyển: <strong>{currencyFormatter.format(selectedOrder.shippingFee || 0)}</strong></p>
                                {selectedOrder.discountAmount > 0 && (
                                    <p className="text-xs text-emerald-600">Giảm giá: <strong>-{currencyFormatter.format(selectedOrder.discountAmount)}</strong></p>
                                )}
                                <p className="text-base font-extrabold text-orange-600 pt-2 border-t border-slate-100 mt-2">
                                    Tổng thanh toán: {currencyFormatter.format(selectedOrder.totalAmount)}
                                </p>
                            </div>
                        </div>

                        {/* Footer Modal */}
                        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setSelectedOrder(null)}
                                className="px-6 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all shadow-sm"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}