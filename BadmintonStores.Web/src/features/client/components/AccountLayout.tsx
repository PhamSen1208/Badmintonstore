import { Link, Outlet, useLocation } from "react-router-dom";
import { User, Package, LogOut, ShieldCheck, Heart } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function AccountLayout() {
    const location = useLocation();
    const { user, logout } = useAuth();

    const menuItems = [
        { path: "/profile", label: "Hồ sơ cá nhân", icon: User },
        { path: "/account/orders", label: "Đơn hàng của tôi", icon: Package },
        { path: "/account/wishlist", label: "Sản phẩm yêu thích", icon: Heart },
        { path: "/account/security", label: "Đổi mật khẩu", icon: ShieldCheck },
    ];

    return (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* SIDEBAR BÊN TRÁI */}
                <div className="md:col-span-1 space-y-4">
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                            <div className="h-10 w-10 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-base">
                                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-bold text-slate-900 text-sm truncate">{user?.fullName || "Tài khoản"}</p>
                                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                            </div>
                        </div>

                        {/* MENU TABS */}
                        <div className="space-y-1">
                            {menuItems.map(item => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                                            isActive
                                                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                                                : "text-slate-600 hover:bg-slate-100"
                                        }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                            <button
                                type="button"
                                onClick={() => logout()}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-xs text-red-600 hover:bg-red-50 transition-all text-left"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Đăng xuất</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* NỘI DUNG TRANG PHẢI (ProfilePage hoặc MyOrdersPage) */}
                <div className="md:col-span-3">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
