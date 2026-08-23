import { Eye, XCircle } from "lucide-react";
import type { OrderListItem } from "../types/admin-orders.types";
import { OrderStatusBadge, PaymentStatusBadge } from "./OrderStatusBadge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { currencyFormatter } from "@/lib/formatters";

type OrderTableProp = {
    orders: OrderListItem[];
    isLoading: boolean;
    onViewDetail: (order: OrderListItem) => void;
    onCancel: (order: OrderListItem) => void;
};

export function OrderTable({ orders, isLoading, onViewDetail, onCancel }: OrderTableProp) {
    if (isLoading) {
        return (
            <div className="rounded-lg border bg-white p-8 text-center text-sm text-muted-foreground">
                Đang tải danh sách đơn hàng...
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="rounded-lg border bg-white p-8 text-center">
                <XCircle className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-3 font-medium">Chưa có đơn hàng</p>
                <p className="text-sm text-muted-foreground">
                    Hãy tạo đơn hàng đầu tiên để bắt đầu
                </p>
            </div>
        )
    }
    return (
        <div className="overflow-hidden rounded-lg border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Mã đơn hàng</TableHead>
                        <TableHead>Tên khách hàng</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Thanh toán</TableHead>
                        <TableHead>Tổng tiền</TableHead>
                        <TableHead>Ngày đặt hàng</TableHead>
                        <TableHead className="w-28 text-center">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.orderId}>
                            <TableCell className="font-medium">
                                {order.orderCode}
                            </TableCell>
                            <TableCell>
                                {order.customerName || "-"}
                            </TableCell>
                            <TableCell>
                                <OrderStatusBadge status={order.status} />
                            </TableCell>

                            <TableCell>
                                <PaymentStatusBadge status={order.paymentStatus} />
                            </TableCell>

                            <TableCell>
                                {currencyFormatter.format(order.totalAmount)}
                            </TableCell>
                            <TableCell>
                                {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                            </TableCell>

                            <TableCell>
                                <div className="flex justify-end gap-1">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        title="Xem chi tiết đơn hàng"
                                        onClick={() => onViewDetail(order)}
                                        className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                                        <Eye className="h-4 w-4"/>
                                    </Button>

                                    {order.status.toLowerCase() !== "cancelled" && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            title="Hủy đơn hàng"
                                            onClick={() => onCancel(order)}
                                            className="h-8 w-8 text-red-500 hover:bg-red-50">
                                            <XCircle className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
