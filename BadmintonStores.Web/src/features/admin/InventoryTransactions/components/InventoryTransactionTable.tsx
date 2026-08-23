import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { GetInventoryTransactionItem } from "../types/admin-inventoryTransactions.types";

type InventoryTransactionTableProps = {
    transactions: GetInventoryTransactionItem[];
    isLoading: boolean;
};

export function InventoryTransactionTable({
    transactions,
    isLoading,
}: InventoryTransactionTableProps) {
    if (isLoading) {
        return (
            <div className="p-8 text-center text-sm text-muted-foreground bg-white rounded-lg border">
                Đang tải dữ liệu nhật ký tồn kho...
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="p-8 text-center text-sm text-muted-foreground bg-white rounded-lg border">
                Không tìm thấy nhật ký biến động kho nào.
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Mã GD</TableHead>
                        <TableHead>Kho hàng</TableHead>
                        <TableHead>Sản phẩm (SKU)</TableHead>
                        <TableHead>Loại biến động</TableHead>
                        <TableHead className="text-center">Tồn trước</TableHead>
                        <TableHead className="text-center">Thay đổi</TableHead>
                        <TableHead className="text-center">Tồn sau</TableHead>
                        <TableHead>Ghi chú</TableHead>
                        <TableHead>Thời gian</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((item) => {
                        const isIncrease = item.quantity > 0;
                        return (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.transactionCode}</TableCell>
                                <TableCell>{item.warehouseName}</TableCell>
                                <TableCell>
                                    <div className="font-medium">{item.productName}</div>
                                    <div className="text-xs text-muted-foreground">SKU: {item.sku}</div>
                                </TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800">
                                        {item.transactionType.toUpperCase()}
                                    </span>
                                </TableCell>
                                <TableCell className="text-center">{item.quantityBefore}</TableCell>
                                <TableCell className="text-center font-bold">
                                    <span className={isIncrease ? "text-emerald-600" : "text-red-600"}>
                                        {isIncrease ? `+${item.quantity}` : item.quantity}
                                    </span>
                                </TableCell>
                                <TableCell className="text-center font-semibold">{item.quantityAfter}</TableCell>
                                <TableCell className="max-w-50 truncate" title={item.note || ""}>
                                    {item.note || "-"}
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">
                                    {new Date(item.createdAt).toLocaleString("vi-VN")}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
