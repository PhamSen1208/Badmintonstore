import { useState } from "react";
import { Link } from "react-router-dom";
import { User, ChevronDown } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { LogOut } from "lucide-react";

export function UserNavDropdown() {
    const { isAuthenticated, user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    if (!isAuthenticated || !user) {
        return (
            <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm transition-colors shadow-md shadow-orange-500/20"
            >
                <User className="h-4 w-4" />
                <span>Đăng nhập</span>
            </Link>
        );
    }

    return (
        <div
            className="relative cursor-pointer"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            {/* Nút bấm hiển thị tên User */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs sm:text-sm border border-slate-700 transition-all">
                <div className="h-6 w-6 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="max-w-27.5 truncate">{user.fullName || user.email}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </div>

            {/* Bảng Dropdown Menu khi di chuột vào */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-52 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 py-2 z-50 text-xs font-medium">
                    <div className="px-4 py-2 border-b border-slate-100 bg-slate-50 rounded-t-xl">
                        <p className="text-[11px] text-slate-400 font-normal">Xin chào</p>
                        <p className="font-bold text-slate-800 truncate">{user.fullName || user.email}</p>
                    </div>
                    <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2.5 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                        Hồ sơ cá nhân
                    </Link>
                    <Link
                        to="/account/orders"
                        className="flex items-center gap-2 px-4 py-2.5 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                        Đơn hàng của tôi
                    </Link>
                    
                    {/* Nếu là Admin/Staff thì hiển thị thêm lối tắt vào Admin */}
                    {(user.role === "Admin" || user.role === "Staff") && (
                        <Link
                            to="/admin"
                            className="flex items-center gap-2 px-4 py-2.5 hover:bg-orange-50 text-indigo-600 font-bold transition-colors border-t border-slate-100"
                        >
                            ⚙️ Trang Quản trị Admin
                        </Link>
                    )}

                    <button
                        type="button"
                        onClick={() => logout()}
                        className="w-full text-left flex items-center gap-2 px-4 py-2.5 hover:bg-red-50 text-red-600 transition-colors border-t border-slate-100"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Đăng xuất</span>
                    </button>
                </div>
            )}
        </div>
    );
}
