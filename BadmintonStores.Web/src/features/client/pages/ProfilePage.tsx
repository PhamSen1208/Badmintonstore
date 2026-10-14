import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { toast } from "sonner";
import { updateProfile } from "../services/profile.service";
import { User, Phone, Mail, MapPin, Check, X, Edit3, ShieldCheck } from "lucide-react";

export function ProfilePage() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        fullName: user?.fullName || "",
        phone: user?.phone || "",
        email: user?.email || "",
        gender: "male",
        city: "",
        district: "",
        address: "",
    });

    const isDirty =
        formData.fullName !== (user?.fullName || "") ||
        formData.phone !== (user?.phone || "") ||
        formData.address !== "" ||
        formData.city !== "" ||
        formData.district !== "";

    function handleCancel() {
        setFormData({
            fullName: user?.fullName || "",
            phone: user?.phone || "",
            email: user?.email || "",
            gender: "male",
            city: "",
            district: "",
            address: "",
        });
        setIsEditing(false);
    }

    async function handleSaveProfile(e: React.FormEvent) {
        e.preventDefault();
        if (!isDirty && !formData.address) return;

        setIsSaving(true);
        try {
            if (user?.customerId) {
                await updateProfile(user.customerId, formData);
            }
            setIsEditing(false);
            toast.success("Cập nhật thông tin hồ sơ thành công!");
        } catch {
            toast.error("Không thể cập nhật thông tin hồ sơ");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-28 space-y-8">
            {/* USER HEADER BANNER */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-3xl bg-gradient-to-br from-orange-400 to-amber-600 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
                        {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                {user?.fullName || "Khách hàng"}
                            </h1>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                <ShieldCheck className="w-3 h-3" /> Tài khoản đã xác thực
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">{user?.email}</p>
                    </div>
                </div>

                {!isEditing ? (
                    <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2"
                    >
                        <Edit3 className="w-4 h-4" />
                        Chỉnh sửa thông tin
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                    >
                        <X className="w-4 h-4" /> Hủy bỏ
                    </button>
                )}
            </div>

            {/* FORM CHỈNH SỬA / XEM THÔNG TIN */}
            <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-8">
                {/* 1. THÔNG TIN CƠ BẢN */}
                <div className="space-y-4">
                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-orange-600 pb-2 border-b border-slate-100 flex items-center gap-2">
                        <User className="w-4 h-4" /> Thông tin cá nhân
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Họ & Tên */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700">Họ và tên <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                disabled={!isEditing}
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                placeholder="Nhập họ và tên đầy đủ"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-slate-50 disabled:text-slate-500 transition-all font-medium"
                            />
                        </div>

                        {/* Số điện thoại */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700">Số điện thoại liên hệ <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="VD: 0987654321"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-slate-50 disabled:text-slate-500 transition-all font-medium"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5 sm:col-span-2">
                            <label className="text-xs font-bold text-slate-700">Địa chỉ Email</label>
                            <div className="relative">
                                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    disabled
                                    value={formData.email}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm cursor-not-allowed font-medium"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. ĐỊA CHỈ GIAO HÀNG MẶC ĐỊNH */}
                <div className="space-y-4 pt-2">
                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-orange-600 pb-2 border-b border-slate-100 flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Địa chỉ giao hàng mặc định
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700">Tỉnh / Thành phố</label>
                            <input
                                type="text"
                                disabled={!isEditing}
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                placeholder="VD: Hà Nội, TP. Hồ Chí Minh"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-slate-50 disabled:text-slate-500 transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700">Quận / Huyện</label>
                            <input
                                type="text"
                                disabled={!isEditing}
                                value={formData.district}
                                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                placeholder="VD: Cầu Giấy, Đống Đa"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-slate-50 disabled:text-slate-500 transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                            <label className="text-xs font-bold text-slate-700">Địa chỉ cụ thể (Số nhà, đường)</label>
                            <input
                                type="text"
                                disabled={!isEditing}
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="VD: Số 12, Ngõ 34 Phố Trần Thái Tông"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-slate-50 disabled:text-slate-500 transition-all font-medium"
                            />
                        </div>
                    </div>
                </div>

                {/* ACTION BUTTONS WHEN EDITING */}
                {isEditing && (
                    <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving || !isDirty}
                            className="px-8 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-orange-500/20 flex items-center gap-2"
                        >
                            <Check className="w-4 h-4" />
                            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}