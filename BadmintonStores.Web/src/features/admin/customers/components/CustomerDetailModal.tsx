import { User, Mail, Phone, Calendar, ShoppingBag, DollarSign, Clock, ShieldCheck, ShieldAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CustomerListItem } from "../types/admin-customers.types";

type CustomerDetailModalProps = {
    customer: CustomerListItem;
    onClose: () => void;
    onToggleStatus: (customerId: number) => void;
    isToggling: boolean;
};

export function CustomerDetailModal({ customer, onClose, onToggleStatus, isToggling }: CustomerDetailModalProps) {
    const isLocked = customer.userStatus.toLowerCase() === "locked";

    function formatVND(amount: number) {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
    }

    function renderGenderLabel(gender: string) {
        switch (gender.toLowerCase()) {
            case "male":
                return "Nam";
            case "female":
                return "Nữ";
            default:
                return "Chưa cập nhật";
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl border border-slate-100 animate-in zoom-in-95 duration-200">
                {/* Header Modal */}
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold text-lg">
                            {customer.fullName ? customer.fullName.charAt(0).toUpperCase() : "K"}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg">{customer.fullName}</h3>
                            <p className="text-xs text-slate-500 font-mono">Mã KH: {customer.customerCode}</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-slate-200">
                        <X className="h-5 w-5 text-slate-500" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                    {/* Status & Banner */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-2">
                            {isLocked ? (
                                <>
                                    <ShieldAlert className="w-5 h-5 text-red-500" />
                                    <div>
                                        <p className="text-sm font-bold text-red-600">Tài khoản đang bị khóa</p>
                                        <p className="text-xs text-slate-500">Khách hàng tạm thời không thể đặt hàng</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                    <div>
                                        <p className="text-sm font-bold text-emerald-600">Tài khoản đang hoạt động</p>
                                        <p className="text-xs text-slate-500">Khách hàng có đầy đủ quyền mua sắm</p>
                                    </div>
                                </>
                            )}
                        </div>
                        <Button
                            variant={isLocked ? "default" : "destructive"}
                            size="sm"
                            disabled={isToggling}
                            onClick={() => onToggleStatus(customer.customerId)}
                            className="rounded-xl font-bold text-xs"
                        >
                            {isLocked ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                        </Button>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex flex-col items-center text-center">
                            <ShoppingBag className="w-5 h-5 text-blue-600 mb-1" />
                            <span className="text-xs text-slate-500 font-medium">Tổng đơn hàng</span>
                            <span className="text-lg font-extrabold text-blue-700">{customer.totalOrders} đơn</span>
                        </div>
                        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 flex flex-col items-center text-center">
                            <DollarSign className="w-5 h-5 text-emerald-600 mb-1" />
                            <span className="text-xs text-slate-500 font-medium">Tổng chi tiêu</span>
                            <span className="text-base font-extrabold text-emerald-700">{formatVND(customer.totalSpent)}</span>
                        </div>
                        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100 flex flex-col items-center text-center">
                            <Clock className="w-5 h-5 text-amber-600 mb-1" />
                            <span className="text-xs text-slate-500 font-medium">Đơn cuối cùng</span>
                            <span className="text-xs font-bold text-amber-800 mt-1">
                                {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString("vi-VN") : "Chưa đặt đơn"}
                            </span>
                        </div>
                    </div>

                    {/* Personal Info Grid */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Thông tin cá nhân & Liên hệ</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white shadow-2xs">
                                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                                <div>
                                    <p className="text-[11px] text-slate-400 font-medium">Email liên hệ</p>
                                    <p className="font-semibold text-slate-800">{customer.email || "Chưa cập nhật"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white shadow-2xs">
                                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                                <div>
                                    <p className="text-[11px] text-slate-400 font-medium">Số điện thoại</p>
                                    <p className="font-semibold text-slate-800">{customer.phone || "Chưa cập nhật"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white shadow-2xs">
                                <User className="w-4 h-4 text-slate-400 shrink-0" />
                                <div>
                                    <p className="text-[11px] text-slate-400 font-medium">Giới tính</p>
                                    <p className="font-semibold text-slate-800">{renderGenderLabel(customer.gender)}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white shadow-2xs">
                                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                                <div>
                                    <p className="text-[11px] text-slate-400 font-medium">Ngày sinh</p>
                                    <p className="font-semibold text-slate-800">
                                        {customer.dateOfBirth ? new Date(customer.dateOfBirth).toLocaleDateString("vi-VN") : "Chưa cập nhật"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center justify-between border-t border-slate-100 pt-3">
                        <span>Ngày tham gia: {new Date(customer.createdAt).toLocaleDateString("vi-VN")}</span>
                        <span>Mã User System ID: #{customer.userId}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end bg-slate-50 px-6 py-3 border-t border-slate-100">
                    <Button variant="outline" onClick={onClose} className="rounded-xl font-semibold">
                        Đóng
                    </Button>
                </div>
            </div>
        </div>
    );
}
