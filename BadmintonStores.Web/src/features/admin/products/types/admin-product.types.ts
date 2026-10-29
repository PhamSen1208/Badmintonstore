export type ProductStatus = "active" | "inactive";

export type ProductListItem = {
    productId: number;
    productCode: string;
    productName: string;
    basePrice: number;
    status: string;
    categoryId?: number | null;
    categoryName?: string | null;
    brandId?: number | null;
    brandName?: string | null;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string | null;
}

export type GetProductResponse = {
    items: ProductListItem[];
    pageNumber: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

export type GetProductDetailResponse = {
    productId: number;
    productCode: string;
    productName: string;
    basePrice: number;
    description: string | null;
    warranty: string | null;
    status: string;
    categoryId?: number | null;
    categoryName?: string | null;
    brandId?: number | null;
    brandName?: string | null;
    createdAt: string;
    updatedAt: string | null;
}

export type GetProductParams = {
    keyword?: string;
    status?: string;
    categoryId?: number;
    brandId?: number;
    pageNumber?: number;
    pageSize?: number;
}

export type CreateProductRequest = {
    productCode: string;
    productName: string;
    basePrice: number;
    categoryId?: number;
    brandId?: number;
    description?: string;
    warranty?: string;
}

export type CreateProductResponse = {
    productId: number;
    productCode: string;
    productName: string;
    basePrice: number;
    description: string | null;
    warranty: string | null;
    status: string;
    createdAt: string;
};

export type UpdateProductRequest = {
    productName: string;
    basePrice: number;
    categoryId?: number;
    brandId?: number;
    description?: string;
    warranty?: string;
};

export type UpdateProductResponse = {
    productId: number;
    productCode: string;
    productName: string;
    basePrice: number;
    description: string | null;
    warranty: string | null;
    status: string;
    updatedAt: string;
};

export type UpdateProductStatusRequest = {
    status: ProductStatus;
};

export type UpdateProductStatusResponse = {
    productId: number;
    productCode: string;
    status: string;
    updatedAt: string;
};
