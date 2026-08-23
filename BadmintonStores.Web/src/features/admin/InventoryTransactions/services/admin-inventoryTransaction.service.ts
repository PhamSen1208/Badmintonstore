import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";
import type {
    GetInventoryTransactionParams,
    GetInventoryTransactionsResponse
} from "../types/admin-inventoryTransactions.types";

export async function getInventoryTransactions(params?: GetInventoryTransactionParams) : Promise<GetInventoryTransactionsResponse>
{
    const response = await api.get<ApiResponse<GetInventoryTransactionsResponse>>(
        "/api/inventory-transactions",
        { params }
    );
    return response.data.data;
}