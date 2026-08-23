//Lấy danh sách tất cả các stock
export type StockListItem = {
    stockId: number;
    warehouseId: number;
    productVariantId: number;
    warehouseCode: string;
    warehouseName: string;
    sku: string;
    productName: string;
    quantity: number; // tổng số lượng
    reservedQuantity: number; // số lượng đang giữ cho đơn hàng
    updatedAt: string;
}

//Lấy danh sách tất cả các stock theo warehouse
export type GetWarehouseStocksResponse = {
    warehouseId: number;
    warehouseCode: string;
    warehouseName: string;
    items: StockListItem[];
}

// Tạo stock
export type CreateStockRequest = {
    warehouseId: number;
    productVariantId: number;
    quantity: number;
};

//Cập nhật số lượng
export type UpdateStockQuantityRequest = {
    quantity: number;
    note?: string;
};

// export type GetStockParams = {
//     keyword?: string;
//     status?: string;
//     pageNumber?: number;
//     pageSize?: number;
// }

// //Lấy danh sách tất cả các stock
// export type GetStockResponse = {
//     items: StockItem[];
//     pageNumber: number;
//     pageSize: number;
//     totalItems: number;
//     totalPages: number;
// }



