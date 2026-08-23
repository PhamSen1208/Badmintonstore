import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Package, ShoppingCart, Warehouse, Users, Boxes, History, Tag, Layers, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getCategories } from "@/features/admin/categories/services/admin-categories.service";
import type { CategoryListItem } from "@/features/admin/categories/types/admin-categories.types";

export function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [categories, setCategories] = useState<CategoryListItem[]>([]);
  const [isProductsOpen, setIsProductsOpen] = useState(
    location.pathname.startsWith("/admin/products")
  );

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch {
        // Fallback
      }
    }
    loadCategories();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed left-0 top-0 h-screen w-64 border-r bg-white flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="flex h-16 items-center border-b px-5">
            <Link to="/admin" className="font-semibold text-slate-900 text-lg flex items-center gap-2">
              <span className="bg-emerald-600 text-white rounded p-1 text-xs">BS</span>
              BadmintonStores
            </Link>
          </div>

          <nav className="space-y-1 p-3">
            {/* Tổng quan */}
            <Link
              to="/admin"
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname === "/admin" ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Boxes className="h-4 w-4" />
              Tổng quan
            </Link>

            {/* Menu Sản Phẩm có Dropdown Sub-menu */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setIsProductsOpen(!isProductsOpen)}
                className={`w-full flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname.startsWith("/admin/products") ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package className="h-4 w-4" />
                  <span>Sản phẩm</span>
                </div>
                {isProductsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>

              {/* Sub-menu các nhóm sản phẩm */}
              {isProductsOpen && (
                <div className="ml-4 pl-3 border-l-2 border-slate-100 space-y-1 pt-1">
                  <Link
                    to="/admin/products"
                    className="block rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-emerald-700"
                  >
                    📦 Tất cả sản phẩm
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/admin/products?categoryId=${cat.id}`}
                      className="block rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-emerald-700 truncate"
                    >
                      🏸 {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Thương hiệu */}
            <Link
              to="/admin/brands"
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname.startsWith("/admin/brands") ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Tag className="h-4 w-4" />
              Thương hiệu
            </Link>

            {/* Danh mục */}
            <Link
              to="/admin/categories"
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname.startsWith("/admin/categories") ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Layers className="h-4 w-4" />
              Danh mục
            </Link>

            {/* Đơn hàng */}
            <Link
              to="/admin/orders"
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname.startsWith("/admin/orders") ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              Đơn hàng
            </Link>

            {/* Kho hàng */}
            <Link
              to="/admin/warehouses"
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname.startsWith("/admin/warehouses") ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Warehouse className="h-4 w-4" />
              Kho hàng
            </Link>

            {/* Nhật ký tồn kho */}
            <Link
              to="/admin/inventory-transactions"
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname.startsWith("/admin/inventory-transactions") ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <History className="h-4 w-4" />
              Nhật ký tồn kho
            </Link>

            {/* Khách hàng */}
            <Link
              to="/admin/customers"
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname.startsWith("/admin/customers") ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Users className="h-4 w-4" />
              Khách hàng
            </Link>
          </nav>
        </div>
      </aside>

      <div className="pl-64">
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
          <div>
            <p className="text-sm text-muted-foreground">Xin chào</p>
            <p className="font-medium">{user?.email}</p>
          </div>

          <Button variant="outline" size="sm" onClick={logout}>
            Đăng xuất
          </Button>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}