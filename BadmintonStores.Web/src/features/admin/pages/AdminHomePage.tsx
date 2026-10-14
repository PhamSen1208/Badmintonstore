import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    TrendingUp,
    ShoppingCart,
    Package,
    Users,
    ArrowUpRight,
    ArrowDownRight,
    Plus,
    AlertTriangle,
    ArrowRight,
    ChevronRight,
    RotateCcw,
    Loader2,
    Award,
    Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { currencyFormatter } from "@/lib/formatters";
import { toast } from "sonner";
import {
    getDashboardOverview,
    getRevenueChart
} from "../dashboard/services/dashboard.service";
import type {
    DashboardOverviewResponse,
    RevenueChartItem,
    RevenueChartQuery
} from "../dashboard/types/dashboard.types";
import { getOrders } from "../orders/services/admin-orders.service";

interface DrillBreadcrumb {
    title: string;
    query: RevenueChartQuery;
}

export function AdminHomePage() {
    const currentYear = new Date().getFullYear();

    const [overviewData, setOverviewData] = useState<DashboardOverviewResponse | null>(null);
    const [chartItems, setChartItems] = useState<RevenueChartItem[]>([]);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isChartLoading, setIsChartLoading] = useState(false);
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);

    // Mặc định xem 12 Tháng của năm hiện tại
    const [breadcrumbStack, setBreadcrumbStack] = useState<DrillBreadcrumb[]>([
        { title: `Năm ${currentYear}`, query: { viewType: "month", year: currentYear } }
    ]);

    useEffect(() => {
        async function loadDashboard() {
            try {
                setIsLoading(true);
                const initialQuery: RevenueChartQuery = { viewType: "month", year: currentYear };
                const data = await getDashboardOverview(initialQuery);
                setOverviewData(data);
                setChartItems(data.revenueChart);

                // Lấy 5 đơn hàng mới nhất
                const ordersRes = await getOrders({ pageNumber: 1, pageSize: 5 });
                setRecentOrders(ordersRes.items);
            } catch (err) {
                console.error(err);
                toast.error("Không thể nạp dữ liệu thống kê từ máy chủ");
            } finally {
                setIsLoading(false);
            }
        }

        loadDashboard();
    }, []);

    // Xử lý đổi năm từ Dropdown
    async function handleYearChange(year: number) {
        setSelectedYear(year);
        const newQuery: RevenueChartQuery = { viewType: "month", year };
        setIsChartLoading(true);
        try {
            const newChart = await getRevenueChart(newQuery);
            setChartItems(newChart);
            setBreadcrumbStack([{ title: `Năm ${year}`, query: newQuery }]);
        } catch (err) {
            toast.error("Lỗi khi chuyển năm báo cáo");
        } finally {
            setIsChartLoading(false);
        }
    }

    // Xử lý khi người dùng Click vào một cột trên Biểu đồ (Drill-down)
    async function handleBarClick(item: RevenueChartItem) {
        if (!item.nextViewType) return; // Nếu đã là ngày nhỏ nhất thì không click nữa

        let nextQuery: RevenueChartQuery = { viewType: item.nextViewType };
        let nextTitle = "";

        if (item.nextViewType === "week") {
            nextQuery.year = item.yearValue;
            nextQuery.month = item.monthValue;
            nextTitle = `Tháng ${item.monthValue}/${item.yearValue}`;
        } else if (item.nextViewType === "day") {
            nextQuery.year = item.yearValue;
            nextQuery.month = item.monthValue;
            nextQuery.week = item.weekValue;
            nextTitle = `Tuần ${item.weekValue} (T${item.monthValue}/${item.yearValue})`;
        }

        setIsChartLoading(true);
        try {
            const newChart = await getRevenueChart(nextQuery);
            setChartItems(newChart);
            setBreadcrumbStack((prev) => [...prev, { title: nextTitle, query: nextQuery }]);
        } catch (err) {
            toast.error("Lỗi khi tải dữ liệu chi tiết");
        } finally {
            setIsChartLoading(false);
        }
    }

    // Xử lý khi người dùng bấm vào Breadcrumb để quay lại cấp cha
    async function handleBreadcrumbClick(index: number) {
        if (index === breadcrumbStack.length - 1) return;

        const target = breadcrumbStack[index];
        setIsChartLoading(true);
        try {
            const newChart = await getRevenueChart(target.query);
            setChartItems(newChart);
            setBreadcrumbStack((prev) => prev.slice(0, index + 1));
        } catch (err) {
            toast.error("Lỗi khi tải lại dữ liệu");
        } finally {
            setIsChartLoading(false);
        }
    }

    // Reset về chế độ xem 12 Tháng của năm được chọn
    async function handleResetChart() {
        if (breadcrumbStack.length === 1) return;
        handleBreadcrumbClick(0);
    }

    if (isLoading || !overviewData) {
        return (
            <div className="py-20 text-center text-slate-500 flex flex-col items-center gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
                <span className="text-sm font-medium">Đang tổng hợp báo cáo kinh doanh...</span>
            </div>
        );
    }

    const { kpis, lowStockAlerts, topSellingProducts } = overviewData;
    const maxRevenue = Math.max(...chartItems.map((i) => i.revenue), 1);

    return (
        <div className="space-y-6">
            {/* Header Welcoming */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tổng quan Cửa hàng</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Báo cáo hoạt động kinh doanh, doanh thu và cảnh báo tồn kho thực tế.
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button asChild className="bg-emerald-600 hover:bg-emerald-700 font-bold">
                        <Link to="/admin/orders">
                            <Plus className="h-4 w-4 mr-1" />
                            Lên đơn bán tại quầy
                        </Link>
                    </Button>
                </div>
            </div>

            {/* 4 Thẻ Chỉ Số Metric Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Thẻ 1: Tổng Doanh Thu */}
                <div className="rounded-2xl border bg-white p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng Doanh Thu</span>
                        <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-black text-slate-900">
                            {currencyFormatter.format(kpis.totalRevenue)}
                        </div>
                        <div className={`flex items-center gap-1 text-xs font-bold mt-1 ${kpis.revenueGrowthPercent >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                            {kpis.revenueGrowthPercent >= 0 ? (
                                <ArrowUpRight className="h-4 w-4" />
                            ) : (
                                <ArrowDownRight className="h-4 w-4" />
                            )}
                            <span>{kpis.revenueGrowthPercent >= 0 ? `+${kpis.revenueGrowthPercent}%` : `${kpis.revenueGrowthPercent}%`} so với tháng trước</span>
                        </div>
                    </div>
                </div>

                {/* Thẻ 2: Tổng Đơn Hàng */}
                <div className="rounded-2xl border bg-white p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng Đơn Hàng</span>
                        <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
                            <ShoppingCart className="h-5 w-5" />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-black text-slate-900">{kpis.totalOrders} Đơn</div>
                        <div className={`flex items-center gap-1 text-xs font-bold mt-1 ${kpis.ordersGrowthPercent >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                            {kpis.ordersGrowthPercent >= 0 ? (
                                <ArrowUpRight className="h-4 w-4" />
                            ) : (
                                <ArrowDownRight className="h-4 w-4" />
                            )}
                            <span>{kpis.ordersGrowthPercent >= 0 ? `+${kpis.ordersGrowthPercent}%` : `${kpis.ordersGrowthPercent}%`} tăng trưởng đơn</span>
                        </div>
                    </div>
                </div>

                {/* Thẻ 3: Tồn Kho Sản Phẩm */}
                <div className="rounded-2xl border bg-white p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tồn Kho Sản Phẩm</span>
                        <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
                            <Package className="h-5 w-5" />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-black text-slate-900">{kpis.totalStockQuantity} Sản phẩm</div>
                        <div className="text-xs text-slate-500 font-medium mt-1">Đang quản lý trong hệ thống</div>
                    </div>
                </div>

                {/* Thẻ 4: Tổng Khách Hàng */}
                <div className="rounded-2xl border bg-white p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Khách Hàng</span>
                        <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-black text-slate-900">{kpis.totalCustomers} Thành viên</div>
                        <div className="text-xs text-slate-500 font-medium mt-1">Khách hàng registered shop</div>
                    </div>
                </div>
            </div>

            {/* Hàng Biểu đồ Doanh Thu Tương tác Drill-down & Cảnh báo Tồn kho */}
            <div className="grid gap-6 lg:grid-cols-7 items-start">
                {/* ── BIỂU ĐỒ DOANH THU DRILL-DOWN (Chiếm 4 cột) ── */}
                <div className="lg:col-span-4 rounded-2xl border bg-white p-6 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-emerald-600" /> Biểu Đồ Doanh Thu Phân Tích
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Click trực tiếp vào cột để xem chi tiết
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Dropdown chọn Năm */}
                            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                                <select
                                    value={selectedYear}
                                    onChange={(e) => handleYearChange(Number(e.target.value))}
                                    className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                                >
                                    {[currentYear, currentYear - 1, currentYear - 2].map((yr) => (
                                        <option key={yr} value={yr}>Năm {yr}</option>
                                    ))}
                                </select>
                            </div>

                            {breadcrumbStack.length > 1 && (
                                <button
                                    onClick={handleResetChart}
                                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-all shrink-0 cursor-pointer"
                                >
                                    <RotateCcw className="h-3.5 w-3.5" /> Xem 12 tháng
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Thanh Breadcrumb Điều hướng Drill-down */}
                    <div className="flex items-center flex-wrap gap-1.5 bg-slate-50 p-2.5 rounded-xl text-xs font-medium border border-slate-200">
                        <span className="text-slate-400 font-bold text-[11px] uppercase mr-1">Đang xem:</span>
                        {breadcrumbStack.map((item, index) => {
                            const isLast = index === breadcrumbStack.length - 1;
                            return (
                                <div key={index} className="flex items-center gap-1">
                                    {index > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-400" />}
                                    <button
                                        onClick={() => handleBreadcrumbClick(index)}
                                        disabled={isLast}
                                        className={`px-2.5 py-1 rounded-lg transition-all ${
                                            isLast
                                                ? "bg-emerald-600 text-white font-bold shadow-xs"
                                                : "text-slate-600 hover:bg-slate-200 hover:text-slate-900 font-semibold cursor-pointer"
                                        }`}
                                    >
                                        {item.title}
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Khung Biểu đồ Cột Visual với khoảng trống cho Tooltip */}
                    <div className="relative min-h-72">
                        {isChartLoading && (
                            <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center z-20 rounded-xl">
                                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                            </div>
                        )}

                        {chartItems.length === 0 ? (
                            <div className="py-16 text-center text-slate-400 text-xs font-medium">
                                Không có dữ liệu doanh thu trong khoảng thời gian này.
                            </div>
                        ) : (
                            <div className="overflow-x-auto pt-16 pb-2 border-b border-slate-200">
                                <div className="flex items-end justify-between h-64 gap-2 sm:gap-3">
                                    {chartItems.map((item, index) => {
                                        const heightPercent = Math.max(6, (item.revenue / maxRevenue) * 100);
                                        const isClickable = Boolean(item.nextViewType);

                                        return (
                                            <div
                                                key={index}
                                                onClick={() => isClickable && handleBarClick(item)}
                                                className={`flex-1 min-w-8 flex flex-col items-center gap-1.5 group h-full justify-end relative ${
                                                    isClickable ? "cursor-pointer" : ""
                                                }`}
                                            >
                                                {/* Tooltip NỔI NỀN TỐI + CHỮ TRẮNG NỔI BẬT */}
                                                <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 absolute -top-14 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-white text-[11px] py-1.5 px-3 rounded-sm shadow-2xl pointer-events-none z-30 whitespace-nowrap text-center">
                                                    <div className="font-extrabold text-emerald-400">
                                                        {currencyFormatter.format(item.revenue)}
                                                    </div>
                                                    <div className="text-[10px] text-slate-300 font-medium">
                                                        {item.orderCount} đơn hàng
                                                    </div>
                                                    {/* Mũi tên tam giác trỏ xuống đầu cột */}
                                                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 border-4 border-transparent border-t-slate-900" />
                                                </div>

                                                {/* Thỏi cột Biểu đồ */}
                                                <div
                                                    style={{ height: `${heightPercent}%` }}
                                                    className={`w-full transition-all duration-300 ${isClickable ? "bg-emerald-700 group-hover:scale-105 shadow-sm shadow-emerald-600/30" : "bg-emerald-700"}`}
                                                />

                                                {/* Nhãn bên dưới cột */}
                                                <span className="text-[11px] text-slate-600 font-bold tracking-tight line-clamp-1 text-center group-hover:text-emerald-700">
                                                    {item.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── CẢNH BÁO TỒN KHO THẤP & TOP BÁN CHẠY (Chiếm 3 cột) ── */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Thẻ Cảnh báo Tồn kho */}
                    <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b pb-3">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-amber-500" />
                                <h2 className="text-base font-bold text-slate-900">Tồn Kho Sắp Hết (≤ 5)</h2>
                            </div>
                            <Button variant="ghost" size="sm" asChild className="text-xs text-blue-600 hover:text-blue-700 font-bold">
                                <Link to="/admin/stocks">
                                    Quản lý kho <ArrowRight className="h-3.5 w-3.5 ml-1" />
                                </Link>
                            </Button>
                        </div>

                        <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                            {lowStockAlerts.length === 0 ? (
                                <div className="py-6 text-center text-slate-400 text-xs">
                                    Không có sản phẩm nào chạm ngưỡng hết hàng 👍
                                </div>
                            ) : (
                                lowStockAlerts.map((item) => (
                                    <div key={item.productVariantId} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                                        <div className="space-y-0.5 min-w-0 pr-2">
                                            <p className="text-xs font-bold text-slate-800 truncate" title={item.productName}>
                                                {item.productName}
                                            </p>
                                            <p className="text-[11px] text-slate-500">SKU: {item.sku}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-extrabold bg-red-100 text-red-700 border border-red-200">
                                                Còn {item.stockQuantity} SP
                                            </span>
                                            <p className="text-[10px] text-slate-400 mt-0.5">{item.warehouseName}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Thẻ Top 5 Sản phẩm Bán chạy */}
                    <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b pb-3">
                            <div className="flex items-center gap-2">
                                <Award className="h-5 w-5 text-orange-500" />
                                <h2 className="text-base font-bold text-slate-900">Top Bán Chạy Nhất</h2>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {topSellingProducts.length === 0 ? (
                                <div className="py-6 text-center text-slate-400 text-xs">
                                    Chưa có dữ liệu sản phẩm bán chạy.
                                </div>
                            ) : (
                                topSellingProducts.map((p, idx) => (
                                    <div key={p.productId} className="flex items-center justify-between gap-3 text-xs">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <span className={`h-6 w-6 rounded-full flex items-center justify-center font-black text-[11px] shrink-0 ${
                                                idx === 0 ? "bg-amber-500 text-white" : idx === 1 ? "bg-slate-300 text-slate-800" : idx === 2 ? "bg-amber-700 text-white" : "bg-slate-100 text-slate-600"
                                            }`}>
                                                {idx + 1}
                                            </span>
                                            <span className="font-bold text-slate-800 truncate" title={p.productName}>
                                                {p.productName}
                                            </span>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className="font-extrabold text-orange-500 block">
                                                {p.totalQuantitySold} đã bán
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-medium">
                                                {currencyFormatter.format(p.totalRevenue)}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* BẢNG 5 ĐƠN HÀNG VỪA PHÁT SINH THỰC TẾ */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Đơn Hàng Mới Nhất</h2>
                        <p className="text-xs text-slate-500">Các đơn hàng vừa được khởi tạo trên hệ thống</p>
                    </div>
                    <Button variant="outline" size="sm" asChild className="font-bold text-xs">
                        <Link to="/admin/orders">
                            Xem tất cả đơn hàng <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-600 border-b font-bold">
                            <tr>
                                <th className="p-3">Mã đơn</th>
                                <th className="p-3">Người nhận</th>
                                <th className="p-3">Số điện thoại</th>
                                <th className="p-3">Tổng tiền</th>
                                <th className="p-3">Trạng thái đơn</th>
                                <th className="p-3">Thanh toán</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                            {recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-slate-400">
                                        Chưa có đơn hàng nào vừa tạo.
                                    </td>
                                </tr>
                            ) : (
                                recentOrders.map((ord) => (
                                    <tr key={ord.orderId} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="p-3 font-bold text-slate-900">{ord.orderCode}</td>
                                        <td className="p-3 font-semibold text-slate-800">{ord.recipientName || "Khách mua tại shop"}</td>
                                        <td className="p-3 text-slate-500">{ord.shippingPhone || "—"}</td>
                                        <td className="p-3 font-extrabold text-emerald-600">
                                            {currencyFormatter.format(ord.totalAmount)}
                                        </td>
                                        <td className="p-3">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                {ord.status}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                                                {ord.paymentStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
