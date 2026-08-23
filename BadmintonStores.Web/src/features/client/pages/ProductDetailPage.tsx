import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronRight, PhoneCall, ShoppingBag, Zap, Plus, Minus, Sliders, Star } from "lucide-react";
import { getProductById } from "@/features/admin/products/services/admin-product.service";
import { useCart } from "@/features/client/cart/context/CartContext";
import type { ClientProductDetail, ProductSpecification } from "@/features/client/types/client-product.types";
import { currencyFormatter } from "@/lib/formatters";

const defaultSpecifications: ProductSpecification[] = [
    { label: "Độ cứng thân vợt", value: "Trung bình - Cứng" },
    { label: "Khung vợt", value: "HM Graphite / Nanocell NEO / SUPER HMG" },
    { label: "Thân vợt", value: "HM Graphite / Slim Shaft" },
    { label: "Trọng lượng / Chu vi cán", value: "4U (Ave.83g) G5, 3U (Ave.88g) G5" },
    { label: "Sức căng tối đa", value: "4U: 20 - 28 lbs (12.5kg), 3U: 21 - 29 lbs (13kg)" },
    { label: "Điểm cân bằng", value: "295 ± 2 mm (Hơi nặng đầu)" },
    { label: "Lối chơi phù hợp", value: "Công thủ toàn diện, hơi thiên công" },
    { label: "Xuất xứ", value: "Nhật Bản / Đài Loan" },
];

