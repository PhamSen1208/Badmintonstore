import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { getMyWishlist, type WishlistItem } from "../services/wishlist.service";
import { useWishlist } from "../context/WishlistContext";
import { currencyFormatter } from "@/lib/formatters";
import { toast } from "sonner";

export function MyWishlistPage() {
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toggleFavorite } = useWishlist();

    async function loadWishlist() {
        try {
            setIsLoading(true);
            const data = await getMyWishlist();
            setWishlistItems(Array.isArray(data) ? data : []);
        } catch {
            toast.error("Không thể lấy danh sách sản phẩm yêu thích");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadWishlist();
    }, []);

    async function handleRemove(productId: number) {
        await toggleFavorite(productId);
        setWishlistItems(prev => prev.filter(item => item.productId !== productId));
    }

    return (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-2xl bg-red-50 text-red-600 font-bold flex items-center justify-center text-lg shrink-0 border border-red-100 shadow-2xs">
                        <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Sản Phẩm Yêu Thích</h2>
                        <p className="text-xs text-slate-500">Danh sách các món đồ bạn đã lưu lại ({wishlistItems.length} sản phẩm)</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="py-20 text-center text-slate-400 space-y-2">
                    <div className="inline-block animate-spin h-7 w-7 border-3 border-orange-500 border-t-transparent rounded-full"></div>
                    <p className="text-xs font-semibold">Đang tải danh sách yêu thích của bạn...</p>
                </div>
            ) : wishlistItems.length === 0 ? (
                <div className="py-16 text-center space-y-4">
                    <div className="h-20 w-20 mx-auto rounded-3xl bg-red-50 text-red-400 flex items-center justify-center text-3xl border border-red-100 shadow-2xs">
                        🤍
                    </div>
                    <div className="space-y-1">
                        <p className="font-extrabold text-slate-800 text-base">Danh sách yêu thích đang trống!</p>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            Hãy nhấn biểu tượng trái tim ở các sản phẩm bạn quan tâm để lưu trữ và xem lại bất cứ lúc nào.
                        </p>
                    </div>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-2xl shadow-lg shadow-orange-500/25 transition-all"
                    >
                        <span>Khám phá sản phẩm ngay</span>
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map(item => (
                        <div
                            key={item.productId}
                            className="group relative bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:border-orange-500/30 transition-all duration-300 flex flex-col justify-between"
                        >
                            <div className="space-y-3">
                                {/* Thumbnail Product Image */}
                                <div className="aspect-square w-full rounded-xl bg-slate-50 overflow-hidden relative flex items-center justify-center border border-slate-100">
                                    {item.primaryImageUrl ? (
                                        <img
                                            src={item.primaryImageUrl}
                                            alt={item.productName}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <span className="text-5xl opacity-40 group-hover:scale-110 transition-transform">🏸</span>
                                    )}

                                    {item.brandName && (
                                        <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg text-[10px] font-black bg-slate-900/80 backdrop-blur-md text-white shadow-2xs">
                                            {item.brandName}
                                        </span>
                                    )}

                                    {/* Nút Xóa khỏi Wishlist */}
                                    <button
                                        type="button"
                                        onClick={() => handleRemove(item.productId)}
                                        title="Bỏ thích"
                                        className="absolute top-2.5 right-2.5 h-8 w-8 rounded-full bg-white/90 backdrop-blur-md shadow-sm flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Thông tin sản phẩm */}
                                <div className="space-y-1">
                                    <span className="text-[10px] font-extrabold text-orange-600 uppercase tracking-wider block">
                                        {item.categoryName || "Cầu lông"}
                                    </span>
                                    <Link
                                        to={`/products/${item.productId}`}
                                        className="font-bold text-slate-900 text-sm line-clamp-2 hover:text-orange-600 transition-colors"
                                    >
                                        {item.productName}
                                    </Link>
                                </div>
                            </div>

                            {/* Footer card */}
                            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                                <div>
                                    <p className="text-[10px] text-slate-400 font-medium">Giá bán</p>
                                    <span className="font-black text-orange-600 text-base">
                                        {currencyFormatter.format(item.basePrice)}
                                    </span>
                                </div>
                                <Link
                                    to={`/products/${item.productId}`}
                                    className="px-3.5 py-2 bg-slate-900 hover:bg-orange-500 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                                >
                                    <ShoppingBag className="h-3.5 w-3.5" />
                                    <span>Xem chi tiết</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
