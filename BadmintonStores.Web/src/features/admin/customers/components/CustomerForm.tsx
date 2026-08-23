import { useState, useEffect } from "react";
import { Loader2, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CustomerListItem, UpdateCustomerRequest } from "../types/admin-customers.types";

type CustomerFormProps = {
    customer: CustomerListItem;
    isSubmitting: boolean;
    onSubmit: (values: UpdateCustomerRequest) => Promise<void>;
    onCancel: () => void;
};

export function CustomerForm({ customer, isSubmitting, onSubmit, onCancel }: CustomerFormProps) {
    const [fullName, setFullName] = useState(customer.fullName || "");
    const [gender, setGender] = useState(customer.gender || "male");
    const [dateOfBirth, setDateOfBirth] = useState(
        customer.dateOfBirth ? customer.dateOfBirth.split("T")[0] : ""
    );
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        setFullName(customer.fullName || "");
        setGender(customer.gender || "male");
        setDateOfBirth(customer.dateOfBirth ? customer.dateOfBirth.split("T")[0] : "");
    }, [customer]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrorMsg(null);

        if (!fullName.trim()) {
            setErrorMsg("Vui lòng nhập Họ và tên khách hàng");
            return;
        }

        await onSubmit({
            fullName: fullName.trim(),
            gender,
            dateOfBirth: dateOfBirth || undefined,
        });
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-5">
                <div className="flex items-center gap-2 border-b pb-3">
                    <UserCheck className="h-5 w-5 text-blue-600" />
                    <div>
                        <h2 className="text-lg font-bold">Cập nhật Khách hàng #{customer.customerCode}</h2>
                        <p className="text-xs text-muted-foreground">Chỉnh sửa thông tin cá nhân khách hàng</p>
                    </div>
                </div>

                {errorMsg && (
                    <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label>Mã Khách hàng</label>
                        <Input value={customer.customerCode} disabled className="bg-gray-100 text-gray-500 cursor-not-allowed" />
                    </div>

                    <div className="space-y-2">
                        <label>Họ và Tên *</label>
                        <Input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Nhập họ và tên..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label>Giới tính *</label>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm"
                        >
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label>Ngày sinh</label>
                        <Input
                            type="date"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button type="button" variant="outline" disabled={isSubmitting} onClick={onCancel}>
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Lưu Thay Đổi
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
