import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingBag, User, ShieldCheck, Truck, PhoneCall, ChevronDown, ChevronRight } from "lucide-react";
import { getCategories } from "@/features/admin/categories/services/admin-categories.service";
import { getBrands } from "@/features/admin/brands/services/admin-brands.service";
import { useCart } from "@/features/client/cart/context/CartContext";
import type { CategoryListItem } from "@/features/admin/categories/types/admin-categories.types";
import type { BrandListItem } from "@/features/admin/brands/types/admin-brands.types";

export function ClientHeader() {
    const location = useLocation();
    const { totalItems } = useCart();
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
    const [categories, setCategories] = useState<CategoryListItem[]>([]);
    const [brands, setBrands] = useState<BrandListItem[]>([]);  

    useEffect(() => {
        async function loadDropdowns() {
            try {
                const [categoriesData, brandsData] = await Promise.all([
                    getCategories(),
                    getBrands(),
                ]);
                setCategories(categoriesData);
                setBrands(brandsData);
            } catch {
                // Nếu lỗi load API, website vẫn hoạt động với dữ liệu giả
            }
        }
        loadDropdowns();
    }, []);

    // Hàm kiêm tra và trả về class highlight theo đúng route hiện tại
    function getLinkClass(path: string, isExact = true) {
        const isActive = isExact 
            ? location.pathname === path 
            : location.pathname.startsWith(path);
        
        return isActive
            ? "py-3.5 px-2 border-b-2 border-orange-500 text-orange-600 whitespace-nowrap transition-colors font-bold"
            : "py-3.5 px-2 border-b-2 border-transparent text-slate-700 hover:text-orange-600 whitespace-nowrap transition-colors font-bold";
    }

    // Dữ liệu gợi ý mẫu (Sau này nối API getProducts thực tế)
    const mockSearchResults = [
        { id: 1, name: "Vợt cầu lông Yonex Astrox 88D Pro", price: "4.350.000 ₫", brand: "Yonex" },
        { id: 2, name: "Giày Badminton Victor P9200 Tím", price: "2.150.000 ₫", brand: "Victor" },
        { id: 3, name: "Vợt Li-Ning Halbertec 8000", price: "4.100.000 ₫", brand: "Li-Ning" },
        { id: 4, name: "Quả cầu lông VinaStar (Hộp 12 quả)", price: "260.000 ₫", brand: "VinaStar" },
    ];

    const filteredResults = searchQuery.trim()
        ? mockSearchResults.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : [];

    return (
        <header className="sticky top-0 z-50 bg-slate-900 text-slate-100 shadow-xl border-b border-slate-800">
            {/* 1. Thanh thông báo chính sách topbar */}
            <div className="bg-slate-950 py-1.5 px-4 md:px-8 lg:px-12 text-xs font-medium text-slate-300 border-b border-slate-800/80">
                <div className="w-full max-w mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-orange-500" /> 100% Chính hãng</span>
                        <span className="hidden sm:flex items-center gap-1.5"><Truck className="h-3.5 w-3.5 text-orange-500" /> Giao hàng toàn quốc</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <PhoneCall className="h-3.5 w-3.5 text-orange-500" /> Hotline: <span className="font-semibold text-white">0988.123.456</span>
                    </div>
                </div>
            </div>

            {/* 2. Thanh Header chính */}
            <div className="w-full max-w mx-auto px-4 md:px-8 lg:px-12 py-3 flex items-center justify-between gap-6">
                {/* Logo BadmintonStores */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="h-10 w-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-extrabold text-xl shadow-md shadow-orange-500/20 group-hover:bg-orange-600 transition-colors">
                        BS
                    </div>
                    <span className="text-xl md:text-2xl font-black tracking-tight text-white">
                        BADMINTON<span className="text-orange-500">STORES</span>
                    </span>
                </Link>

                {/* Live Search Bar (Gõ + Scroll) */}
                <div className="relative flex-1 max-w-xl hidden md:block">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                            placeholder="VD: Yonex Astrox 88D Pro, Vợt 4U, Giày Victor..."
                            className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-sm placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>

                    {/* Dropdown Kết quả Live Search vừa Gõ vừa Scroll */}
                    {isSearchFocused && searchQuery.trim() && (
                        <div className="absolute left-0 right-0 top-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
                            <div className="p-2.5 border-b border-slate-700 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                                Kết quả tìm kiếm ({filteredResults.length})
                            </div>
                            
                            {/* Khung Cuộn Scroll khi danh sách dài */}
                            <div className="max-h-80 overflow-y-auto divide-y divide-slate-700/50">
                                {filteredResults.length > 0 ? (
                                    filteredResults.map(item => (
                                        <Link
                                            key={item.id}
                                            to={`/products/${item.id}`}
                                            className="p-3 flex items-center justify-between hover:bg-slate-700/60 transition-colors group"
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-slate-100 group-hover:text-orange-400 transition-colors">
                                                    {item.name}
                                                </p>
                                                <span className="text-xs text-slate-400">{item.brand}</span>
                                            </div>
                                            <span className="text-sm font-bold text-orange-400">{item.price}</span>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-sm text-slate-400">
                                        Không tìm thấy sản phẩm phù hợp với "{searchQuery}"
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Các nút Hành động (Giỏ hàng & Đăng nhập) */}
                <div className="flex items-center gap-3">
                    <Link to="/cart" className="relative p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors group">
                        <ShoppingBag className="h-5 w-5 text-slate-200 group-hover:text-orange-400" />
                        {/* Badge đếm giỏ hàng Cam rực rỡ */}
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-orange-500 text-white font-bold text-[11px] flex items-center justify-center shadow-md">
                            {totalItems}
                        </span>
                    </Link>

                    <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm transition-colors shadow-md shadow-orange-500/20">
                        <User className="h-4 w-4" />
                        <span>Đăng nhập</span>
                    </Link>
                </div>
            </div>

            {/* 3. THANH MENU ĐIỀU HƯỚNG NGANG */}
            <nav className="bg-white border-t border-slate-200 shadow-sm text-slate-800 relative z-40">
                <div className="w-full max-w mx-auto px-4 md:px-8 lg:px-72 justify-between flex items-center gap-6 md:gap-8 text-xs md:text-sm font-bold uppercase tracking-wider">
                    <Link
                        to="/"
                        className={getLinkClass("/")}
                    >
                        TRANG CHỦ
                    </Link>

                    {/* SẢN PHẨM (Có Dropdown Menu) */}
                    <div 
                        className={`relative group flex items-center gap-1 cursor-pointer ${getLinkClass("/products", false)}`}
                        onMouseEnter={() => setIsProductMenuOpen(true)}
                        onMouseLeave={() => setIsProductMenuOpen(false)}
                    >
                        <Link 
                            to="/products"
                            className="flex items-center gap-1">
                                <span>SẢN PHẨM</span>
                                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180 text-slate-500 group-hover:text-orange-600" />
                        </Link>
                        {/* BẢNG MEGA MENU NẠP ĐỘNG */}
                        {isProductMenuOpen && (
                            <div className="absolute left-0 top-full w-225 bg-white border border-slate-200 rounded-b-2xl shadow-2xl p-6 z-50 text-slate-700 font-normal normal-case grid grid-cols-12 gap-6">
                                {/* CỘT BÊN TRÁI: DANH MỤC SẢN PHẨM (Nạp từ CSDL) */}
                                <div className="col-span-4 border-r border-slate-200 pr-4 space-y-1">
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100">
                                        DANH MỤC SẢN PHẨM
                                    </h3>
                                    <Link to="/products" className="flex items-center justify-between p-2 rounded-xl font-bold text-xs text-orange-600 bg-orange-50">
                                        <span>📦 TẤT CẢ SẢN PHẨM</span>
                                        <ChevronRight className="h-3.5 w-3.5" />
                                    </Link>
                                    {categories.map((cat) => (
                                    <Link
                                        key={cat.id}
                                        to={`/products?categoryId=${cat.id}`}
                                        className="flex items-center justify-between p-2 rounded-xl font-semibold text-xs text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors group/item"
                                    >
                                        <span>{cat.name.toUpperCase()}</span>
                                        <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover/item:text-orange-600" />
                                    </Link>
                                    ))}
                                </div>
                                {/* KHU VỰC BÊN PHẢI: THƯƠNG HIỆU HÃNG (Nạp động từ CSDL, xếp 3 cột) */}
                                <div className="col-span-8">
                                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100">
                                        THƯƠNG HIỆU CHÍNH HÃNG
                                    </h4>
                                    <div className="grid grid-cols-3 gap-6">
                                       {brands.map((brand) => (
                                            <div className="space-y-2" key={brand.id}>
                                                <Link
                                                    to={`/products?brandId=${brand.id}`}
                                                    className="font-extrabold text-orange-600 text-xs uppercase tracking-wider block border-b border-slate-100 pb-1 hover:underline"
                                                >
                                                    {brand.name} 
                                                </Link>
                                                 {/* Danh sách gộp: Vợt Yonex, Giày Yonex, Balo Yonex... */}
                                                <ul className="space-y-1.5 text-[11px] text-slate-600">
                                                    {categories.map((cat) => (
                                                        <li key={cat.id}>
                                                            <Link
                                                                to={`/products?categoryId=${cat.id}&brandId=${brand.id}`}
                                                                className="hover:text-orange-600 transition-colors block py-0.5"
                                                            >
                                                                {cat.name} {brand.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                       ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>


                    <Link to="/stores" className={getLinkClass("/stores")}>
                        CỬA HÀNG
                    </Link>

                    <Link to="#" className="py-3.5 px-2 hover:text-orange-600 whitespace-nowrap transition-colors hidden sm:block">
                        ĐÀO TẠO
                    </Link>

                    <Link to="/news" className={`hidden md:block ${getLinkClass("/news")}`}>
                        TIN TỨC
                    </Link>

                    <Link to="/recruitment" className={`hidden lg:block ${getLinkClass("/recruitment")}`}>
                        TUYỂN DỤNG
                    </Link>

                    <Link to="/about" className={`hidden lg:block ${getLinkClass("/about")}`}>
                        GIỚI THIỆU
                    </Link>

                    <Link to="#" className="py-3.5 px-2 hover:text-orange-600 whitespace-nowrap transition-colors hidden sm:block">
                        LIÊN HỆ
                    </Link>
                </div>
            </nav>
        </header>
    );
}
