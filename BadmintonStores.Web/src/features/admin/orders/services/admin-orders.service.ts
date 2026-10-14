import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";
import type {
    GetOrdersParams,
    GetOrdersResponse,
    GetOrderDetailResponse,
    CreateOrderRequest,
    UpdateOrderNoteRequest
} from "../types/admin-orders.types";

// 1. Lấy danh sách đơn hàng
export async function getOrders(params: GetOrdersParams) {
    const response = await api.get<ApiResponse<GetOrdersResponse>>(
        `/api/orders`,
        {
            params: {
                ...params,
                pageNumber: params.pageNumber ?? 1,
                pageSize: params.pageSize ?? 10,
            }
        }
    );
    return response.data.data;
}

// 2. Lấy thông tin chi tiết của 1 đơn hàng
export async function getOrderById(orderId: number) {
    const response = await api.get<ApiResponse<GetOrderDetailResponse>>(
        `/api/orders/${orderId}`
    );
    return response.data.data;
}

// 3. Tạo đơn hàng mới
export async function createOrder(request: CreateOrderRequest) {
    const response = await api.post<ApiResponse<GetOrderDetailResponse>>(
        `/api/orders`,
        request
    );
    return response.data.data;
}

// 4. Hủy đơn hàng
export async function cancelOrder(orderId: number) {
    const response = await api.patch<ApiResponse<{ 
        orderId: number; 
        orderCode: string; 
        status: string 
    }>>(
        `/api/orders/${orderId}/cancel`
    );
    return response.data.data;
}

// 5. Cập nhật ghi chú đơn hàng
export async function updateOrderNote(orderId: number, request: UpdateOrderNoteRequest) {
    const response = await api.patch<ApiResponse<{ orderId: number; orderCode: string; note: string }>>(
        `/api/orders/${orderId}/note`,
        request
    );
    return response.data.data;
}

// 6. Cập nhật trạng thái đơn hàng
export async function updateOrderStatus(orderId: number, status: string) {
    const response = await api.patch<ApiResponse<{ orderId: number; orderCode: string; status: string }>>(
        `/api/orders/${orderId}/status`,
        { status }
    );
    return response.data.data;
}

// 7. Cập nhật trạng thái thanh toán
export async function updatePaymentStatus(orderId: number, paymentStatus: string) {
    const response = await api.patch<ApiResponse<{ orderId: number; orderCode: string; paymentStatus: string }>>(
        `/api/orders/${orderId}/payment-status`,
        { paymentStatus }
    );
    return response.data.data;
}
