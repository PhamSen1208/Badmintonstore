import { useState } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { changePassword } from "@/features/auth/services/auth.service";
import { toast } from "sonner";

export function ChangePasswordForm() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [isSubmitting, setSubmitting] = useState(false);
    
    async function handleSubmit(e: React.FormEvent)
    {
        e.preventDefault();
        setSubmitting(true);

        if(!currentPassword || !newPassword || !confirmNewPassword)
        {
            toast.error("Vui lòng nhập đầy đủ thông tin")
            setSubmitting(false);
            return;;
        }

        if(newPassword != confirmNewPassword)
        {
            toast.error("Mật khẩu mới và xác nhận mật khẩu mới không khớp");
            setSubmitting(false);
            return;
        }

        try {
            setSubmitting(true);
            await changePassword({ 
                currentPassword: currentPassword,
                newPassword: newPassword,
                confirmNewPassword: confirmNewPassword 
            });
            toast.success("Đổi mật khẩu thành công");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại!";
            toast.error(msg);
        }finally{
            setSubmitting(false);
        }
    }
    
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="h-10 w-10 rounded-xl bg-orange-100 text-orange-600 font-bold flex items-center justify-center text-lg shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Bảo mật & Đổi Mật Khẩu</h2>
                    <p className="text-xs text-slate-400">Cập nhật mật khẩu định kỳ để bảo vệ tài khoản của bạn</p>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Mật khẩu hiện tại</label>
                    <PasswordInput
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Nhập mật khẩu đang dùng"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Mật khẩu mới</label>
                    <PasswordInput
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Ít nhất 8 ký tự (có chữ hoa, thường, số & ký tự đặc biệt)"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Xác nhận mật khẩu mới</label>
                    <PasswordInput
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Nhập lại mật khẩu mới"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-2.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2"
                >
                    <KeyRound className="h-4 w-4" />
                    <span>{isSubmitting ? "Đang lưu..." : "Cập nhật mật khẩu"}</span>
                </button>
            </form>
        </div>
    );
}
