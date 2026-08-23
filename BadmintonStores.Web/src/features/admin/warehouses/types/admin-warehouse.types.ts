export type EntityStatus = "active" | "inactive";

export type WarehouseListItem = {
    warehouseId: number;
    warehouseCode: string;
    warehouseName: string;
    address: string;
    status: string;
    createdAt: string;
    updatedAt: string | null;
}

export type GetWarehouseParams = {
    keyword?: string;
    status?: string;
    pageNumber?: number;
    pageSize?: number;
}

export type GetWarehouseResponse = {
    items: WarehouseListItem[];
    pageNumber: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

export type GetWarehouseDetailResponse = {
    warehouseId: number;
    warehouseCode: string;
    warehouseName: string;
    address: string;
    status: string;
    createdAt: string;
    updatedAt: string | null;
}

export type CreateWarehouseRequest = {
    warehouseCode: string;
    warehouseName: string;
    address: string;
}

export type CreateWarehouseResponse = {
    warehouseId: number;
    warehouseCode: string;
    warehouseName: string;
    address: string;
    status: string;
    createdAt: string;
};

export type UpdateWarehouseRequest = {
    warehouseName: string;
    address: string;
};

export type UpdateWarehouseResponse = {
    warehouseId: number;
    warehouseCode: string;
    warehouseName: string;
    address: string;
    status: string;
    updatedAt: string;
};

export type UpdateWarehouseStatusRequest = {
    status: EntityStatus;
};

export type UpdateWarehouseStatusResponse = {
    warehouseId: number;
    warehouseCode: string;
    status: string;
    updatedAt: string;
};