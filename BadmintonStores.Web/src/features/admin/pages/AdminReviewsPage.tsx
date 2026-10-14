import { useEffect, useState } from "react";
import { MessageSquare, Search, Filter, Trash2, Loader2, Star, CheckCircle2, User, Calendar, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { StarRating } from "@/components/ui/StarRating";
import { getAdminReviews, adminDeleteReview, type AdminReviewItem } from "../reviews/services/admin-reviews.service";

export function AdminReviewsPage() {
    const [reviews, setReviews] = useState<AdminReviewItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [ratingFilter, setRatingFilter] = useState<number | undefined>(undefined);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    async function loadReviews() {
        try {
            setIsLoading(true);
            const data = await getAdminReviews({
                keyword,
                rating: ratingFilter,
                pageNumber,
                pageSize: 10,
            });
            setReviews(data.items || []);
            setTotalPages(data.totalPages || 1);
            setTotalItems(data.totalItems || 0);
        } catch {
            toast.error("Không thể lấy danh sách đánh giá");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadReviews();
    }, [pageNumber, ratingFilter]);

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        setPageNumber(1);
        await loadReviews();
    }

    async function handleDeleteReview(reviewId: number) {
        if (!confirm("Bạn có chắc chắn muốn xóa đánh giá này? Thao tác này không thể hoàn tác.")) return;

        try {
            setDeletingId(reviewId);
            await adminDeleteReview(reviewId);
            toast.success("Đã xóa đánh giá thành công");
            setReviews(prev => prev.filter(item => item.id !== reviewId));
            setTotalItems(prev => Math.max(0, prev - 1));
        } catch {
            toast.error("Không thể xóa đánh giá");
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* 1. HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                        <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Quản lý Đánh giá & Bình luận</h1>
                        <p className="text-sm text-slate-500">Xem, tìm kiếm và quản lý tất cả nhận xét đánh giá của khách hàng</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline" 
                        onClick={loadReviews}
                        className="rounded-xl flex items-center gap-2 text-slate-700"
                    >
                        <RefreshCcw className="w-4 h-4" /> Tải lại
                    </Button>
                </div>
            </div>

            {/* 2. FILTER & SEARCH BAR */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <form onSubmit={handleSearch} className="relative flex-1 w-full">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo sản phẩm, tên khách hàng hoặc nội dung bình luận..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                    />
                </form>

                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                    <Filter className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Lọc theo sao:</span>
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => { setRatingFilter(undefined); setPageNumber(1); }}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                                ratingFilter === undefined
                                    ? "bg-amber-500 text-white shadow-sm"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                            Tất cả
                        </button>
                        {[5, 4, 3, 2, 1].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => { setRatingFilter(star); setPageNumber(1); }}
                                className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                                    ratingFilter === star
                                        ? "bg-amber-500 text-white shadow-sm"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                            >
                                {star} <Star className="w-3 h-3 fill-current" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. BẢNG DANH SÁCH BÌNH LUẬN */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <th className="p-4">Khách hàng</th>
                                <th className="p-4">Sản phẩm</th>
                                <th className="p-4">Đánh giá</th>
                                <th className="p-4">Nội dung nhận xét</th>
                                <th className="p-4">Thời gian</th>
                                <th className="p-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                                            <span>Đang tải danh sách nhận xét...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : reviews.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">
                                        Không tìm thấy bài nhận xét nào phù hợp
                                    </td>
                                </tr>
                            ) : (
                                reviews.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                        {/* Khách hàng */}
                                        <td className="p-4">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs shrink-0 border">
                                                    {item.customerAvatar ? (
                                                        <img src={item.customerAvatar} alt={item.customerName} className="w-full h-full rounded-full object-cover" />
                                                    ) : (
                                                        <User className="w-4 h-4" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm">{item.customerName}</p>
                                                    {item.isVerifiedPurchase && (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-0.5">
                                                            <CheckCircle2 className="w-3 h-3" /> Đã mua hàng
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Sản phẩm */}
                                        <td className="p-4">
                                            <p className="font-semibold text-slate-800 text-sm line-clamp-2 max-w-xs">
                                                {item.productName || `Sản phẩm #${item.productId}`}
                                            </p>
                                        </td>

                                        {/* Số sao */}
                                        <td className="p-4 whitespace-nowrap">
                                            <div className="space-y-1">
                                                <StarRating rating={item.rating} size="sm" />
                                                <span className="text-xs font-bold text-slate-500">{item.rating}/5 sao</span>
                                            </div>
                                        </td>

                                        {/* Nội dung nhận xét */}
                                        <td className="p-4">
                                            <p className="text-slate-700 text-xs sm:text-sm bg-slate-50 p-3 rounded-xl border border-slate-100 max-w-md leading-relaxed">
                                                "{item.comment}"
                                            </p>
                                        </td>

                                        {/* Thời gian */}
                                        <td className="p-4 whitespace-nowrap text-xs text-slate-500">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                <span>{new Date(item.createdAt).toLocaleDateString("vi-VN")}</span>
                                            </div>
                                        </td>

                                        {/* Thao tác */}
                                        <td className="p-4 text-right whitespace-nowrap">
                                            <button
                                                type="button"
                                                disabled={deletingId === item.id}
                                                onClick={() => handleDeleteReview(item.id)}
                                                title="Xóa đánh giá vi phạm"
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                                            >
                                                {deletingId === item.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between p-4 border-t border-slate-100 text-sm">
                        <span className="text-slate-500">Trang {pageNumber} / {totalPages} (Tổng {totalItems} đánh giá)</span>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={pageNumber <= 1}
                                onClick={() => setPageNumber(prev => prev - 1)}
                            >
                                Trước
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={pageNumber >= totalPages}
                                onClick={() => setPageNumber(prev => prev + 1)}
                            >
                                Sau
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
