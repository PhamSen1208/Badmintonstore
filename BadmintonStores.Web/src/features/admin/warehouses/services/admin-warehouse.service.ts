import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";
import type {
    GetWarehouseResponse,
    CreateWarehouseRequest,
    CreateWarehouseResponse,
    UpdateWarehouseRequest,
    UpdateWarehouseResponse,
    UpdateWarehouseStatusRequest,
    UpdateWarehouseStatusResponse,
    GetWarehouseParams,
    GetWarehouseDetailResponse,

} from "../types/admin-warehouse.types";

export async function getWarehouses(params: GetWarehouseParams) {
    const response = await api.get<ApiResponse<GetWarehouseResponse>>(
        "/api/warehouses",
        {
            params: {
                keyword: params.keyword,
                status: params.status,
                pageNumber: params.pageNumber ?? 1,
                pageSize: params.pageSize ?? 10,
            },
        }
    );
    return response.data.data;
}

export async function getWarehouseById(warehouseId: number) {
    const response = await api.get<ApiResponse<GetWarehouseDetailResponse>>(
        `/api/warehouses/${warehouseId}`
    );
    return response.data.data;
}

export async function createWarehouse(request: CreateWarehouseRequest) {
    const response = await api.post<ApiResponse<CreateWarehouseResponse>>(
        "/api/warehouses",
        request
    );
    return response.data.data;
}

export async function updateWarehouse(warehouseId: number, request: UpdateWarehouseRequest) {
    const response = await api.patch<ApiResponse<UpdateWarehouseResponse>>(
        `/api/warehouses/${warehouseId}`,
        request
    );
    return response.data.data;
}

export async function updateWarehouseStatus(warehouseId: number, request: UpdateWarehouseStatusRequest) {
    const response = await api.patch<ApiResponse<UpdateWarehouseStatusResponse>>(
        `/api/warehouses/${warehouseId}/status`,
        request
    );
    return response.data.data;
}
