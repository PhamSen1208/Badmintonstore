import { Edit } from "lucide-react";
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
    onEdit: (customer: CustomerListItem) => void;
};

export function CustomerTable({ customers, isLoading, onEdit }: CustomerTableProps) {
    if (isLoading) {
        return (
            <div className="p-8 text-center text-sm text-muted-foreground bg-white rounded-lg border">
                Đang tải danh sách khách hàng...
            </div>
        );
    }

    if (customers.length === 0) {
        return (
            <div className="p-8 text-center text-sm text-muted-foreground bg-white rounded-lg border">
                Không tìm thấy khách hàng nào.
            </div>
        );
    }

    function renderGenderBadge(gender: string) {
        switch (gender.toLowerCase()) {
            case "male":
                return <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">Nam</span>;
            case "female":
                return <span className="inline-flex items-center rounded-full bg-pink-50 px-2 py-0.5 text-xs font-medium text-pink-700">Nữ</span>;
            default:
                return <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">Khác</span>;
        }
    }

    return (
        <div className="overflow-hidden rounded-lg border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Mã KH</TableHead>
                        <TableHead>Họ và Tên</TableHead>
                        <TableHead>Giới tính</TableHead>
                        <TableHead>Ngày sinh</TableHead>
                        <TableHead>Ngày đăng ký</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {customers.map((c) => (
                        <TableRow key={c.customerId}>
                            <TableCell className="font-medium">{c.customerCode}</TableCell>
                            <TableCell className="font-semibold">{c.fullName}</TableCell>
                            <TableCell>{renderGenderBadge(c.gender)}</TableCell>
                            <TableCell>
                                {c.dateOfBirth
                                    ? new Date(c.dateOfBirth).toLocaleDateString("vi-VN")
                                    : "-"}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                                {new Date(c.createdAt).toLocaleDateString("vi-VN")}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onEdit(c)}
                                    title="Chỉnh sửa"
                                >
                                    <Edit className="h-4 w-4 text-blue-600" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
