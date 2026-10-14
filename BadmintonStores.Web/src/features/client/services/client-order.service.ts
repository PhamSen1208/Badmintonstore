import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";
import type { CreateClientOrderRequest, CreateClientOrderResponse } from "../types/order.types";
import type { GetOrdersResponse } from "@/features/admin/orders/types/admin-orders.types";

export async function createClientOrder(payload: CreateClientOrderRequest) {
    const response = await api.post<ApiResponse<CreateClientOrderResponse>>("/api/orders", payload);
    return response.data.data;
}

export async function getMyOrders(customerId: number)
{
    const response = await api.get<ApiResponse<GetOrdersResponse>>(
        `/api/orders`,
        {
            params:{
                customerId: customerId,
                pageNumber: 1,
                pageSize: 10
            }
        }
    );
    return response.data.data;
}

export async function cancelMyOrder(orderId: number)
{
    const response = await api.patch<ApiResponse<{ orderId: number; orderCode: string; status: string }>>(
        `/api/orders/${orderId}/cancel`
    );
    return response.data.data;
}

export async function getOrderDetail(orderId: number)
{
    const response = await api.get<ApiResponse<any>>(`/api/orders/${orderId}`);
    return response.data.data;
}
