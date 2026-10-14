import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";
import type {
    CustomerListItem,
    GetCustomersParams,
    GetCustomersResponse,
    CreateCustomerRequest,
    UpdateCustomerRequest,
} from "../types/admin-customers.types";

export async function getCustomers(params?: GetCustomersParams): Promise<GetCustomersResponse> {
    const res = await api.get<ApiResponse<GetCustomersResponse>>("/api/customers", { params });
    return res.data.data;
}

export async function getCustomerById(customerId: number): Promise<CustomerListItem> {
    const res = await api.get<ApiResponse<CustomerListItem>>(`/api/customers/${customerId}`);
    return res.data.data;
}

export async function createCustomer(data: CreateCustomerRequest): Promise<CustomerListItem> {
    const res = await api.post<ApiResponse<CustomerListItem>>("/api/customers", data);
    return res.data.data;
}

export async function updateCustomer(
    customerId: number,
    data: UpdateCustomerRequest
): Promise<CustomerListItem> {
    const res = await api.patch<ApiResponse<CustomerListItem>>(`/api/customers/${customerId}`, data);
    return res.data.data;
}

export async function toggleCustomerStatus(customerId: number): Promise<boolean> {
    const res = await api.patch<ApiResponse<boolean>>(`/api/customers/${customerId}/toggle-status`);
    return res.data.data;
}
