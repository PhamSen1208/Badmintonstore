import { Edit, Eye, PackageSearch, ToggleLeft } from "lucide-react";
import type { WarehouseListItem } from "../types/admin-warehouse.types";
import { WarehouseStatusBadge } from "./WarehouseStatusBadge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type WarehouseTableProp = {
    warehouses: WarehouseListItem[];
    isLoading: boolean;
    onViewDetail: (warehouse: WarehouseListItem) => void;
    onEdit: (warehouse: WarehouseListItem) => void;
    onToggleStatus: (warehouse: WarehouseListItem) => void;
};

export function WarehouseTable({ warehouses, isLoading, onViewDetail, onEdit, onToggleStatus }: WarehouseTableProp) {
    if (isLoading) {
        return (
            <div className="rounded-lg border bg-white p-8 text-center text-sm text-muted-foreground">
                Đang tải danh sách kho...
            </div>
        );
    }

    if (warehouses.length === 0) {
        return (
            <div className="rounded-lg border bg-white p-8 text-center">
                <PackageSearch className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-3 font-medium">Chưa có kho</p>
                <p className="text-sm text-muted-foreground">
                    Hãy thêm kho đầu tiên để bắt đầu
                </p>
            </div>
        )
    }
    return (
        <div className="overflow-hidden rounded-lg border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="">Mã kho</TableHead>
                        <TableHead className="">Tên kho</TableHead>
                        <TableHead className="">Địa chỉ</TableHead>
                        <TableHead className="">Trạng thái</TableHead>
                        <TableHead className="">Ngày tạo</TableHead>
                        <TableHead className="w-55 text-center">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {warehouses.map((warehouse) => (
                        <TableRow key={warehouse.warehouseId}>
                            <TableCell className="font-medium">
                                {warehouse.warehouseCode}
                            </TableCell>
                            <TableCell>
                                {warehouse.warehouseName}
                            </TableCell>
                            <TableCell>
                                {warehouse.address}
                            </TableCell>

                            <TableCell>
                                <WarehouseStatusBadge status={warehouse.status} />
                            </TableCell>

                            <TableCell>
                                {new Date(warehouse.createdAt).toLocaleDateString("vi-VN")}
                            </TableCell>

                            <TableCell>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        title="Quản lý tồn kho"
                                        onClick={() => onViewDetail(warehouse)}
                                        className="hover:bg-gray-200">
                                        <Eye className="h-4 w-4"/>
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        title="Sửa kho hàng"
                                        onClick={() => onEdit(warehouse)}
                                        className="hover:bg-gray-200">
                                        <Edit className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        title="Đổi trạng thái"
                                        onClick={() => onToggleStatus(warehouse)}
                                        className="hover:bg-gray-200">
                                        <ToggleLeft className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
