import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Zap, Award, ChevronRight, ShoppingBag } from "lucide-react";
import { SkeletonProductGrid } from "@/features/client/components/SkeletonProductCard";
import { getProducts } from "@/features/admin/products/services/admin-product.service";
import type { ProductListItem } from "@/features/admin/products/types/admin-product.types";
import { currencyFormatter } from "@/lib/formatters";
import giay from "@/assets/giay-cau-long-danh-muc-home.jpg";
import balo from "@/assets/balo-cau-long-danh-muc-home.jpg";
import phukien from "@/assets/phu-kien-danh-muc-home.jpg";
import vot from "@/assets/vot-cau-long-danh-muc-home.jpg";

export function HomePage() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFeaturedProducts() {
      try {
        setIsLoading(true);
        const data = await getProducts({ pageSize: 8 });
        setProducts(data.items);
      } catch {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    }
    loadFeaturedProducts();
  }, []);

  return (
    <div className="space-y-10 pb-16">
      {/* 1. HERO BANNER SECTION (Volt Orange & Obsidian Navy) */}
      <section className="bg-slate-900 text-white relative overflow-hidden py-12 md:py-20 border-b border-slate-800">
        <div className="absolute inset-0 bg-linear-to-r from-orange-500/10 via-slate-900/50 to-slate-900 pointer-events-none" />
        <div className="w-full max-w mx-auto px-4 md:px-8 lg:px-72 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
              BỨC PHÁ TỐC ĐỘ <br />
              <span className="text-orange-500 underline decoration-orange-500/30 underline-offset-8">
                CHÍNH HÃNG 100%
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed font-normal">
              Trang bị dụng cụ cầu lông cao cấp từ các thương hiệu hàng đầu thế giới Yonex, Victor, Li-Ning. Miễn phí cước căng vợt & giao hàng toàn quốc!
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/products"
                className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition-all shadow-lg shadow-orange-500/25 flex items-center gap-2"
              >
                <ShoppingBag className="h-4 w-4" /> Mua Sắm Ngay
              </Link>
              <Link
                to="/products?categoryId=1"
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-all flex items-center gap-2"
              >
                Xem Bộ Sưu Tập Vợt <ChevronRight className="h-4 w-4 text-orange-400" />
              </Link>
            </div>
          </div>

          {/* Banner Graphic Card */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl bg-linear-to-tr from-slate-800 to-slate-900 border border-slate-700 p-6 flex flex-col justify-between shadow-2xl overflow-hidden group">
              <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />
              <div className="items-start z-10">
                <span className="px-3 py-1 rounded-lg bg-orange-500 text-white font-bold text-xs uppercase tracking-wider">
                  Mới về
                </span>
              </div>

              <div className="my-auto text-center space-y-2 z-10">
                <div className="text-5xl font-black text-slate-700 tracking-tight group-hover:text-slate-600 transition-colors">
                  YONEX
                </div>
                <p className="text-lg font-bold text-white">ASTROX 88D PRO</p>
                <p className="text-xs text-slate-400">Công nghệ Khung Vợt ROTATIONAL GENERATOR SYSTEM</p>
              </div>

              <div className="flex justify-between items-center z-10 pt-4 border-t border-slate-800">
                <div>
                  <span className="text-xs text-slate-400 block">Giá niêm yết</span>
                  <span className="text-xl font-bold text-orange-400">4.350.000 ₫</span>
                </div>
                <Link
                  to="/products"
                  className="p-3 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CAM KẾT CHÍNH SÁCH */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12"> 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Cam Kết 100% Chính Hãng</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Đền tiền 1000% nếu phát hiện hàng giả, hàng nhái kém chất lượng.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Giao Hàng Siêu Tốc</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Nhận hàng nội thành trong 2H, giao hàng toàn quốc 1-3 ngày.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Bảo Hành Uy Tín</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Bảo hành chính hãng 90 ngày theo quy định chuẩn của nhà sản xuất.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DANH MỤC NỔI BẬT */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 space-y-6">
        <div className="flex justify-between items-end border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">DANH MỤC SẢN PHẨM</h2>
            <p className="text-xs text-slate-500 mt-0.5">Lựa chọn trang thiết bị phù hợp với phong cách thi đấu</p>
          </div>
          <Link to="/products" className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1">
            Xem tất cả <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Vợt cầu lông */}
          <Link
            to="/products?categoryId=1"
            className="group relative rounded-2xl h-44 overflow-hidden border border-slate-800 shadow-lg"
          >
            <img
              src={vot}
              alt="Vợt cầu lông"
              className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 space-y-0.5 z-10">
              <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">Rackets</span>
              <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">Vợt Cầu Lông</h3>
            </div>
          </Link>

          {/* Giày cầu lông */}
          <Link
            to="/products?categoryId=2"
            className="group relative rounded-2xl h-44 overflow-hidden border border-slate-800 shadow-lg"
          >
            <img
              src={giay}
              alt="Giày cầu lông"
              className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 space-y-0.5 z-10">
              <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">Shoes</span>
              <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">Giày cầu lông</h3>
            </div>
          </Link>

          {/* Balo/túi cầu lông */}
          <Link
            to="/products?categoryId=3"
            className="group relative rounded-2xl h-44 overflow-hidden border border-slate-800 shadow-lg"
          >
            <img
              src={balo}
              alt="Balo cầu lông"
              className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 space-y-0.5 z-10">
              <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">Balo</span>
              <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">Balo cầu lông</h3>
            </div>
          </Link>

          {/* Phụ kiện cầu lông */}
          <Link
            to="/products?categoryId=4"
            className="group relative rounded-2xl h-44 overflow-hidden border border-slate-800 shadow-lg"
          >
            <img
              src={phukien}
              alt="Phụ kiện cầu lông"
              className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 space-y-0.5 z-10">
              <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">Phụ kiện</span>
              <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">Phụ kiện cầu lông</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* 4. SẢN PHẨM NỔI BẬT VỢT CẦU LÔNG */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 space-y-6">
        <div className="flex justify-between items-end border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">VỢT CẦU LÔNG HOT</h2>
            <p className="text-xs text-slate-500 mt-0.5">Những mẫu vợt được các lông thủ tin dùng nhất</p>
          </div>
          <Link to="/products" className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1">
            Xem tất cả <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Kiểm tra nếu đang Tải dữ liệu ➔ Dùng Skeleton Loading */}
        {isLoading ? (
          <SkeletonProductGrid count={8} />
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            Chưa có sản phẩm nào. Vui lòng thêm sản phẩm từ Admin Dashboard!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <div
                key={product.productId}
                className="group rounded-2xl border border-slate-200/80 bg-white p-4 space-y-3 shadow-sm hover:shadow-xl hover:border-orange-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Khung ảnh sản phẩm */}
                  <div className="aspect-square w-full rounded-xl bg-slate-100 overflow-hidden relative flex items-center justify-center">
                    <span className="text-4xl opacity-40 group-hover:scale-110 transition-transform">🏸</span>
                    {product.brandName && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-slate-100">
                        {product.brandName}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-orange-500 uppercase tracking-wider">
                      {product.categoryName || "Cầu lông"}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-2 mt-0.5 group-hover:text-orange-500 transition-colors">
                      {product.productName}
                    </h3>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Giá niêm yết</span>
                    <span className="font-extrabold text-orange-500 text-base">
                      {currencyFormatter.format(product.basePrice)}
                    </span>
                  </div>
                  <Link
                    to={`/products/${product.productId}`}
                    className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-orange-500 hover:text-white transition-colors"
                    title="Xem chi tiết"
                  >
                    <ShoppingBag className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. SẢN PHẨM NỔI BẬT GIÀY CẦU LÔNG */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 space-y-6">
        <div className="flex justify-between items-end border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">GIÀY CẦU LÔNG HOT</h2>
            <p className="text-xs text-slate-500 mt-0.5">Những mẫu giày được các lông thủ tin dùng nhất</p>
          </div>
          <Link to="/products" className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1">
            Xem tất cả <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Kiểm tra nếu đang Tải dữ liệu ➔ Dùng Skeleton Loading */}
        {isLoading ? (
          <SkeletonProductGrid count={8} />
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            Chưa có sản phẩm nào. Vui lòng thêm sản phẩm từ Admin Dashboard!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <div
                key={product.productId}
                className="group rounded-2xl border border-slate-200/80 bg-white p-4 space-y-3 shadow-sm hover:shadow-xl hover:border-orange-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Khung ảnh sản phẩm */}
                  <div className="aspect-square w-full rounded-xl bg-slate-100 overflow-hidden relative flex items-center justify-center">
                    <span className="text-4xl opacity-40 group-hover:scale-110 transition-transform">🏸</span>
                    {product.brandName && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-slate-100">
                        {product.brandName}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-orange-500 uppercase tracking-wider">
                      {product.categoryName || "Cầu lông"}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-2 mt-0.5 group-hover:text-orange-500 transition-colors">
                      {product.productName}
                    </h3>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Giá niêm yết</span>
                    <span className="font-extrabold text-orange-500 text-base">
                      {currencyFormatter.format(product.basePrice)}
                    </span>
                  </div>
                  <Link
                    to={`/products`}
                    className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-orange-500 hover:text-white transition-colors"
                    title="Xem chi tiết"
                  >
                    <ShoppingBag className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 6. BALO CẦU LÔNG HOT */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 space-y-6">
        <div className="flex justify-between items-end border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">BALO CẦU LÔNG HOT</h2>
            <p className="text-xs text-slate-500 mt-0.5">Những mẫu balo được các lông thủ tin dùng nhất</p>
          </div>
          <Link to="/products" className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1">
            Xem tất cả <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Kiểm tra nếu đang Tải dữ liệu ➔ Dùng Skeleton Loading */}
        {isLoading ? (
          <SkeletonProductGrid count={8} />
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            Chưa có sản phẩm nào. Vui lòng thêm sản phẩm từ Admin Dashboard!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <div
                key={product.productId}
                className="group rounded-2xl border border-slate-200/80 bg-white p-4 space-y-3 shadow-sm hover:shadow-xl hover:border-orange-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Khung ảnh sản phẩm */}
                  <div className="aspect-square w-full rounded-xl bg-slate-100 overflow-hidden relative flex items-center justify-center">
                    <span className="text-4xl opacity-40 group-hover:scale-110 transition-transform">🏸</span>
                    {product.brandName && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-slate-100">
                        {product.brandName}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-orange-500 uppercase tracking-wider">
                      {product.categoryName || "Cầu lông"}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-2 mt-0.5 group-hover:text-orange-500 transition-colors">
                      {product.productName}
                    </h3>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Giá niêm yết</span>
                    <span className="font-extrabold text-orange-500 text-base">
                      {currencyFormatter.format(product.basePrice)}
                    </span>
                  </div>
                  <Link
                    to={`/products`}
                    className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-orange-500 hover:text-white transition-colors"
                    title="Xem chi tiết"
                  >
                    <ShoppingBag className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}