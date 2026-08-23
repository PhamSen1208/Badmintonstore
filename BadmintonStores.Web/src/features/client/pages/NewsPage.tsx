import { useState } from "react";
import { Link } from "react-router-dom";
import { 
    Search, Calendar, Eye, ChevronRight, User,
    Sparkles, ArrowRight, X
} from "lucide-react";

export type NewsArticle = {
    id: string;
    title: string;
    category: "review" | "technique" | "tournament";
    categoryName: string;
    excerpt: string;
    content: string;
    image: string;
    author: string;
    date: string;
    views: number;
    readTime: string;
    isFeatured?: boolean;
};

const mockArticles: NewsArticle[] = [
    {
        id: "1",
        title: "Top 5 Mẫu Vợt Cầu Lông Trợ Lực Cho Người Mới Chơi Tốt Nhất 2026",
        category: "review",
        categoryName: "Review & Chọn thiết bị",
        excerpt: "Bài viết tổng hợp những cây vợt nhẹ đầu, thân dẻo giúp người mới chơi dễ dàng làm quen, vung vợt thoát gió và trợ lực cực tốt.",
        content: `Cầu lông là bộ môn thể thao đòi hỏi sự kết hợp giữa thể lực, kỹ thuật và thiết bị phù hợp. Đối với người mới bắt đầu, việc chọn một cây vợt quá cứng hoặc quá nặng có thể gây chấn thương cổ tay và làm giảm cảm hứng tập luyện.

### 1. Yonex Astrox 77 Play - Sự lựa chọn quốc dân
Với thiết kế thân dẻo, trọng lượng 4U (khoảng 83g) và công nghệ Isometric mở rộng điểm ngọt, Yonex Astrox 77 Play mang lại khả năng trợ lực tối đa cho những pha đập cầu và phông cầu đi cao sâu.

### 2. Li-Ning Halbertec 2000
Dòng vợt công thủ toàn diện cực kỳ dễ chơi của Li-Ning. Khung vợt được gia cố bằng sợi carbon đúc mỏng giúp tăng độ bền và độ thoát gió vượt trội.

### Lời khuyên khi chọn vợt cho người mới:
- Chọn thông số 4U (80g - 84g) hoặc 5U (75g - 79g).
- Độ cứng thân vợt: Dẻo hoặc Trung bình.
- Mức căng cước ban đầu: 9.5kg - 10.5kg (21 - 23 lbs).`,
        image: "https://images.unsplash.com/photo-1626225967045-94408422615d?w=800&q=80",
        author: "Chuyên viên Kỹ thuật BS",
        date: "20/08/2026",
        views: 1420,
        readTime: "5 phút",
        isFeatured: true,
    },
    {
        id: "2",
        title: "Hướng Dẫn Kỹ Thuật Đập Cầu Cắm Sân Uy Lực Chuẩn Thi Đấu",
        category: "technique",
        categoryName: "Kỹ thuật & Mẹo chơi",
        excerpt: "Bí quyết giúp bạn gia tăng lực phát cầu, uốn cong cổ tay và dồn toàn bộ trọng lượng cơ thể vào cú Smash hạ gục đối thủ.",
        content: `Cú đập cầu (Smash) luôn là vũ khí tấn công uy lực nhất trong môn cầu lông. Để có một cú đập cắm sân mạnh mẽ, bạn cần nắm vững 3 yếu tố cốt lõi:

1. **Điểm tiếp xúc cầu**: Phải ở vị trí cao nhất trên không và hơi chếch về phía trước mặt.
2. **Kỹ thuật dùng cổ tay**: Phát lực gập cổ tay nhanh tại thời điểm tiếp xúc cầu thay vì dùng toàn bộ lực cánh tay.
3. **Bộ chân di chuyển (Footwork)**: Lùi bước nhanh và lấy đà giậm nhảy đúng thời điểm.`,
        image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80",
        author: "HLV Quốc gia Badminton",
        date: "18/08/2026",
        views: 2150,
        readTime: "7 phút",
    },
    {
        id: "3",
        title: "Cập Nhật Giải Cầu Lông BWF World Tour Finals 2026",
        category: "tournament",
        categoryName: "Giải đấu & Ngôi sao",
        excerpt: "Điểm qua những trận cầu kịch tính, sự trở lại ấn tượng của các tay vợt top đầu thế giới và kết quả bốc thăm mới nhất.",
        content: `Giải đấu quy tụ 8 tay vợt xuất sắc nhất thế giới ở từng hạng mục thi đấu. Với tiền thưởng kỷ lục lên tới 2.5 triệu USD, đây hứa hẹn sẽ là chiến trường nảy lửa nhất năm 2026.`,
        image: "https://images.unsplash.com/photo-1521537634581-0dced2efa2a7?w=800&q=80",
        author: "Ban Biên Tập BS",
        date: "15/08/2026",
        views: 980,
        readTime: "4 phút",
    },
    {
        id: "4",
        title: "Bí Quyết Bảo Quản Vợt & Căng Cước Đúng Cách Tránh Gãy Khung",
        category: "review",
        categoryName: "Review & Chọn thiết bị",
        excerpt: "Những thói quen nhỏ giúp kéo dài tuổi thọ vợt cầu lông, tránh bị đứt cước đột ngột và nứt gãy khung khi va chạm.",
        content: `Nhiều người chơi thường mắc sai lầm khi để vợt trong cốp xe máy nóng rực hoặc căng mức kg quá sức chịu đựng của khung vợt...`,
        image: "https://images.unsplash.com/photo-1626225967045-94408422615d?w=800&q=80",
        author: "Kỹ thuật viên Căng cước",
        date: "12/08/2026",
        views: 1840,
        readTime: "6 phút",
    },
];

