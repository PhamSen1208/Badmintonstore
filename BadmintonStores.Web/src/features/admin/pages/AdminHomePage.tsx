import { Link } from "react-router-dom";
import {
    TrendingUp,
    ShoppingCart,
    Package,
    Users,
    ArrowUpRight,
    Plus,
    AlertTriangle,
    ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { currencyFormatter } from "@/lib/formatters";

export function AdminHomePage() {
    // Dữ liệu mẫu doanh thu 6 tháng gần nhất
    const monthlyRevenue = [
        { month: "Thg 3", revenue: 85000000, height: "45%" },
        { month: "Thg 4", revenue: 102000000, height: "60%" },
        { month: "Thg 5", revenue: 98000000, height: "55%" },
        { month: "Thg 6", revenue: 125000000, height: "75%" },
        { month: "Thg 7", revenue: 140000000, height: "85%" },
        { month: "Thg 8", revenue: 158400000, height: "100%" },
    ];

    // Dữ liệu mẫu 4 đơn hàng vừa tạo
    const recentOrders = [
        { code: "ORD000007", customer: "Hoàng Thị Thu Hiền", amount: 2450000, status: "confirmed", payment: "paid", date: "Hôm nay, 14:30" },
        { code: "ORD000006", customer: "Phạm Việt Đức", amount: 1850000, status: "confirmed", payment: "unpaid", date: "Hôm nay, 11:15" },
        { code: "ORD000005", customer: "Nguyễn Văn A", amount: 3200000, status: "confirmed", payment: "paid", date: "Hôm qua, 18:00" },
        { code: "ORD000004", customer: "Nguyễn Văn Thành", amount: 950000, status: "cancelled", payment: "refunded", date: "Hôm qua, 09:20" },
    ];

    // Dữ liệu mẫu cảnh báo tồn kho thấp (dưới 5 SP)
    const lowStockItems = [
        { name: "Vợt Yonex Astrox 88D Pro (4U)", sku: "YONEX-88D-PRO-4U", stock: 2, warehouse: "Kho Tổng Hà Nội" },
        { name: "Giày Badminton Victor P9200 (Size 42)", sku: "VIC-P9200-42", stock: 1, warehouse: "Kho Chi Nhánh Đống Đa" },
        { name: "Vợt Lining Halbertec 8000 (3U)", sku: "LINING-HB8000-3U", stock: 3, warehouse: "Kho Tổng Hà Nội" },
    ];

    return (
        <div className="space-y-6">
            {/* Header Welcoming */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Tổng quan Cửa hàng</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Chào mừng trở lại! Dưới đây là báo cáo hoạt động kinh doanh và tồn kho hôm nay.
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                        <Link to="/admin/orders">
                            <Plus className="h-4 w-4 mr-1" />
                            Lên đơn bán tại quầy
                        </Link>
                    </Button>
                </div>
            </div>

            {/* 4 Thẻ Chỉ Số Metric Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Thẻ Doanh Thu */}
                <div className="rounded-xl border bg-white p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Tổng Doanh Thu</span>
                        <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-900">158.400.000 ₫</div>
                        <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium mt-1">
                            <ArrowUpRight className="h-3.5 w-3.5" />
                            <span>+14.2% so với tháng trước</span>
                        </div>
                    </div>
                </div>

                {/* Thẻ Đơn Hàng */}
                <div className="rounded-xl border bg-white p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Tổng Đơn Hàng</span>
                        <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                            <ShoppingCart className="h-5 w-5" />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-900">84 Đơn</div>
                        <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium mt-1">
                            <ArrowUpRight className="h-3.5 w-3.5" />
                            <span>+8.5% đơn hàng mới</span>
                        </div>
                    </div>
                </div>

                {/* Thẻ Tổng Tồn Kho */}
                <div className="rounded-xl border bg-white p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Tồn Kho Sản Phẩm</span>
                        <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                            <Package className="h-5 w-5" />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-900">1.420 Sản phẩm</div>
                        <div className="text-xs text-muted-foreground mt-1">Đang quản lý tại 4 kho</div>
                    </div>
                </div>

                {/* Thẻ Khách Hàng */}
                <div className="rounded-xl border bg-white p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Khách Hàng</span>
                        <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-900">68 Khách</div>
                        <div className="text-xs text-muted-foreground mt-1">Khách hàng thành viên shop</div>
                    </div>
                </div>
            </div>

            {/* Hàng Biểu đồ Doanh Thu & Cảnh báo Tồn kho */}
            <div className="grid gap-6 lg:grid-cols-7">
                {/* Biểu đồ Doanh thu (Chiếm 4 cột) */}
                <div className="lg:col-span-4 rounded-xl border bg-white p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Doanh Thu Theo Tháng</h2>
                            <p className="text-xs text-muted-foreground">Thống kê 6 tháng gần nhất năm 2026</p>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                            Đỉnh điểm: Thg 8
                        </span>
                    </div>

                    {/* Khung Biểu đồ Cột Visual */}
                    <div className="pt-6 pb-2">
                        <div className="flex items-end justify-between h-48 gap-3 border-b pb-2">
                            {monthlyRevenue.map((item, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                                    <div className="text-[10px] font-semibold text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {(item.revenue / 1000000).toFixed(0)}M
                                    </div>
                                    <div
                                        style={{ height: item.height }}
                                        className="w-full bg-emerald-500 rounded-t-md group-hover:bg-emerald-600 transition-colors"
                                    />
                                    <span className="text-xs text-muted-foreground font-medium">{item.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Thẻ Cảnh báo Tồn kho thấp (Chiếm 3 cột) */}
                <div className="lg:col-span-3 rounded-xl border bg-white p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                            <h2 className="text-base font-bold text-slate-900">Cảnh Báo Tồn Kho Thấp</h2>
                        </div>
                        <Button variant="ghost" size="sm" asChild className="text-xs text-blue-600 hover:text-blue-700">
                            <Link to="/admin/inventory-transactions">
                                Nhật ký kho <ArrowRight className="h-3.5 w-3.5 ml-1" />
                            </Link>
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {lowStockItems.map((item, idx) => (
                            <div key={idx} className="p-3 bg-slate-50 rounded-lg border flex items-center justify-between">
                                <div className="space-y-0.5 max-w-50px">
                                    <p className="text-sm font-semibold text-slate-800 truncate" title={item.name}>
                                        {item.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                                </div>
                                <div className="text-right">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
                                        Còn {item.stock} SP
                                    </span>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">{item.warehouse}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bảng Đơn Hàng Vừa Phát Sinh */}
            <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Đơn Hàng Vừa Gần Đây</h2>
                        <p className="text-xs text-muted-foreground">Các đơn hàng vừa được khởi tạo bởi thu ngân hoặc khách hàng</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                        <Link to="/admin/orders">
                            Xem tất cả đơn hàng <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-600 border-b">
                            <tr>
                                <th className="p-3">Mã đơn</th>
                                <th className="p-3">Khách hàng</th>
                                <th className="p-3">Tổng tiền</th>
                                <th className="p-3">Trạng thái đơn</th>
                                <th className="p-3">Thanh toán</th>
                                <th className="p-3">Thời gian</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {recentOrders.map((ord, i) => (
                                <tr key={i} className="hover:bg-slate-50/50">
                                    <td className="p-3 font-semibold text-slate-900">{ord.code}</td>
                                    <td className="p-3 font-medium">{ord.customer}</td>
                                    <td className="p-3 font-bold text-emerald-600">{currencyFormatter.format(ord.amount)}</td>
                                    <td className="p-3">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                            ord.status === "confirmed" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                                        }`}>
                                            {ord.status === "confirmed" ? "Đã xác nhận" : "Đã hủy"}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                            ord.payment === "paid" ? "bg-blue-100 text-blue-800" : ord.payment === "unpaid" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-800"
                                        }`}>
                                            {ord.payment === "paid" ? "Đã thanh toán" : ord.payment === "unpaid" ? "Chưa thanh toán" : "Đã hoàn tiền"}
                                        </span>
                                    </td>
                                    <td className="p-3 text-xs text-muted-foreground">{ord.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
