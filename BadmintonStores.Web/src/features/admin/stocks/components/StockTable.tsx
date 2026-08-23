import { Edit, Eye, PackageSearch } from "lucide-react";
import type { StockListItem } from "../types/admin-stock.types";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type StockTableProp = {
    stocks: StockListItem[];
    isLoading: boolean;
    onViewDetail: (stock: StockListItem) => void;
    onEdit: (stock: StockListItem) => void;
};


export function StockTable({ stocks, isLoading, onEdit}: StockTableProp) {
    if (isLoading) {
        return (
            <div className="rounded-lg border bg-white p-8 text-center text-sm text-muted-foreground">
                Đang tải danh sách tồn kho...
            </div>
        );
    }

    if (stocks.length === 0) {
        return (
            <div className="rounded-lg border bg-white p-8 text-center">
                <PackageSearch className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-3 font-medium">Chưa có tồn kho</p>
                <p className="text-sm text-muted-foreground">
                    Hãy thêm dữ liệu đầu tiên
                </p>
            </div>
        )
    }
    return (
        <div className="overflow-hidden rounded-lg border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="">SKU</TableHead>
                        <TableHead className="">Sản phẩm</TableHead>
                        <TableHead className="">Tồn kho tổng</TableHead>
                        <TableHead className="">Đang giữ</TableHead>
                        <TableHead className="">Khả dụng</TableHead>
                        <TableHead className="">Cập nhật</TableHead>
                        <TableHead className="w-55 text-center">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stocks.map((stock) => (
                        <TableRow key={stock.stockId}>
                            <TableCell className="font-medium">
                                {stock.sku}
                            </TableCell>
                            <TableCell>
                                {stock.productName}
                            </TableCell>
                            <TableCell>
                                {stock.quantity}
                            </TableCell>

                            <TableCell>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${stock.reservedQuantity > 0 ? "bg-amber-100 text-amber-800" : "text-gray-500"}`}>
                                    {stock.reservedQuantity}
                                </span>
                            </TableCell>

                            <TableCell>
                                <span className={`font-semibold ${stock.quantity - stock.reservedQuantity > 0 ? "text-emerald-600" : "text-red-600"}`}>
                                    {stock.quantity - stock.reservedQuantity}
                                </span>
                            </TableCell>

                            <TableCell>
                                {stock.updatedAt ? new Date(stock.updatedAt).toLocaleDateString("vi-VN") : "-"}
                            </TableCell>

                            <TableCell>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        title="Xem chi tiết"
                                        onClick={() => onEdit(stock)}
                                        className="hover:bg-gray-200">
                                        <Eye className="h-4 w-4"/>
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        title="Sửa tồn kho"
                                        onClick={() => onEdit(stock)}
                                        className="hover:bg-gray-200">
                                        <Edit className="h-4 w-4" />
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
