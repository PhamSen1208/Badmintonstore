import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { 
    CheckCircle2, ShoppingBag, Phone, Truck, CreditCard, 
    ArrowRight, MapPin, Copy, ShieldCheck, RefreshCw
} from "lucide-react";
import { currencyFormatter } from "@/lib/formatters";
import { toast } from "sonner";

export function OrderSuccessPage() {
    const location = useLocation();
    const orderData = location.state || {};

    const orderId = orderData.orderId || "BDM-89231";
    const formData = orderData.formData || {
        firstName: "Nguyễn",
        lastName: "Văn A",
        phone: "0988123456",
        email: "khachhang@gmail.com",
        city: "Hà Nội",
        ward: "Phường Dịch Vọng",
        streetAddress: "Số 12, ngõ 34 Cầu Giấy",
        paymentMethod: "cod",
    };
    const items = orderData.items || [];
    const subtotal = orderData.subtotal || 0;
    const discount = orderData.discount || 0;
    const totalAmount = orderData.totalAmount || 0;

    // State giả lập kiểm tra thanh toán chuyển khoản QR
    const [paymentStatus, setPaymentStatus] = useState<"pending" | "paid">("pending");
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        if (formData.paymentMethod === "bank_transfer") {
            // Tự động giả lập hệ thống Webhook nhận tiền sau 8 giây
            const timer = setTimeout(() => {
                setPaymentStatus("paid");
                toast.success("🎉 Hệ thống đã nhận được tiền chuyển khoản! Đơn hàng đã được xác nhận thanh toán.");
            }, 8000);
            return () => clearTimeout(timer);
        }
    }, [formData.paymentMethod]);

    function handleCheckPaymentManual() {
        setIsChecking(true);
        setTimeout(() => {
            setPaymentStatus("paid");
            setIsChecking(false);
            toast.success("🎉 Xác nhận thành công! Đã nhận đủ tiền chuyển khoản.");
        }, 1200);
    }

    function handleCopyText(text: string, label: string) {
        navigator.clipboard.writeText(text);
        toast.success(`Đã sao chép ${label}!`);
    }

    return (
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 mt-10">
            
            {/* 1. THANH TIẾN TRÌNH THANH TOÁN (Hoàn thành bước 3 - Xác nhận đơn hàng) */}
            <div className="max-w-3xl mx-auto px-4">
                <div className="flex items-center justify-between relative">
                    <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-emerald-500 -z-10" />
                    
                    {/* Bước 1: Đặt hàng */}
                    <div className="flex flex-col items-center gap-2 bg-white px-2">
                        <div className="h-14 w-14 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shadow-sm">
                            <CheckCircle2 className="h-7 w-7" />
                        </div>
                        <span className="text-xs font-bold text-emerald-600">Đặt hàng</span>
                    </div>

                    {/* Bước 2: Thanh toán */}
                    <div className="flex flex-col items-center gap-2 bg-white px-2">
                        <div className="h-14 w-14 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shadow-sm">
                            <CheckCircle2 className="h-7 w-7" />
                        </div>
                        <span className="text-xs font-bold text-emerald-600">Thanh toán</span>
                    </div>

                    {/* Bước 3: Xác nhận đơn hàng (Active) */}
                    <div className="flex flex-col items-center gap-2 bg-white px-2">
                        <div className="h-16 w-16 rounded-full bg-emerald-600 text-white flex items-center justify-center font-extrabold shadow-lg ring-4 ring-emerald-100">
                            <Phone className="h-8 w-8" />
                        </div>
                        <span className="text-sm font-bold text-emerald-600">Xác nhận đơn hàng</span>
                    </div>

                    {/* Bước 4: Giao hàng */}
                    <div className="flex flex-col items-center gap-2 bg-white px-2">
                        <div className="h-14 w-14 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center font-bold">
                            <Truck className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-semibold text-slate-500">Giao hàng</span>
                    </div>
                </div>
            </div>

            {/* 2. KHUNG THÔNG BÁO THÀNH CÔNG RỰC RỠ (Đã sửa lỗi chữ trắng trên nền trắng) */}
            <div className="bg-emerald-600 text-white p-8 sm:p-10 rounded-3xl shadow-xl text-center space-y-4 relative overflow-hidden">
                <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="h-12 w-12 text-white" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Đặt Hàng Thành Công!</h1>
                <p className="text-sm text-emerald-100 max-w-xl mx-auto font-medium leading-relaxed">
                    Cảm ơn bạn đã tin tưởng mua sắm tại <strong>Badminton Store</strong>. Đơn hàng của bạn đang được chuyên viên chuẩn bị và sẽ sớm được giao tới địa chỉ của bạn!
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold text-white">
                    <span>Mã đơn hàng của bạn:</span>
                    <strong className="text-amber-300 text-sm tracking-wider">{orderId}</strong>
                    <button
                        type="button"
                        onClick={() => handleCopyText(orderId, "Mã đơn hàng")}
                        className="p-1 hover:bg-white/20 rounded transition-colors"
                        title="Sao chép mã đơn"
                    >
                        <Copy className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

            {/* 3. KHUNG THANH TOÁN QR CODE VIETQR (Nếu chọn Chuyển khoản) */}
            {formData.paymentMethod === "bank_transfer" && (
                <div className="bg-orange-50/80 border-2 border-orange-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                    <div className="flex items-center gap-3 border-b border-orange-200 pb-4">
                        <CreditCard className="h-6 w-6 text-orange-500" />
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Quét mã QR để hoàn tất thanh toán</h2>
                            <p className="text-xs text-slate-600">Vui lòng chuyển khoản đúng số tiền và nội dung bên dưới</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                        {/* Ảnh QR Code */}
                        <div className="md:col-span-5 text-center space-y-2">
                            <div className="p-4 bg-white rounded-2xl border border-orange-200 shadow-md inline-block">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=STK:0969299839-MBBank-AMNT:${totalAmount}-DESC:${orderId}`}
                                    alt="Mã QR VietQR chuyển khoản"
                                    className="h-48 w-48 mx-auto object-contain"
                                />
                            </div>
                            <span className="text-[11px] text-slate-500 font-semibold block">Quét bằng ứng dụng ngân hàng bất kỳ</span>
                        </div>

                        {/* Thông tin tài khoản */}
                        <div className="md:col-span-7 space-y-4 text-xs">
                            <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200">
                                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                                    <span className="text-slate-500">Ngân hàng:</span>
                                    <strong className="text-slate-900 text-sm">MBBank (Ngoại Thương / Quân Đội)</strong>
                                </div>
                                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                                    <span className="text-slate-500">Số tài khoản:</span>
                                    <div className="flex items-center gap-2 font-mono font-bold text-slate-900 text-sm">
                                        <span>0969 299 839</span>
                                        <button
                                            type="button"
                                            onClick={() => handleCopyText("0969299839", "Số tài khoản")}
                                            className="text-orange-500 hover:text-orange-600"
                                        >
                                            <Copy className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                                    <span className="text-slate-500">Chủ tài khoản:</span>
                                    <strong className="text-slate-900 uppercase">BADMINTON STORE VIETNAM</strong>
                                </div>
                                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                                    <span className="text-slate-500">Số tiền cần chuyển:</span>
                                    <strong className="text-orange-500 text-base font-black">
                                        {currencyFormatter.format(totalAmount)}
                                    </strong>
                                </div>
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-slate-500">Nội dung chuyển khoản:</span>
                                    <div className="flex items-center gap-2 font-mono font-bold text-emerald-600 text-sm">
                                        <span>{orderId}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleCopyText(orderId, "Nội dung chuyển khoản")}
                                            className="text-orange-500 hover:text-orange-600"
                                        >
                                            <Copy className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Trạng thái thanh toán tự động Realtime */}
                            {paymentStatus === "paid" ? (
                                <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold flex items-center justify-between shadow-md">
                                    <div className="flex items-center gap-2 text-xs">
                                        <CheckCircle2 className="h-5 w-5 text-white" />
                                        <span>Đã nhận đủ tiền chuyển khoản thành công!</span>
                                    </div>
                                    <span className="text-xs bg-white text-emerald-700 px-2.5 py-1 rounded-lg">Đã thanh toán</span>
                                </div>
                            ) : (
                                <div className="p-4 rounded-2xl bg-white border border-orange-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                                    <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                                        <span className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                                        </span>
                                        <span>Đang tự động kiểm tra giao dịch chuyển khoản...</span>
                                    </div>
                                    <button
                                        type="button"
                                        disabled={isChecking}
                                        onClick={handleCheckPaymentManual}
                                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50"
                                    >
                                        <RefreshCw className={`h-3.5 w-3.5 ${isChecking ? "animate-spin" : ""}`} />
                                        <span>Tôi đã chuyển khoản</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 4. BỐ CỤC 2 CỘT THÔNG TIN ĐƠN HÀNG */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                
                {/* ── CỘT TRÁI: THÔNG TIN GIAO HÀNG & THANH TOÁN (Col-span-7) ── */}
                <div className="md:col-span-7 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-orange-500" /> Thông tin giao hàng
                        </h3>
                        <div className="space-y-2 text-xs text-slate-700">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Người nhận:</span>
                                <strong className="text-slate-900">{formData.lastName} {formData.firstName}</strong>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Số điện thoại:</span>
                                <strong className="text-slate-900">{formData.phone}</strong>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Email:</span>
                                <strong className="text-slate-900">{formData.email}</strong>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Địa chỉ giao hàng:</span>
                                <strong className="text-slate-900 text-right max-w-xs">
                                    {formData.streetAddress}, {formData.ward}, {formData.city}
                                </strong>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-slate-100">
                                <span className="text-slate-500">Hình thức thanh toán:</span>
                                <strong className="text-orange-600 font-bold">
                                    {formData.paymentMethod === "cod"
                                        ? "Thanh toán khi nhận hàng (COD)"
                                        : "Chuyển khoản Ngân hàng (QR Code)"}
                                </strong>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                        <span>Đơn hàng được bảo vệ bởi chính sách kiểm tra hàng trước khi nhận của Badminton Store.</span>
                    </div>
                </div>

                {/* ── CỘT PHẢI: BẢNG CHI TIẾT SẢN PHẨM ĐÃ ĐẶT (Col-span-5) ── */}
                <div className="md:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                    <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4 text-orange-500" /> Sản phẩm đã đặt ({items.length})
                    </h3>

                    {items.length > 0 ? (
                        <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
                            {items.map((item: any, idx: number) => (
                                <div key={idx} className="py-3 flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-xl bg-slate-100 p-1 shrink-0 flex items-center justify-center border border-slate-200">
                                        {item.image ? (
                                            <img src={item.image} alt={item.productName} className="h-full w-full object-contain" />
                                        ) : (
                                            <span className="text-xl">🏸</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-slate-900 text-xs line-clamp-1">
                                            {item.productName}
                                        </h4>
                                        <span className="text-[11px] text-slate-500 block">
                                            {item.selectedVariant && `Biến thể: ${item.selectedVariant} | `}SL: {item.quantity}
                                        </span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-900 shrink-0">
                                        {currencyFormatter.format(item.basePrice * item.quantity)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-slate-500 italic">Chi tiết sản phẩm đã lưu vào đơn hàng.</p>
                    )}

                    <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
                        {discount > 0 && (
                            <div className="flex justify-between text-orange-600 font-semibold">
                                <span>Giảm giá Voucher:</span>
                                <span>-{currencyFormatter.format(discount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-baseline pt-1">
                            <span className="font-bold text-slate-900 text-sm">Tổng tiền thanh toán:</span>
                            <span className="font-black text-orange-500 text-lg">
                                {currencyFormatter.format(totalAmount || subtotal)}
                            </span>
                        </div>
                    </div>
                </div>

            </div>

            {/* 5. NÚT ĐIỀU HƯỚNG QUAY LẠI */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-slate-200">
                <Link
                    to="/products"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-orange-500/25 text-center flex items-center justify-center gap-2"
                >
                    Tiếp tục mua sắm <ArrowRight className="h-4 w-4" />
                </Link>
            </div>

        </div>
    );
}
