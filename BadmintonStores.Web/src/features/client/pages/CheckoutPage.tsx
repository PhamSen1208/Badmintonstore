import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ShoppingBag, CreditCard, Phone, Truck,
    ArrowLeft, ShieldCheck, ChevronRight, MapPin,
    Ticket, Tag, X, CheckCircle2, Gift, Loader2
} from "lucide-react";
import { useCart } from "@/features/client/cart/context/CartContext";
import { useAuth } from "@/features/auth/hooks/useAuth"
import { currencyFormatter } from "@/lib/formatters";
import { toast } from "sonner";
import { createClientOrder } from "../services/client-order.service";
import { validateCoupon, getAvailableCoupons, type CouponItemResponse } from "../services/coupon.service";

export function CheckoutPage() {
    const navigate = useNavigate();
    const { items, subtotal, shippingFee, totalAmount, clearCart } = useCart();
    const {user} = useAuth();

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
        paymentMethod: "cod" as "cash" | "bank_transfer",
    });

    // State Voucher / Coupon
    const [voucherCode, setVoucherCode] = useState("");
    const [appliedDiscount, setAppliedDiscount] = useState(0);
    const [appliedCouponCode, setAppliedCouponCode] = useState("");
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State Modal gợi ý Voucher
    const [showCouponModal, setShowCouponModal] = useState(false);
    const [availableCoupons, setAvailableCoupons] = useState<CouponItemResponse[]>([]);
    const [isLoadingCoupons, setIsLoadingCoupons] = useState(false);

    // Xử lý áp dụng mã giảm giá thật từ API
    async function handleApplyVoucher(e?: React.FormEvent, codeToApply?: string) {
        if (e) e.preventDefault();
        const code = (codeToApply || voucherCode).trim();
        if (!code) {
            toast.error("Vui lòng nhập mã giảm giá");
            return;
        }

        setIsValidatingCoupon(true);
        try {
            const result = await validateCoupon(code, subtotal);
            if (result.isValid) {
                setAppliedDiscount(result.discountAmount);
                setAppliedCouponCode(result.couponCode);
                setVoucherCode(result.couponCode);
                toast.success(result.message || `Áp dụng mã ${result.couponCode} thành công!`);
                setShowCouponModal(false);
            } else {
                toast.error(result.message || "Mã giảm giá không hợp lệ");
            }
        } catch (err: any) {
            const errorMsg = err?.response?.data?.message || "Mã giảm giá không hợp lệ hoặc không đủ điều kiện";
            toast.error(errorMsg);
        } finally {
            setIsValidatingCoupon(false);
        }
    }

    // Bỏ áp dụng mã giảm giá
    function handleRemoveVoucher() {
        setAppliedDiscount(0);
        setAppliedCouponCode("");
        setVoucherCode("");
        toast.info("Đã hủy áp dụng mã giảm giá");
    }

    // Mở modal chọn mã giảm giá
    async function handleOpenCouponModal() {
        setShowCouponModal(true);
        setIsLoadingCoupons(true);
        try {
            const list = await getAvailableCoupons();
            setAvailableCoupons(list);
        } catch (err) {
            console.error(err);
            toast.error("Không thể tải danh sách mã giảm giá khả dụng");
        } finally {
            setIsLoadingCoupons(false);
        }
    }

    // Xử lý Submit đặt hàng
    async function handleSubmitOrder(e: React.FormEvent) {
        e.preventDefault();
        if (!formData.firstName || !formData.lastName || !formData.phone || !formData.streetAddress) {
            toast.error("Vui lòng điền đầy đủ các thông tin có dấu (*)");
            return;
        }
        setIsSubmitting(true);

        try {
            const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
            const fullAddress = `${formData.streetAddress.trim()}, ${formData.ward}, ${formData.city}`;

            const payload = {
                customerId: user?.customerId || 1,
                warehouseId: 1,
                fullName: fullName,
                fullAddress: fullAddress, 
                shippingPhone: formData.phone,
                shippingAddress: fullAddress,
                shippingFee: shippingFee,
                discountAmount: appliedDiscount,
                couponCode: appliedCouponCode || undefined,
                note: formData.note || "Không có ghi chú",
                items: items.map(item => ({
                    productVariantId: item.productVariantId,   
                    quantity: item.quantity,
                    unitPrice: item.basePrice
                })),
                payment: {
                    paymentMethod: formData.paymentMethod
                }
            };
            // Call api tạo đơn hàng ở backend
            const result = await createClientOrder(payload);
            // Tạo đơn hàng xong thì xóa hết trong cart
            clearCart();
            toast.success("Đặt hàng thành công");

            // Chuyển hướng sang trang OrderSuccessPage kèm theo kết quả từ API thật
            navigate("/order-success", {
                state: {
                    orderId: result.orderCode || `BDM-${result.orderId}`,
                    formData: formData,
                    items: [...items],
                    subtotal: subtotal,
                    shippingFee: shippingFee,
                    discount: appliedDiscount,
                    totalAmount: result.totalAmount || Math.max(0, totalAmount - appliedDiscount),
                }
            });
        }
        catch (error: any) {
            console.log("Đặt hàng thất bại", error);
            toast.error("Đặt hàng không thành công, vui lòng thử lại");
        }
        finally {
            setIsSubmitting(false);
        }
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
                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${formData.paymentMethod === "cash"
                                                ? "border-orange-500 bg-orange-50/50 text-slate-900 font-bold"
                                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            checked={formData.paymentMethod === "cash"}
                                            onChange={() => setFormData({ ...formData, paymentMethod: "cash" })}
                                            className="h-4 w-4 text-orange-500 focus:ring-orange-500"
                                        />
                                        <div>
                                            <span className="text-xs font-bold block">Thanh toán khi nhận hàng (COD)</span>
                                            <span className="text-[11px] text-slate-500 font-normal">Trả tiền mặt trực tiếp cho shipper</span>
                                        </div>
                                    </label>

                                    <label
                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${formData.paymentMethod === "bank_transfer"
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

                        {/* Ô Nhập & Quản lý Mã Giảm Giá */}
                        <div className="pt-3 border-t border-slate-800 space-y-3">
                            {appliedCouponCode ? (
                                <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-3 flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2.5">
                                        <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                            <Tag className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                                                <span>{appliedCouponCode}</span>
                                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                                            </div>
                                            <span className="text-[11px] text-emerald-400/80">
                                                Giảm {currencyFormatter.format(appliedDiscount)}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleRemoveVoucher}
                                        className="h-7 w-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                                        title="Bỏ áp dụng mã"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <input
                                                type="text"
                                                placeholder="Nhập mã giảm giá"
                                                value={voucherCode}
                                                onChange={(e) => setVoucherCode(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        handleApplyVoucher();
                                                    }
                                                }}
                                                className="w-full h-11 px-4 text-xs font-medium text-slate-900 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 uppercase placeholder:normal-case"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            disabled={isValidatingCoupon || !voucherCode.trim()}
                                            onClick={(e) => handleApplyVoucher(e)}
                                            className="px-5 h-11 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-orange-500/20 whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5"
                                        >
                                            {isValidatingCoupon ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                "Áp dụng"
                                            )}
                                        </button>
                                    </div>
                                    
                                    <button
                                        type="button"
                                        onClick={handleOpenCouponModal}
                                        className="w-full py-2 px-3 bg-slate-800/80 hover:bg-slate-800 text-orange-400 hover:text-orange-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-slate-700/50 cursor-pointer"
                                    >
                                        <Ticket className="h-4 w-4" />
                                        <span>Xem danh sách mã giảm giá dành cho bạn</span>
                                    </button>
                                </div>
                            )}
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
                                    <span>Mã giảm giá ({appliedCouponCode}):</span>
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

            {/* MODAL DANH SÁCH MÃ GIẢM GIÁ KHẢ DỤNG */}
            {showCouponModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-5 bg-linear-to-r from-orange-500 to-amber-500 text-white flex items-center justify-between">
                            <div className="flex items-center gap-2 font-bold text-base">
                                <Ticket className="h-5 w-5" />
                                <span>Mã giảm giá khả dụng</span>
                            </div>
                            <button
                                onClick={() => setShowCouponModal(false)}
                                className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all cursor-pointer"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
                            {isLoadingCoupons ? (
                                <div className="py-8 text-center text-slate-400 flex flex-col items-center gap-2">
                                    <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                                    <span className="text-xs font-medium">Đang tìm mã giảm giá phù hợp...</span>
                                </div>
                            ) : availableCoupons.length === 0 ? (
                                <div className="py-8 text-center text-slate-400 space-y-2">
                                    <Gift className="h-10 w-10 mx-auto text-slate-300" />
                                    <p className="text-xs font-medium text-slate-500">
                                        Hiện không có mã giảm giá nào khả dụng cho đơn hàng này.
                                    </p>
                                </div>
                            ) : (
                                availableCoupons.map((c) => {
                                    const isMinAmountMet = subtotal >= c.minOrderAmount;
                                    return (
                                        <div
                                            key={c.couponId}
                                            className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                                                isMinAmountMet
                                                    ? "border-orange-200 bg-orange-50/40 hover:border-orange-400"
                                                    : "border-slate-200 bg-slate-50 opacity-60"
                                            }`}
                                        >
                                            <div className="space-y-1 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2.5 py-0.5 rounded-lg bg-orange-500 text-white font-extrabold text-xs tracking-wide">
                                                        {c.couponCode}
                                                    </span>
                                                    {c.discountType === 1 ? (
                                                        <span className="text-xs font-bold text-orange-600">
                                                            Giảm {c.discountValue}%
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs font-bold text-orange-600">
                                                            Giảm {currencyFormatter.format(c.discountValue)}
                                                        </span>
                                                    )}
                                                </div>

                                                {c.description && (
                                                    <p className="text-xs text-slate-600 font-medium">
                                                        {c.description}
                                                    </p>
                                                )}

                                                <div className="text-[11px] text-slate-500 space-y-0.5 pt-1">
                                                    {c.minOrderAmount > 0 && (
                                                        <div>Đơn tối thiểu: {currencyFormatter.format(c.minOrderAmount)}</div>
                                                    )}
                                                    {c.maxDiscountAmount && c.discountType === 1 && (
                                                        <div>Giảm tối đa: {currencyFormatter.format(c.maxDiscountAmount)}</div>
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                disabled={!isMinAmountMet || isValidatingCoupon}
                                                onClick={() => handleApplyVoucher(undefined, c.couponCode)}
                                                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl transition-all shrink-0 cursor-pointer shadow-sm"
                                            >
                                                {isMinAmountMet ? "Áp dụng" : "Chưa đủ ĐK"}
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                            <button
                                type="button"
                                onClick={() => setShowCouponModal(false)}
                                className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
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
