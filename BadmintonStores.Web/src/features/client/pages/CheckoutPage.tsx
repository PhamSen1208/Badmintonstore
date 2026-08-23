import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
    ShoppingBag, CreditCard, Phone, Truck, 
    ArrowLeft, ShieldCheck, ChevronRight ,MapPin, 
} from "lucide-react";
import { useCart } from "@/features/client/cart/context/CartContext";
import { currencyFormatter } from "@/lib/formatters";
import { toast } from "sonner";

export function CheckoutPage() {
    const navigate = useNavigate();
    const { items, subtotal, shippingFee, totalAmount, clearCart } = useCart();

    // State Form thông tin giao hàng
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        dob: "",
        city: "",
        ward: "",
        streetAddress: "",
        note: "",
        paymentMethod: "cod" as "cod" | "bank_transfer",
    });

    // State Voucher
    const [voucherCode, setVoucherCode] = useState("");
    const [appliedDiscount, setAppliedDiscount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Xử lý áp dụng mã giảm giá mẫu
    function handleApplyVoucher(e: React.FormEvent) {
        e.preventDefault();
        if (!voucherCode.trim()) {
            toast.error("Vui lòng nhập mã giảm giá");
            return;
        }
        if (voucherCode.toUpperCase() === "BADMINTON10" || voucherCode.toUpperCase() === "FBSHOP") {
            setAppliedDiscount(50000);
            toast.success("Áp dụng mã giảm giá 50.000 ₫ thành công!");
        } else {
            toast.error("Mã giảm giá không hợp lệ hoặc đã hết hạn!");
        }
    }

    // Xử lý Submit đặt hàng
    function handleSubmitOrder(e: React.FormEvent) {
        e.preventDefault();
        if (!formData.firstName || !formData.lastName || !formData.phone || !formData.streetAddress) {
            toast.error("Vui lòng điền đầy đủ các thông tin có dấu (*)");
            return;
        }

        setIsSubmitting(true);
        const orderId = "BDM-" + Math.floor(100000 + Math.random() * 900000);
        const orderState = {
            orderId,
            formData,
            items: [...items],
            subtotal,
            shippingFee,
            discount: appliedDiscount,
            totalAmount: Math.max(0, totalAmount - appliedDiscount),
        };

        setTimeout(() => {
            clearCart();
            toast.success("Đặt hàng thành công! Cảm ơn bạn đã mua hàng.");
            setIsSubmitting(false);
            navigate("/order-success", { state: orderState });
        }, 1000);
    }

    const finalTotal = Math.max(0, totalAmount - appliedDiscount);

    if (items.length === 0) {
        return (
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
                <div className="h-20 w-20 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto text-3xl">
                    🛒
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Giỏ hàng của bạn đang trống</h2>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Vui lòng chọn sản phẩm vào giỏ hàng trước khi tiến hành thanh toán nhé!
                </p>
                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-all shadow-lg shadow-orange-500/20"
                >
                    Khám phá sản phẩm <ChevronRight className="h-4 w-4" />
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-20 mt-20">
            
            {/* 1. THANH TIẾN TRÌNH THANH TOÁN (Step Bar chuẩn FBShop) */}
            <div className="max-w-3xl mx-auto px-4">
                <div className="flex items-center justify-between relative">
                    {/* Line nối giữa các step */}
                    <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-slate-200 -z-10" />
                    
                    {/* Bước 1: Đặt hàng */}
                    <div className="flex flex-col items-center gap-2 px-2">
                        <div className="h-20 w-20 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center font-bold shadow-sm">
                            <ShoppingBag className="h-10 w-10" />
                        </div>
                        <span className="text-sm font-semibold text-slate-500">Đặt hàng</span>
                    </div>

                    {/* Bước 2: Thanh toán (Active Step) */}
                    <div className="flex flex-col items-center gap-2 px-2">
                        <div className="h-20 w-20 rounded-full bg-emerald-600 text-white flex items-center justify-center font-extrabold shadow-md ring-4 ring-emerald-100">
                            <CreditCard className="h-10 w-10" />
                        </div>
                        <span className="text-sm font-semibold text-emerald-600">Thanh toán</span>
                    </div>

                    {/* Bước 3: Xác nhận đơn hàng */}
                    <div className="flex flex-col items-center gap-2 px-2">
                        <div className="h-20 w-20 rounded-full bg-orange-50 text-orange-400 flex items-center justify-center font-bold">
                            <Phone className="h-10 w-10" />
                        </div>
                        <span className="text-sm font-semibold text-slate-400">Xác nhận đơn hàng</span>
                    </div>

                    {/* Bước 4: Giao hàng */}
                    <div className="flex flex-col items-center gap-2 px-2">
                        <div className="h-20 w-20 rounded-full bg-orange-50 text-orange-400 flex items-center justify-center font-bold">
                            <Truck className="h-10 w-10" />
                        </div>
                        <span className="text-sm font-semibold text-slate-400">Giao hàng</span>
                    </div>
                </div>
            </div>

            <h1 className="text-3xl font-black text-slate-900 text-center tracking-tight">Thanh toán</h1>

            {/* 2. BỐ CỤC CHÍNH 2 CỘT */}
            <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                
                {/* ── CỘT TRÁI: THÔNG TIN NHẬN HÀNG (Col-span-7) ── */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-orange-500" /> Thông tin nhận hàng
                        </h2>

                        <div className="space-y-4">
                            {/* Họ & Tên */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Tên <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Nhập tên của bạn"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full h-11 px-4 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Họ <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Nhập họ của bạn"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full h-11 px-4 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>

                            {/* Ngày sinh & Số điện thoại */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Ngày sinh (tùy chọn)</label>
                                    <input
                                        type="date"
                                        value={formData.dob}
                                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                        className="w-full h-11 px-4 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Số điện thoại <span className="text-red-500">*</span></label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="Nhập số điện thoại"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full h-11 px-4 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700">Email <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    required
                                    placeholder="Nhập Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full h-11 px-4 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                                />
                            </div>

                            {/* Tỉnh/Thành phố & Xã/Phường */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Tỉnh/Thành phố <span className="text-red-500">*</span></label>
                                    <select
                                        required
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full h-11 px-4 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                                    >
                                        <option value="">Chọn tỉnh/thành phố</option>
                                        <option value="HN">Hà Nội</option>
                                        <option value="HCM">TP. Hồ Chí Minh</option>
                                        <option value="DN">Đà Nẵng</option>
                                        <option value="HP">Hải Phòng</option>
                                        <option value="BD">Bình Dương</option>
                                        <option value="DN2">Đồng Nai</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Xã/Phường <span className="text-red-500">*</span></label>
                                    <select
                                        required
                                        value={formData.ward}
                                        onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                                        className="w-full h-11 px-4 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                                    >
                                        <option value="">Chọn xã/phường</option>
                                        <option value="P1">Phường 1</option>
                                        <option value="P2">Phường 2</option>
                                        <option value="P3">Phường Dịch Vọng</option>
                                        <option value="P4">Phường Bến Nghé</option>
                                    </select>
                                </div>
                            </div>

                            {/* Số nhà, tên đường */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700">Số nhà, tên đường <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Nhập số nhà, tên đường"
                                    value={formData.streetAddress}
                                    onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                                    className="w-full h-11 px-4 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                                />
                            </div>

                            {/* Phương thức thanh toán */}
                            <div className="space-y-3 pt-4 border-t border-slate-100">
                                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                                    Phương thức thanh toán:
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <label
                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                                            formData.paymentMethod === "cod"
                                                ? "border-orange-500 bg-orange-50/50 text-slate-900 font-bold"
                                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            checked={formData.paymentMethod === "cod"}
                                            onChange={() => setFormData({ ...formData, paymentMethod: "cod" })}
                                            className="h-4 w-4 text-orange-500 focus:ring-orange-500"
                                        />
                                        <div>
                                            <span className="text-xs font-bold block">Thanh toán khi nhận hàng (COD)</span>
                                            <span className="text-[11px] text-slate-500 font-normal">Trả tiền mặt trực tiếp cho shipper</span>
                                        </div>
                                    </label>

                                    <label
                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                                            formData.paymentMethod === "bank_transfer"
                                                ? "border-orange-500 bg-orange-50/50 text-slate-900 font-bold"
                                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            checked={formData.paymentMethod === "bank_transfer"}
                                            onChange={() => setFormData({ ...formData, paymentMethod: "bank_transfer" })}
                                            className="h-4 w-4 text-orange-500 focus:ring-orange-500"
                                        />
                                        <div>
                                            <span className="text-xs font-bold block">Chuyển khoản Ngân hàng (QR)</span>
                                            <span className="text-[11px] text-slate-500 font-normal">Quét mã QR VietQR tự động</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                        </div>
                    </div>

                    <Link
                        to="/cart"
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-orange-500 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" /> Quay lại giỏ hàng
                    </Link>
                </div>

                {/* ── CỘT PHẢI: THẺ TÓM TẮT ĐƠN HÀNG DẠNG TICKET DARK (Col-span-5 - Chuẩn FBShop) ── */}
                <div className="lg:col-span-5">
                    <div className="bg-[#0B1528] text-white p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6 border border-slate-800 relative overflow-hidden">
                        
                        {/* Đường viền thiết kế răng cưa vé xem phim ở 2 bên cạnh */}
                        <div className="border-b border-slate-800/80 pb-4">
                            <h3 className="text-xl font-bold text-white text-center">
                                Đơn hàng của bạn
                            </h3>
                        </div>

                        {/* Danh sách sản phẩm trong đơn */}
                        <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                                <span>Sản phẩm</span>
                                <span className="bg-orange-500 text-white font-bold px-2 py-0.5 rounded-full text-[10px]">
                                    {items.length}
                                </span>
                            </div>

                            <div className="divide-y divide-slate-800">
                                {items.map((item) => (
                                    <div key={`${item.productId}-${item.selectedVariant}`} className="py-3 flex items-center gap-3">
                                        <div className="h-14 w-14 rounded-xl bg-slate-800 p-1 shrink-0 flex items-center justify-center border border-slate-700">
                                            {item.image ? (
                                                <img src={item.image} alt={item.productName} className="h-full w-full object-contain" />
                                            ) : (
                                                <span className="text-xl">🏸</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-slate-100 text-xs line-clamp-1">
                                                {item.productName}
                                            </h4>
                                            {item.selectedVariant && (
                                                <span className="text-[11px] text-slate-400 block">
                                                    Biến thể: {item.selectedVariant}
                                                </span>
                                            )}
                                            <span className="text-xs font-semibold text-orange-400 block">
                                                {item.quantity} x {currencyFormatter.format(item.basePrice)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Ô Nhập Mã Giảm Giá */}
                        <div className="pt-2 border-t border-slate-800">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        placeholder="Mã giảm giá"
                                        value={voucherCode}
                                        onChange={(e) => setVoucherCode(e.target.value)}
                                        className="w-full h-11 px-4 text-xs font-medium text-slate-900 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleApplyVoucher}
                                    className="px-5 h-11 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-orange-500/20 whitespace-nowrap cursor-pointer"
                                >
                                    Sử dụng
                                </button>
                            </div>
                        </div>

                        {/* Chi tiết tính tiền */}
                        <div className="space-y-2.5 text-xs border-t border-slate-800 pt-4 text-slate-300">
                            <div className="flex justify-between">
                                <span>Tạm tính tiền hàng:</span>
                                <span className="font-bold text-slate-100">{currencyFormatter.format(subtotal)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Phí vận chuyển:</span>
                                {shippingFee === 0 ? (
                                    <span className="font-bold text-emerald-400">Miễn phí</span>
                                ) : (
                                    <span className="font-bold text-slate-100">{currencyFormatter.format(shippingFee)}</span>
                                )}
                            </div>
                            {appliedDiscount > 0 && (
                                <div className="flex justify-between text-orange-400 font-bold">
                                    <span>Mã giảm giá:</span>
                                    <span>-{currencyFormatter.format(appliedDiscount)}</span>
                                </div>
                            )}
                        </div>

                        {/* Tổng tiền */}
                        <div className="border-t border-slate-800 pt-4 flex justify-between items-baseline">
                            <span className="font-extrabold text-base text-white">Tổng tiền</span>
                            <span className="font-black text-orange-500 text-2xl">
                                {currencyFormatter.format(finalTotal)}
                            </span>
                        </div>

                        {/* Nút Đặt hàng */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            <ShoppingBag className="h-5 w-5 fill-white" />
                            {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
                        </button>

                        <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                            <ShieldCheck className="h-4 w-4 text-emerald-400" />
                            <span>Bảo mật thông tin đơn hàng 100%</span>
                        </div>

                    </div>
                </div>

            </form>

        </div>
    );
}
