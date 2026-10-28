import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Filter, RotateCcw, ChevronRight, SlidersHorizontal, Heart } from "lucide-react";
import { SkeletonProductGrid } from "@/features/client/components/SkeletonProductCard";
import { useWishlist } from "@/features/client/context/WishlistContext";
import { getCategories } from "@/features/admin/categories/services/admin-categories.service";
import { getBrands } from "@/features/admin/brands/services/admin-brands.service";
import { getProducts } from "@/features/admin/products/services/admin-product.service";
import type { CategoryListItem } from "@/features/admin/categories/types/admin-categories.types";
import type { BrandListItem } from "@/features/admin/brands/types/admin-brands.types";
import type { ProductListItem } from "@/features/admin/products/types/admin-product.types";
import { currencyFormatter } from "@/lib/formatters";

export function ProductsPage()
{
    const [searchParams, setSearchParams] = useSearchParams();
    const { isFavorite, toggleFavorite } = useWishlist();

    //Lấy url query params từ megamenu
    const urlCatId = searchParams.get("categoryId");
    const urlBrandId = searchParams.get("brandId");

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// 1. STATE BỘ LỌC (Ứng dụng chuẩn Checklist cho nhiều chọn & Radio cho 1 chọn)
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(
        urlCatId ? [Number(urlCatId)] : []
    );
    const [selectedBrandIds, setSelectedBrandIds] = useState<number[]>(
        urlBrandId ? [Number(urlBrandId)] : []
    );
    const [priceRange, setPriceRange] = useState<string>("all"); // "all" | "under1m" | "1m-3m" | "over3m"
    const [sortBy, setSortBy] = useState<string>("newest");
    // 2. STATE DỮ LIỆU & PHÂN TRANG
    const [categories, setCategories] = useState<CategoryListItem[]>([]);
    const [brands, setBrands] = useState<BrandListItem[]>([]);
    const [products, setProducts] = useState<ProductListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(12);
    const [totalPages, setTotalPages] = useState(1);
    // Đồng bộ state khi URL thay đổi (VD click menu khác từ Header)
    useEffect(() => {
        const cat = searchParams.get("categoryId");
        const brand = searchParams.get("brandId");
        if (cat) setSelectedCategoryIds([Number(cat)]);
        if (brand) setSelectedBrandIds([Number(brand)]);
    }, [searchParams]);
    // Tải danh sách Danh mục & Thương hiệu cho Filter Sidebar
    useEffect(() => {
        async function loadFilterDropdowns() {
            try {
                const [catsData, brandsData] = await Promise.all([
                    getCategories(),
                    getBrands()
                ]);
                setCategories(Array.isArray(catsData) ? catsData : []);
                setBrands(Array.isArray(brandsData) ? brandsData : []);
            } catch {
                setCategories([]);
                setBrands([]);
            }
        }
        loadFilterDropdowns();
    }, []);
    // Tải danh sách Sản phẩm theo các tiêu chí bộ lọc
    useEffect(() => {
        async function loadProductsData() {
            try {
                setIsLoading(true);
                const result = await getProducts({
                    categoryId: selectedCategoryIds.length === 1 ? selectedCategoryIds[0] : undefined,
                    brandId: selectedBrandIds.length === 1 ? selectedBrandIds[0] : undefined,
                    pageNumber,
                    pageSize,
                });
                setProducts(Array.isArray(result?.items) ? result.items : []);
                setTotalPages(result?.totalPages || 1);
            } catch {
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        }
        loadProductsData();
    }, [selectedCategoryIds, selectedBrandIds, priceRange, sortBy, pageNumber, pageSize]);
    // Thao tác Toggle Checklist Danh mục
    function handleToggleCategory(id: number) {
        setSelectedCategoryIds(prev => 
            prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
        );
        setPageNumber(1);
    }
    // Thao tác Toggle Checklist Thương hiệu
    function handleToggleBrand(id: number) {
        setSelectedBrandIds(prev => 
            prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id]
        );
        setPageNumber(1);
    }
    // Đặt lại (Reset) bộ lọc về mặc định
    function handleResetFilters() {
        setSelectedCategoryIds([]);
        setSelectedBrandIds([]);
        setPriceRange("all");
        setSearchParams({});
        setPageNumber(1);
    }
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            
            {/* Breadcrumb điều hướng */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
                <Link to="/" className="hover:text-orange-500">Trang chủ</Link>
                <ChevronRight className="h-3 w-3" />
                <span className="font-semibold text-slate-800">Danh sách sản phẩm</span>
            </div>
            {/* Bố cục 2 Cột: Sidebar Lọc (Trái) & Lưới Sản Phẩm (Phải) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* ── BÊN TRÁI: FILTER SIDEBAR (Col-span-3) ── */}
                <aside className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                            <Filter className="h-4 w-4 text-orange-500" />
                            <span>Bộ lọc sản phẩm</span>
                        </div>
                        {(selectedCategoryIds.length > 0 || selectedBrandIds.length > 0 || priceRange !== "all") && (
                            <button
                                type="button"
                                onClick={handleResetFilters}
                                className="text-xs text-orange-500 flex items-center gap-1 font-semibold border rounded-lg px-1 hover:bg-orange-500 hover:text-white cursor-pointer"
                                title="Bỏ lọc"
                            >
                                <RotateCcw className="h-3 w-3 ml-2 my-1" /> Xóa lọc
                            </button>
                        )}
                    </div>
                    {/* 1. LỌC DANH MỤC */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-orange-500 uppercase tracking-wider">
                            Danh Mục Sản Phẩm
                        </h4>
                        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                            {categories.map((cat) => (
                                <label
                                    key={cat.id}
                                    className="flex items-center gap-2.5 text-xs text-slate-700 hover:text-orange-600 cursor-pointer select-none"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedCategoryIds.includes(cat.id)}
                                        onChange={() => handleToggleCategory(cat.id)}
                                        className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                                    />
                                    <span className="font-medium">{cat.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    {/* 2. LỌC THƯƠNG HIỆU */}
                    <div className="space-y-3 border-t border-slate-100 pt-4">
                        <h4 className="text-sm font-bold text-orange-500 uppercase tracking-wider">
                            Thương Hiệu Chính Hãng
                        </h4>
                        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                            {brands.map((brand) => (
                                <label
                                    key={brand.id}
                                    className="flex items-center gap-2.5 text-xs text-slate-700 hover:text-orange-600 cursor-pointer select-none"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedBrandIds.includes(brand.id)}
                                        onChange={() => handleToggleBrand(brand.id)}
                                        className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                                    />
                                    <span className="font-medium">{brand.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    {/* 3. LỌC KHOẢNG GIÁ */}
                    <div className="space-y-3 border-t border-slate-100 pt-4">
                        <h4 className="text-sm font-bold text-orange-500 uppercase tracking-wider">
                            Khoảng Giá
                        </h4>
                        <div className="space-y-2 text-xs text-slate-700">
                            <label className="flex items-center gap-2.5 cursor-pointer">
                                <input
                                    type="radio"
                                    name="priceRange"
                                    checked={priceRange === "all"}
                                    onChange={() => setPriceRange("all")}
                                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 cursor-pointer"
                                />
                                <span>Tất cả mức giá</span>
                            </label>
                            <label className="flex items-center gap-2.5 cursor-pointer">
                                <input
                                    type="radio"
                                    name="priceRange"
                                    checked={priceRange === "under1m"}
                                    onChange={() => setPriceRange("under1m")}
                                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 cursor-pointer"
                                />
                                <span>Dưới 1.000.000 ₫</span>
                            </label>
                            <label className="flex items-center gap-2.5 cursor-pointer">
                                <input
                                    type="radio"
                                    name="priceRange"
                                    checked={priceRange === "1m-3m"}
                                    onChange={() => setPriceRange("1m-3m")}
                                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 cursor-pointer"
                                />
                                <span>1.000.000 ₫ - 3.000.000 ₫</span>
                            </label>
                            <label className="flex items-center gap-2.5 cursor-pointer">
                                <input
                                    type="radio"
                                    name="priceRange"
                                    checked={priceRange === "over3m"}
                                    onChange={() => setPriceRange("over3m")}
                                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 cursor-pointer"
                                />
                                <span>Trên 3.000.000 ₫</span>
                            </label>
                        </div>
                    </div>
                </aside>
                {/* ── BÊN PHẢI: TOOLBAR & LƯỚI SẢN PHẨM (Col-span-9) ── */}
                <main className="lg:col-span-9 space-y-6">
                    
                    {/* Toolbar Đếm số lượng & Sắp xếp */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Sản Phẩm Cầu Lông</h1>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Danh sách các dụng cụ cầu lông chính hãng mới nhất
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-500 font-medium whitespace-nowrap flex items-center gap-1">
                                <SlidersHorizontal className="h-3.5 w-3.5" /> Sắp xếp:
                            </span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="h-9 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 focus:outline-none focus:border-orange-500"
                            >
                                <option value="newest">Mới nhất</option>
                                <option value="priceAsc">Giá từ thấp đến cao</option>
                                <option value="priceDesc">Giá từ cao đến thấp</option>
                            </select>
                        </div>
                    </div>
                    {/* Lưới Sản Phẩm Nạp bằng Skeleton Loading */}
                    {isLoading ? (
                        <SkeletonProductGrid count={8} />
                    ) : products.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                            <span className="text-4xl">🏸</span>
                            <h3 className="text-base font-bold text-slate-800">Không tìm thấy sản phẩm nào</h3>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                Không có sản phẩm nào phù hợp với bộ lọc bạn đã chọn.
                            </p>
                            <button
                                type="button"
                                onClick={handleResetFilters}
                                className="mt-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-semibold transition-colors"
                            >
                                Đặt lại bộ lọc
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                            {products.map((prod) => (
                                <div
                                    key={prod.productId}
                                    className="group rounded-2xl border border-slate-200/80 bg-white p-4 space-y-3 shadow-sm hover:shadow-xl hover:border-orange-500/40 transition-all flex flex-col justify-between"
                                >
                                    <Link to={`/products/${prod.productId}`}>
                                        <div className="space-y-3">
                                            <div className="aspect-square w-full rounded-xl bg-slate-100 overflow-hidden relative flex items-center justify-center">
                                                {/* 1. Ảnh sản phẩm hoặc icon vợt giữ chỗ */}
                                                {prod.imageUrl ? (
                                                    <img
                                                        src={prod.imageUrl.startsWith("http") ? prod.imageUrl : `${API_BASE_URL}${prod.imageUrl}`}
                                                        alt={prod.productName}
                                                        className="h-full w-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                                                        onError={(e) => {
                                                            (e.target as HTMLElement).style.display = "none";
                                                        }}
                                                    />
                                                ) : (
                                                    <span className="text-4xl opacity-40 group-hover:scale-110 transition-transform">🏸</span>
                                                )}

                                                {/* 2. Nhãn thương hiệu góc trên bên trái */}
                                                {prod.brandName && (
                                                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-slate-100 z-10">
                                                        {prod.brandName}
                                                    </span>
                                                )}

                                                {/* 3. Nút Trái tim Yêu thích (Wishlist) góc trên bên phải */}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        toggleFavorite(prod.productId);
                                                    }}
                                                    title={isFavorite(prod.productId) ? "Bỏ thích" : "Thêm vào yêu thích"}
                                                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors z-10"
                                                >
                                                    <Heart className={`h-4 w-4 ${isFavorite(prod.productId) ? "fill-red-500 text-red-500" : ""}`} />
                                                </button>
                                            </div>
                                            <div>
                                                <span className="text-[11px] font-semibold text-orange-500 uppercase tracking-wider">
                                                    {prod.categoryName || "Cầu lông"}
                                                </span>
                                                <h3 className="font-bold text-slate-900 text-sm line-clamp-2 mt-0.5 group-hover:text-orange-500 transition-colors">
                                                    {prod.productName}
                                                </h3>
                                                <div className="mt-2 py-1.5 px-3 rounded-xl bg-orange-500 text-white text-xs font-bold flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-200 shadow-md shadow-orange-500/20">
                                                    <span>Xem chi tiết</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                            <div>
                                                <span className="text-[10px] text-slate-400 block">Giá bán</span>
                                                <span className="font-extrabold text-orange-500 text-sm sm:text-base">
                                                    {currencyFormatter.format(prod.basePrice)}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                    {/* Phân trang */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                            <span className="text-xs text-slate-500 font-medium">
                                Trang {pageNumber} / {totalPages}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    disabled={pageNumber <= 1 || isLoading}
                                    onClick={() => setPageNumber(p => p - 1)}
                                    className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Trang trước
                                </button>
                                <button
                                    type="button"
                                    disabled={pageNumber >= totalPages || isLoading}
                                    onClick={() => setPageNumber(p => p + 1)}
                                    className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Trang sau
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
    
    
}