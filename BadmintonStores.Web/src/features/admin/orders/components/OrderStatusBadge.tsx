import { Badge } from "@/components/ui/badge";

type OrderStatusPage = {
    status: string;
};

type PaymentStatusPage = {
    status: string;
};

export function OrderStatusBadge({status}: OrderStatusPage)
{
    const normalizedStatus = status.toLowerCase();
    if(normalizedStatus == "pending")
    {
        return (
            <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                Đang chờ xử lý
            </Badge>
        )
    }
    else if (normalizedStatus === "confirmed") {
        return (
        <Badge className="bg-green-50 text-green-700 hover:bg-green-50">
            Đã xác nhận
        </Badge>
        );
    }
    else if (normalizedStatus === "cancelled") {
        return (
            <Badge className="bg-red-50 text-red-700 hover:bg-red-50">
                Hủy đơn
            </Badge>
        );
    }
   return <Badge variant="secondary">{status}</Badge>;
}   

export function PaymentStatusBadge({status}: PaymentStatusPage)
{
    const normalizedStatus = status.toLowerCase();
    if(normalizedStatus == "pending")
    {
        return (
            <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                Đang chờ xử lý
            </Badge>
        )
    }
    else if (normalizedStatus === "paid") {
        return (
        <Badge className="bg-green-50 text-green-700 hover:bg-green-50">
            Đã thanh toán
        </Badge>
        );
    }
    else if (normalizedStatus === "unpaid") {
        return (
            <Badge className="bg-red-50 text-red-700 hover:bg-red-50">
                Chưa thanh toán
            </Badge>
        );
    }
    else if (normalizedStatus === "refunded") {
        return (
            <Badge className="bg-red-50 text-red-700 hover:bg-red-50">
                Đã hoàn tiền
            </Badge>
        );
    }
   return <Badge variant="secondary">{status}</Badge>;
}   