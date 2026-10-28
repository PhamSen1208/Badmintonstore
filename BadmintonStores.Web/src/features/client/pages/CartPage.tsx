import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";
import { useCart } from "@/features/client/cart/context/CartContext";
import { currencyFormatter } from "@/lib/formatters";

export function CartPage() {
    const { items, updateQuantity, removeFromCart, subtotal, shippingFee, totalAmount } = useCart();

    if (items.length === 0) {
        return (
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
                <div className="h-20 w-20 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto text-3xl">
                    🛍️
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Giỏ hàng của bạn đang trống</h2>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Hãy lựa chọn những mẫu vợt, giày và phụ kiện cầu lông chính hãng ưng ý nhất tại cửa hàng nhé!
                </p>
                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-all shadow-lg shadow-orange-500/20"
                >
                    Khám phá sản phẩm ngay <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="flex items-center gap-3">
                <ShoppingBag className="h-6 w-6 text-orange-500" />
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Giỏ Hàng Của Bạn</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* ── DANH SÁCH SẢN PHẨM TRONG GIỎ (Col-span-8) ── */}
                <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="divide-y divide-slate-100">
                        {items.map((item) => (
                            <div key={`${item.productVariantId}`} className="py-4 flex gap-4 items-center">
                                {/* Ảnh sản phẩm */}
                                <div className="h-20 w-20 rounded-xl bg-slate-100 p-2 shrink-0 flex items-center justify-center">
                                    {item.image ? (
                                        <img src={item.image} alt={item.productName} className="h-full w-full object-contain" />
                                    ) : (
                                        <span className="text-2xl">🏸</span>
                                    )}
                                </div>

                                {/* Thông tin sản phẩm */}
                                <div className="flex-1 min-w-0 space-y-1">
                                    <h3 className="font-bold text-slate-900 text-base line-clamp-1">
                                        {item.productName}
                                    </h3>
                                    {item.selectedVariant && (
                                        <span className="text-xs text-orange-600 font-semibold block">
                                            Phân loại: {item.selectedVariant}
                                        </span>
                                    )}
                                    <span className="font-semibold text-slate-900 text-sm block">
                                        Giá tiền: {currencyFormatter.format(item.basePrice)}
                                    </span>
                                </div>

                                {/* Bộ tăng giảm số lượng */}
                                <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1">
                                    <button
                                        type="button"
                                        onClick={() => updateQuantity(item.productVariantId, item.quantity - 1)}
                                        className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-600"
                                    >
                                        <Minus className="h-3.5 w-3.5" />
                                    </button>
                                    <span className="w-8 text-center font-extrabold text-xs text-slate-900">
                                        {item.quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => updateQuantity(item.productVariantId, item.quantity + 1)}
                                        className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-600"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                    </button>
                                </div>

                                {/* Thành tiền & Nút Xóa */}
                                <div className="text-right space-y-1">
                                    <span className="font-extrabold text-orange-500 text-sm block">
                                        {currencyFormatter.format(item.basePrice * item.quantity)}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => removeFromCart(item.productVariantId)} 
                                        className="text-xs text-slate-400 hover:text-red-500 transition-colors p-1"
                                        title="Xóa"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── BẢNG TÓM TẮT ĐƠN HÀNG (Col-span-4) ── */}
                <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                    <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3 text-lg uppercase">
                        Tóm Tắt Đơn Hàng
                    </h3>

                    <div className="space-y-3 text-xs text-slate-600">
                        <div className="flex justify-between">
                            <span className="text-sm">Tạm tính tiền hàng:</span>
                            <span className="font-bold text-slate-800 text-sm">{currencyFormatter.format(subtotal)}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm">Phí vận chuyển:</span>
                            {shippingFee === 0 ? (
                                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Miễn phí</span>
                            ) : (
                                <span className="font-bold text-slate-800 text-sm">{currencyFormatter.format(shippingFee)}</span>
                            )}
                        </div>

                        {subtotal < 1000000 && (
                            <p className="text-[11px] text-orange-600 bg-orange-50 p-2 rounded-lg font-medium">
                                💡 Mua thêm {currencyFormatter.format(1000000 - subtotal)} để được <strong>Miễn Phí Vận Chuyển</strong>!
                            </p>
                        )}
                    </div>

                    <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
                        <span className="font-bold text-slate-900 text-lg">Tổng thanh toán:</span>
                        <span className="font-black text-orange-500 text-xl">
                            {currencyFormatter.format(totalAmount)}
                        </span>
                    </div>

                    <Link
                        to="/checkout"
                        className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-700 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-orange-500/25 text-center block"
                    >
                        Tiến Hành Thanh Toán
                    </Link>

                    <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        <span>Thanh toán an toàn & bảo mật 100%</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