export function NewsPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [readingArticle, setReadingArticle] = useState<NewsArticle | null>(null);

    const featuredArticle = mockArticles.find(a => a.isFeatured) || mockArticles[0];

    const filteredArticles = mockArticles.filter(art => {
        const matchCategory = selectedCategory === "all" || art.category === selectedCategory;
        const matchSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
    });

    return (
        <div className="w-full space-y-12 pb-16">
            
            {/* 1. BANNER NỔI BẬT GÓC LÔNG THỦ */}
            <div className="w-full bg-linear-to-r from-slate-900 via-slate-800 to-orange-950 text-white py-12 sm:py-16 shadow-lg">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
                                <Sparkles className="h-3.5 w-3.5" /> Kiến thức & Tin tức cầu lông
                            </span>
                            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                                Góc Lông Thủ <span className="text-orange-500">Badminton Stores</span>
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-medium">
                                Tổng hợp kinh nghiệm chọn thiết bị, kỹ thuật chơi cầu và cập nhật các giải đấu cầu lông mới nhất!
                            </p>
                        </div>

                        {/* Ô Tìm kiếm bài viết */}
                        <div className="relative w-full md:w-80">
                            <input
                                type="text"
                                placeholder="Tìm kiếm bài viết..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-11 pl-10 pr-4 text-xs font-medium text-white bg-slate-800/90 border border-slate-700 rounded-xl focus:outline-none focus:border-orange-500"
                            />
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        </div>
                    </div>

                </div>
            </div>

            {/* BREADCRUMB */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Link to="/" className="hover:text-orange-500">Trang chủ</Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="font-semibold text-slate-800">Tin tức & Bài viết</span>
                </div>
            </div>

            {/* 2. TAB PHÂN LOẠI BÀI VIẾT */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-0.5">
                    <button
                        type="button"
                        onClick={() => setSelectedCategory("all")}
                        className={`px-5 py-2.5 text-xs font-bold rounded-t-xl transition-all whitespace-nowrap cursor-pointer ${
                            selectedCategory === "all"
                                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                    >
                        Tất cả bài viết
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedCategory("review")}
                        className={`px-5 py-2.5 text-xs font-bold rounded-t-xl transition-all whitespace-nowrap cursor-pointer ${
                            selectedCategory === "review"
                                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                    >
                        ⚙️ Review & Chọn thiết bị
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedCategory("technique")}
                        className={`px-5 py-2.5 text-xs font-bold rounded-t-xl transition-all whitespace-nowrap cursor-pointer ${
                            selectedCategory === "technique"
                                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                    >
                        🏸 Kỹ thuật & Mẹo chơi
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedCategory("tournament")}
                        className={`px-5 py-2.5 text-xs font-bold rounded-t-xl transition-all whitespace-nowrap cursor-pointer ${
                            selectedCategory === "tournament"
                                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                    >
                        🏆 Giải đấu & Ngôi sao
                    </button>
                </div>
            </div>

            {/* 3. BỐ CỤC BÀI VIẾT NỔI BẬT & LƯỚI BÀI VIẾT */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                
                {/* Bài viết Featured ở trên (chỉ hiện khi xem Tất cả) */}
                {selectedCategory === "all" && !searchQuery && (
                    <div 
                        onClick={() => setReadingArticle(featuredArticle)}
                        className="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl transition-all overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 cursor-pointer group"
                    >
                        <div className="lg:col-span-7 h-72 sm:h-96 overflow-hidden relative">
                            <img
                                src={featuredArticle.image}
                                alt={featuredArticle.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <span className="absolute top-4 left-4 px-3 py-1 bg-orange-500 text-white font-bold text-[11px] rounded-lg uppercase shadow-md">
                                ★ Nổi bật nhất
                            </span>
                        </div>

                        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                            <div className="space-y-3">
                                <span className="text-xs font-extrabold text-orange-500 uppercase tracking-wider">
                                    {featuredArticle.categoryName}
                                </span>
                                <h2 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-orange-500 transition-colors leading-snug">
                                    {featuredArticle.title}
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                                    {featuredArticle.excerpt}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                                <div className="flex items-center gap-2">
                                    <User className="h-3.5 w-3.5 text-orange-500" />
                                    <span>{featuredArticle.author}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {featuredArticle.date}</span>
                                    <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {featuredArticle.views}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Lưới các bài viết */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArticles.map((article) => (
                        <div
                            key={article.id}
                            onClick={() => setReadingArticle(article)}
                            className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-4 shadow-xs hover:shadow-xl hover:border-orange-400/40 transition-all flex flex-col justify-between cursor-pointer group"
                        >
                            <div className="space-y-3">
                                <div className="aspect-video w-full rounded-xl bg-slate-100 overflow-hidden relative">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/80 backdrop-blur-xs text-white">
                                        {article.categoryName}
                                    </span>
                                </div>

                                <div className="space-y-1.5">
                                    <h3 className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-orange-500 transition-colors leading-snug">
                                        {article.title}
                                    </h3>
                                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                        {article.excerpt}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {article.date}</span>
                                <span className="flex items-center gap-1 text-orange-500 font-semibold">
                                    Đọc ngay <ArrowRight className="h-3 w-3" />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* 4. MODAL ĐỌC CHI TIẾT BÀI VIẾT */}
            {readingArticle && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto space-y-6 p-6 sm:p-8 relative border border-slate-200">
                        
                        <button
                            type="button"
                            onClick={() => setReadingArticle(null)}
                            className="absolute top-4 right-4 h-9 w-9 rounded-full bg-slate-100 text-slate-600 hover:bg-orange-500 hover:text-white transition-colors flex items-center justify-center cursor-pointer"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="space-y-3 border-b border-slate-100 pb-4">
                            <span className="px-3 py-1 rounded-md bg-orange-500 text-white font-bold text-[10px] uppercase">
                                {readingArticle.categoryName}
                            </span>
                            <h2 className="text-2xl font-extrabold text-slate-900 leading-snug pr-8">
                                {readingArticle.title}
                            </h2>
                            <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                                <span>✍️ {readingArticle.author}</span>
                                <span>📅 {readingArticle.date}</span>
                                <span>⏱️ {readingArticle.readTime} đọc</span>
                            </div>
                        </div>

                        <div className="rounded-2xl overflow-hidden max-h-80">
                            <img src={readingArticle.image} alt={readingArticle.title} className="w-full h-full object-cover" />
                        </div>

                        <div className="prose prose-slate text-sm text-slate-700 leading-relaxed space-y-4 whitespace-pre-line">
                            {readingArticle.content}
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                            <Link
                                to="/products"
                                onClick={() => setReadingArticle(null)}
                                className="px-5 py-2.5 rounded-xl bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md hover:bg-orange-600 transition-colors"
                            >
                                Xem các sản phẩm hot liên quan <ArrowRight className="h-4 w-4" />
                            </Link>
                            <button
                                type="button"
                                onClick={() => setReadingArticle(null)}
                                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
                            >
                                Đóng bài viết
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