export function ProductDetailPage() {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { productId } = useParams<{ productId: string }>();
    const [product, setProduct] = useState<ClientProductDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // State điều khiển Tab thông tin chi tiết (Mô tả, Thông số, Đánh giá)
    const [activeTab, setActiveTab] = useState<"description" | "specifications" | "reviews">("description");

    // State chọn ảnh, chọn biến thể & số lượng
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedWeight, setSelectedWeight] = useState<string>("4U"); // "2U |  3U" | "4U | 5U"
    const [quantity, setQuantity] = useState<number>(1);

    function handleAddToCart() {
        if (!product) return;
        addToCart(
            {
                productId: product.productId,
                productCode: product.productCode,
                productName: product.productName,
                basePrice: product.basePrice,
                image: mockImages[selectedImageIndex],
                selectedVariant: selectedWeight,
            },
            quantity
        );
    }

    function handleBuyNow() {
        handleAddToCart();
        navigate("/cart");
    }

    // Ảnh mẫu thử nghiệm
    const mockImages = [
        "https://images.unsplash.com/photo-1626225967045-94408422615d?w=800&q=80",
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80",
        "https://images.unsplash.com/photo-1521537634581-0dced2efa2a7?w=800&q=80",
    ];

    useEffect(() => {
        async function loadProductDetail() {
            if (!productId) return;
            try {
                setIsLoading(true);
                const data = await getProductById(Number(productId));
                setProduct({
                    ...data,
                    stockQuantity: 10,
                    images: mockImages,
                });
            } catch {
                setProduct(null);
            } finally {
                setIsLoading(false);
            }
        }
        loadProductDetail();
    }, [productId]);

    if (isLoading) {
        return (
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-slate-500">
                Đang tải thông tin chi tiết sản phẩm...
            </div>
        );
    }

    if (!product) {
        return (
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
                <h2 className="text-2xl font-bold text-slate-800">Sản phẩm không tồn tại</h2>
                <p className="text-xs text-slate-500">Sản phẩm có thể đã bị xóa hoặc đường dẫn không đúng.</p>
                <Link to="/products" className="inline-block px-5 py-2.5 bg-orange-500 text-white rounded-xl text-xs font-bold">
                    Quay lại danh sách sản phẩm
                </Link>
            </div>
        );
    }

    const isOutOfStock = product.stockQuantity <= 0;

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            
            {/* 1. BREADCRUMB */}
            <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                <Link to="/" className="hover:text-orange-500">Trang chủ</Link>
                <ChevronRight className="h-3 w-3" />
                <Link to="/products" className="hover:text-orange-500">Dụng cụ cầu lông</Link>
                <ChevronRight className="h-3 w-3" />
                <span className="font-semibold text-slate-900 line-clamp-1">{product.productName}</span>
            </div>

            {/* 2. BỐ CỤC CHÍNH 2 CỘT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                
                {/* ── CỘT TRÁI: BỘ SƯU TẬP ẢNH SẢN PHẨM (Col-span-5) ── */}
                <div className="lg:col-span-5 space-y-4">
                    {/* Khung ảnh chính lớn */}
                    <div className="aspect-square w-full rounded-2xl bg-white border border-slate-200 p-4 flex items-center justify-center relative overflow-hidden shadow-sm">
                        <img
                            src={mockImages[selectedImageIndex]}
                            alt={product.productName}
                            className="h-full w-full object-contain hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-orange-500 text-white font-bold text-[10px] uppercase">
                            Chính hãng 100%
                        </span>
                    </div>

                    {/* Hàng Thumbnails ảnh góc khác */}
                    <div className="flex gap-3 overflow-x-auto pb-1">
                        {mockImages.map((img, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setSelectedImageIndex(idx)}
                                className={`h-20 w-20 rounded-xl bg-white border-2 p-1 overflow-hidden shrink-0 transition-all ${
                                    selectedImageIndex === idx ? "border-orange-500 shadow-md" : "border-slate-200 opacity-70 hover:opacity-100"
                                }`}
                            >
                                <img src={img} alt="Thumbnail" className="h-full w-full object-contain" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── CỘT PHẢI: THÔNG TIN VÀ ĐẶT HÀNG (Col-span-7) ── */}
                <div className="lg:col-span-7 space-y-6">
                    
                    {/* Tên sản phẩm & Badges */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            {product.brandName && (
                                <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-white text-xs font-bold">
                                    {product.brandName}
                                </span>
                            )}
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                            {product.productName}
                        </h1>

                        {/* Xuất xứ & Tình trạng kho */}
                        <div className="flex items-center gap-6 text-sm text-slate-800 pt-1">
                            <span>🌐Thương hiệu: <strong className="text-slate-800">{product.brandName}</strong></span>
                            <span>
                                🛍️Tình trạng:{" "}
                                {isOutOfStock ? (
                                    <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">🛑 Hết hàng</span> 
                                ) : (
                                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                        ✅ Còn hàng
                                    </span>
                                )}
                            </span>
                        </div>
                    </div>

                    {/* Khung Giá bán & Giảm giá */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-baseline gap-4">
                        <span className="text-3xl font-black text-orange-500">
                            {currencyFormatter.format(product.basePrice)}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-orange-500 text-white text-xs font-bold">
                            -15%
                        </span>
                        <span className="text-xl font-bold text-slate-600 line-through">
                            {currencyFormatter.format(product.basePrice * 1.15)}
                        </span> 
                    </div>

                    {/* Hotline tư vấn nhanh */}
                    <div className="p-3.5 rounded-xl bg-orange-50/60 border border-orange-200 text-xs text-orange-800 flex items-center gap-2 font-medium">
                        <PhoneCall className="h-4 w-4 text-orange-500 shrink-0" />
                        <span>Liên hệ hotline <strong>0969.299.839</strong> để được chuyên viên tư vấn trực tiếp!</span>
                    </div>

                    {/* Chọn Thuộc tính biến thể (Trọng lượng 3U/4U) */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                            Chọn thông số vợt: 
                        </label>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setSelectedWeight("3U")}
                                className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                                    selectedWeight === "3U"
                                        ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                                }`}
                            >
                                3U (85g - 89g)
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedWeight("4U")}
                                className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                                    selectedWeight === "4U"
                                        ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                                }`}
                            >
                                4U (80g - 84g)
                            </button>
                        </div>
                    </div>

                    {/* Chọn Số Lượng & Nút Mua Hàng */}
                    <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-slate-900 uppercase">Số lượng:</span>
                            <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1">
                                <button
                                    type="button"
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-600"
                                >
                                    <Minus className="h-3.5 w-3.5" />
                                </button>
                                <span className="w-10 text-center font-extrabold text-sm text-slate-900">
                                    {quantity}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-600"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>

                        {/* Nút Thao tác */}
                        <div className="flex gap-4">
                            <button
                                type="button"
                                disabled={isOutOfStock}
                                onClick={handleAddToCart}
                                className="flex-1 py-3.5 rounded-xl border-2 border-orange-500 text-orange-600 hover:bg-orange-50 font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <ShoppingBag className="h-4 w-4" /> Thêm vào giỏ hàng
                            </button>
                            <button
                                type="button"
                                disabled={isOutOfStock}
                                onClick={handleBuyNow}
                                className="flex-1 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition-all shadow-lg shadow-orange-500/25 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <Zap className="h-4 w-4" /> Mua ngay
                            </button>
                        </div>
                    </div>

                    {/* Khung Ưu Đãi & Quà Tặng Đèm Theo */}
                    <div className="p-4 rounded-2xl border-2 border-orange-500/30 bg-orange-50/20 space-y-2.5">
                        <h4 className="text-sm font-bold text-orange-600 uppercase tracking-wider flex items-center gap-1.5">
                            🎁 ƯU ĐÃI & QUÀ TẶNG KÈM theo SẢN PHẨM:
                        </h4>
                        <ul className="space-y-2 text-sm pl-5 text-slate-700 font-medium">
                            <li className="flex items-center gap-2">
                                <span className="text-orange-500 font-bold">✓</span> Tặng 01 Quấn cán vợt cầu lông cao cấp.
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-orange-500 font-bold">✓</span> Tặng bao nhung bảo vệ vợt chính hãng.
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-orange-500 font-bold">✓</span> Miễn phí cước căng vợt lần đầu tại hệ thống cửa hàng.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* 3. KHU VỰC TABS CHI TIẾT SẢN PHẨM (Mô tả sản phẩm, Thông số kỹ thuật, Đánh giá - Chuẩn FBShop) */}
            <div className="pt-8 border-t border-slate-200 space-y-6">

                {/* Thanh Tabs Header */}
                <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-0.5">
                    <button
                        type="button"
                        onClick={() => setActiveTab("description")}
                        className={`px-6 py-3 font-bold text-sm sm:text-base rounded-t-xl transition-all whitespace-nowrap cursor-pointer ${
                            activeTab === "description"
                                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                    >
                        Mô tả sản phẩm
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("specifications")}
                        className={`px-6 py-3 font-bold text-sm sm:text-base rounded-t-xl transition-all whitespace-nowrap cursor-pointer ${
                            activeTab === "specifications"
                                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                    >
                        Thông số kỹ thuật
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("reviews")}
                        className={`px-6 py-3 font-bold text-sm sm:text-base rounded-t-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                            activeTab === "reviews"
                                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                    >
                        <span>Đánh giá</span>
                    </button>
                </div>

                {/* NỘI DUNG TAB 1: MÔ TẢ SẢN PHẨM (Nhiều Text & Hình ảnh minh họa chuẩn FBShop) */}
                {activeTab === "description" && (
                    <div className="bg-orange-50/40 p-6 sm:p-8 rounded-2xl border border-orange-100/80 shadow-sm space-y-6">
                        
                        <p className="text-sm text-slate-700 leading-relaxed">
                            <strong className="text-orange-600 font-bold">{product.productName}</strong> là sự tái sinh đầy kiêu hãnh của một huyền thoại, mang đến một làn gió mới cho cộng đồng cầu lông thế giới với diện mạo đột phá. Dù giữ nguyên những tiêu chuẩn vàng về hiệu suất thi đấu, phiên bản này lại gây ấn tượng bởi phối màu hiện đại và giá trị sưu tầm mới. Chi tiết hãy cùng cửa hàng tìm hiểu ngay trong bài viết dưới đây!
                        </p>

                        {/* Banner/Video Hình ảnh trải nghiệm thực tế */}
                        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm max-w-3xl mx-auto bg-slate-900 relative group">
                            <img
                                src={mockImages[0]}
                                alt={product.productName}
                                className="w-full h-80 sm:h-96 object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <div className="h-16 w-16 rounded-full bg-orange-500/90 text-white flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 transition-transform">
                                    <Zap className="h-8 w-8 fill-white" />
                                </div>
                            </div>
                        </div>

                        {/* Mục 1: Giới thiệu */}
                        <div className="space-y-3">
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                                1. Giới thiệu về {product.productName}
                            </h3>
                            <p className="text-sm text-slate-700 leading-relaxed">
                                Sản phẩm được gia công chính xác tuyệt đối với vật liệu Carbon Graphite cao cấp thế hệ mới. Điểm đặc biệt nằm ở cấu trúc khung kết hợp giữa khả năng trợ lực vượt trội và độ mỏng nhẹ, mang lại cảm giác vung vợt thoát gió nhưng vẫn đảm bảo độ đầm đầu cần thiết cho các pha đập cầu ghi điểm.
                            </p>
                        </div>

                        {/* Mục 2: Cảm giác đánh */}
                        <div className="space-y-3">
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                                2. Phân tích thiết kế & Cảm giác đánh
                            </h3>
                            <p className="text-sm text-slate-700 leading-relaxed">
                                Khi trải nghiệm thực tế, {product.productName} cho khả năng phản tạt cực nhanh ở cự ly gần lưới. Thân vợt có độ phản hồi cao, giúp tích tụ năng lượng hiệu quả khi uốn cong và giải phóng tối đa lực đẩy vào quả cầu khi tiếp xúc.
                            </p>
                        </div>

                        {/* Mục 3: Công nghệ nổi bật */}
                        <div className="space-y-4">
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                                3. Công nghệ nổi bật được ứng dụng trên {product.productName}
                            </h3>
                            <ul className="space-y-4 text-sm text-slate-700">
                                <li>
                                    <strong className="text-slate-900 uppercase">− ROTATIONAL GENERATOR SYSTEM:</strong>{" "}
                                    Hệ thống đối trọng thông minh giúp phân bổ trọng lượng tối ưu tại đỉnh khung, khớp nối T-Joint và cán cầm, cho phép người chơi chuyển đổi linh hoạt giữa tấn công dồn dập và phòng thủ phản tạt.

                                    {/* Hình ảnh sơ đồ công nghệ Rotational Generator System */}
                                    <div className="my-4 p-4 bg-white rounded-2xl border border-slate-200 max-w-lg mx-auto text-center space-y-2 shadow-xs">
                                        <img
                                            src={mockImages[1]}
                                            alt="Sơ đồ công nghệ Rotational Generator System"
                                            className="max-h-64 mx-auto rounded-xl object-contain"
                                        />
                                        <span className="text-[11px] text-slate-500 italic block">
                                            {product.productName} được tích hợp công nghệ ROTATIONAL GENERATOR SYSTEM giúp phân bổ trọng lượng tối ưu
                                        </span>
                                    </div>
                                </li>

                                <li>
                                    <strong className="text-slate-900 uppercase">− NAMD:</strong>{" "}
                                    Vật liệu carbon cao cấp phủ nano trực tiếp vào sợi carbon, tăng độ đàn hồi cho đũa vợt, hỗ trợ lực đẩy cực đại trong các pha smash uy lực.
                                </li>
                                <li>
                                    <strong className="text-slate-900 uppercase">− AERO+BOX FRAME:</strong>{" "}
                                    Thiết kế khung vát mỏng kết hợp giữa khí động học và sự chắc chắn, giúp tốc độ vung vợt nhanh hơn nhưng mặt vợt vẫn cực kỳ ổn định.
                                </li>
                                <li>
                                    <strong className="text-slate-900 uppercase">− ENERGY BOOST CAP PLUS:</strong>{" "}
                                    Nắp chụp cán vợt thế hệ mới giúp ổn định đũa vợt, chống xoắn và tăng cường khả năng kiểm soát trong từng cú đánh.
                                </li>
                                <li>
                                    <strong className="text-slate-900 uppercase">− ISOMETRIC:</strong>{" "}
                                    Công nghệ mặt vợt vuông mở rộng vùng điểm ngọt (Sweet Spot), đảm bảo sự chính xác ngay cả trong các pha cầu lệch tâm.

                                    {/* Hình ảnh sơ đồ Isometric */}
                                    <div className="my-4 p-4 bg-white rounded-2xl border border-slate-200 max-w-lg mx-auto text-center space-y-2 shadow-xs">
                                        <img
                                            src={mockImages[2]}
                                            alt="Sơ đồ mặt vợt Isometric"
                                            className="max-h-64 mx-auto rounded-xl object-contain"
                                        />
                                        <span className="text-[11px] text-slate-500 italic block">
                                            Mặt vợt thiết kế Isometric vuông mở rộng vùng điểm ngọt trên {product.productName}
                                        </span>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Mục 4: Đối tượng phù hợp */}
                        <div className="space-y-3 pt-2">
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                                4. Đối tượng phù hợp với {product.productName}
                            </h3>
                            <p className="text-sm text-slate-700 leading-relaxed">
                                Vợt phù hợp cho người chơi có lực cổ tay trung bình - khá trở lên, ưa thích lối đánh công thủ toàn diện linh hoạt hoặc thiên đập cầu ghi điểm. Dùng tốt trong cả thi đấu đôi (cầu trước/cầu sau) và thi đấu đơn.
                            </p>
                        </div>
                    </div>
                )}

                {/* NỘI DUNG TAB 2: THÔNG SỐ KỸ THUẬT */}
                {activeTab === "specifications" && (
                    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                            <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                                <Sliders className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Bảng Thông Số Kỹ Thuật Chi Tiết</h2>
                                <p className="text-xs text-slate-500">Thông số chuẩn xác từ nhà sản xuất</p>
                            </div>
                        </div>

                        <div className="divide-y divide-slate-100 text-sm max-w-3xl mx-auto">
                            {(product.specifications && product.specifications.length > 0
                                ? product.specifications
                                : defaultSpecifications
                            ).map((spec, index) => (
                                <div key={index} className="py-3.5 flex justify-between gap-6 hover:bg-slate-50 px-3 rounded-lg transition-colors">
                                    <span className="text-slate-500 font-medium w-1/3">{spec.label}</span>
                                    <span className="text-slate-900 font-bold text-right w-2/3">{spec.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* NỘI DUNG TAB 3: ĐÁNH GIÁ SẢN PHẨM */}
                {activeTab === "reviews" && (
                    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                        <div className="text-center py-8 space-y-3">
                            <div className="flex justify-center gap-1 text-amber-400">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star key={i} className="h-7 w-7 fill-amber-400" />
                                ))}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Chưa có đánh giá nào cho sản phẩm này</h3>
                            <p className="text-xs text-slate-500 max-w-md mx-auto">
                                Hãy trở thành người đầu tiên mua hàng và trải nghiệm sản phẩm để để lại nhận xét hữu ích cho cộng đồng nhé!
                            </p>
                            <button
                                type="button"
                                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-500/20"
                            >
                                Viết đánh giá ngay
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
