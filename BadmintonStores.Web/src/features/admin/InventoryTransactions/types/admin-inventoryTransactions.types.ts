// lấy danh sách nhật ký tồn kho (1 phần tử)
export type GetInventoryTransactionItem = {
    id: number;
    transactionCode: string;
    warehouseCode: string;
    warehouseName: string;
    productVariantId: number;
    sku: string;
    productName: string;
    transactionType: string;
    quantity: number;
    quantityAfter: number;
    quantityBefore: number;
    note: string;
    createdAt: string;
}

// Dữ liệu gửi lên để lấy ds
export type GetInventoryTransactionParams = {
    warehouseID?: number;
    productVariantID?: number;
    transactionType?: string;
    pageNumber?: number;
    pageSize?: number;
}

//Dữ liệu trả về
export type GetInventoryTransactionsResponse = {
    items: GetInventoryTransactionItem[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}