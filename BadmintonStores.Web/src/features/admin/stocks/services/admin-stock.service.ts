import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";
import type {
    StockListItem,
    GetWarehouseStocksResponse,
    CreateStockRequest,
    UpdateStockQuantityRequest,
    // GetStockParams,
    // GetStockResponse,

} from "../types/admin-stock.types";

// export async function getStocks(params: GetStockParams)
// {
//     const response = await api.get<ApiResponse<GetStockResponse>>
//     (
//         `/api/stocks`,
//         {
//             params: {
//                 keyword: params.keyword,
//                 status: params.status, 
//                 pageNumber: params.pageNumber,
//                 pageSize: params.pageSize,
//             },
//         }
//     )
//     return response.data.data;
// }

export async function getWareHouseStocks(warehouseId: number)
{
    const response = await api.get<ApiResponse<GetWarehouseStocksResponse>>
    (
        `/api/warehouses/${warehouseId}/stocks`
    )
    return response.data.data;
}

export async function createStock(request: CreateStockRequest)
{
    const response = await api.post<ApiResponse<StockListItem>>
    (
        `/api/stocks`,
        request
    )
    return response.data.data;
}

export async function updateStockQuantity(stockId: number, request: UpdateStockQuantityRequest)
{
    const response = await api.patch<ApiResponse<StockListItem>>
    (
        `/api/stocks/${stockId}`,
        request
    )
    return response.data.data; 
}