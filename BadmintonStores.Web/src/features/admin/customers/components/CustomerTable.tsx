import { Edit, Eye, Lock, Unlock, Loader2, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { CustomerListItem } from "../types/admin-customers.types";

type CustomerTableProps = {
    customers: CustomerListItem[];
    isLoading: boolean;
    togglingId: number | null;
    onViewDetail: (customer: CustomerListItem) => void;
    onEdit: (customer: CustomerListItem) => void;
    onToggleStatus: (customerId: number) => void;
};

export function CustomerTable({
    customers,
    isLoading,
    togglingId,
    onViewDetail,
    onEdit,
    onToggleStatus,
}: CustomerTableProps) {
    if (isLoading) {
        return (
            <div className="p-12 text-center text-sm text-slate-500 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                <span>Đang tải danh sách khách hàng...</span>
            </div>
        );
    }

    if (customers.length === 0) {
        return (
            <div className="p-12 text-center text-sm text-slate-500 bg-white rounded-2xl border border-slate-100 shadow-sm">
                Không tìm thấy khách hàng nào phù hợp với bộ lọc.
            </div>
        );
    }

    function formatVND(amount: number) {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
    }

    function renderGenderBadge(gender: string) {
        switch (gender.toLowerCase()) {
            case "male":
                return <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">Nam</span>;
            case "female":
                return <span className="inline-flex items-center rounded-full bg-pink-50 px-2.5 py-0.5 text-xs font-semibold text-pink-700 border border-pink-200">Nữ</span>;
            default:
                return <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">Khác</span>;
        }
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase">
                        <TableHead className="p-4">Khách hàng</TableHead>
                        <TableHead className="p-4">Thông tin liên hệ</TableHead>
                        <TableHead className="p-4">Giới tính & Ngày sinh</TableHead>
                        <TableHead className="p-4">Đơn hàng & Chi tiêu</TableHead>
                        <TableHead className="p-4">Trạng thái</TableHead>
                        <TableHead className="p-4 text-right">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-100 text-sm">
                    {customers.map((c) => {
                        const isLocked = c.userStatus?.toLowerCase() === "locked";
                        return (
                            <TableRow key={c.customerId} className="hover:bg-slate-50/50 transition-colors">
                                {/* Khách hàng */}
                                <TableCell className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold text-sm shrink-0 border border-emerald-200">
                                            {c.fullName ? c.fullName.charAt(0).toUpperCase() : "K"}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{c.fullName}</p>
                                            <p className="text-xs text-slate-400 font-mono">Mã: {c.customerCode}</p>
                                        </div>
                                    </div>
                                </TableCell>

                                {/* Liên hệ */}
                                <TableCell className="p-4">
                                    <div className="space-y-1 text-xs">
                                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span className="truncate max-w-[180px]">{c.email || "—"}</span>
                                        </div>
                                        {c.phone && (
                                            <div className="flex items-center gap-1.5 text-slate-500">
                                                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                <span>{c.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </TableCell>

                                {/* Giới tính & Ngày sinh */}
                                <TableCell className="p-4 whitespace-nowrap">
                                    <div className="space-y-1">
                                        <div>{renderGenderBadge(c.gender)}</div>
                                        <div className="text-xs text-slate-500">
                                            {c.dateOfBirth ? new Date(c.dateOfBirth).toLocaleDateString("vi-VN") : "Chưa nhập ngày sinh"}
                                        </div>
                                    </div>
                                </TableCell>

                                {/* Đơn hàng & Chi tiêu */}
                                <TableCell className="p-4 whitespace-nowrap">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-200">
                                                {c.totalOrders} đơn
                                            </span>
                                            <span className="font-bold text-emerald-700 text-sm">{formatVND(c.totalSpent)}</span>
                                        </div>
                                        {c.lastOrderDate && (
                                            <p className="text-[11px] text-slate-400">
                                                Gần nhất: {new Date(c.lastOrderDate).toLocaleDateString("vi-VN")}
                                            </p>
                                        )}
                                    </div>
                                </TableCell>

                                {/* Trạng thái */}
                                <TableCell className="p-4 whitespace-nowrap">
                                    {isLocked ? (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 border border-red-200">
                                            Đã khóa
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                                            Hoạt động
                                        </span>
                                    )}
                                </TableCell>

                                {/* Thao tác */}
                                <TableCell className="p-4 text-right whitespace-nowrap">
                                    <div className="flex items-center justify-end gap-1">
                                        {/* Nút Xem chi tiết */}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onViewDetail(c)}
                                            className="h-8 w-8 p-0 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg"
                                            title="Xem chi tiết"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>

                                        {/* Nút Chỉnh sửa */}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEdit(c)}
                                            className="h-8 w-8 p-0 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                                            title="Chỉnh sửa thông tin"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>

                                        {/* Nút Khóa / Mở khóa */}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            disabled={togglingId === c.customerId}
                                            onClick={() => onToggleStatus(c.customerId)}
                                            className={`h-8 w-8 p-0 rounded-lg transition-colors ${
                                                isLocked
                                                    ? "text-red-500 hover:text-emerald-700 hover:bg-emerald-50"
                                                    : "text-slate-400 hover:text-red-600 hover:bg-red-50"
                                            }`}
                                            title={isLocked ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                                        >
                                            {togglingId === c.customerId ? (
                                                <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                                            ) : isLocked ? (
                                                <Unlock className="h-4 w-4 text-emerald-600" />
                                            ) : (
                                                <Lock className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
