import { Badge } from "@/components/ui/badge";

type OrderStatusProps = {
    status: string;
};

type PaymentStatusProps = {
    status: string;
};

export function OrderStatusBadge({ status }: OrderStatusProps) {
    const normalizedStatus = status.toLowerCase();
    
    switch (normalizedStatus) {
        case "pending":
            return (
                <Badge className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-50">
                    Chờ xử lý
                </Badge>
            );
        case "confirmed":
            return (
                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50">
                    Đã xác nhận
                </Badge>
            );
        case "shipping":
            return (
                <Badge className="bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-50">
                    Đang giao hàng
                </Badge>
            );
        case "completed":
            return (
                <Badge className="bg-green-100 text-green-800 border border-green-200 hover:bg-green-100">
                    Hoàn thành
                </Badge>
            );
        case "cancelled":
            return (
                <Badge className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-50">
                    Đã hủy
                </Badge>
            );
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
}

export function PaymentStatusBadge({ status }: PaymentStatusProps) {
    const normalizedStatus = status.toLowerCase();

    switch (normalizedStatus) {
        case "paid":
            return (
                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50">
                    Đã thanh toán
                </Badge>
            );
        case "unpaid":
            return (
                <Badge className="bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-50">
                    Chưa thanh toán
                </Badge>
            );
        case "refunded":
            return (
                <Badge className="bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-50">
                    Đã hoàn tiền
                </Badge>
            );
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
}
