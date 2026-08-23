//Kiểu dữ liệu của 1 phần tử biến thể
export type ProductVariantListItem = {
    productVariantId: number;
    sku: string;
    price: number;
    salePrice: number | null;
    weight: number | null;
    color: string | null;
    size: string | null;
    status: string;
    createdAt: string;
    updatedAt: string | null;
};

export type GetProductVariantsParams = {
    keyword?: string;
    status?: string;
    pageNumber?: number;
    pageSize?: number;
};

// Response trả về khi gọi GET product-variants (danh sách phân trang)
export type GetProductVariantsResponse = {
    productId: number;
    productCode: string;
    productName: string;
    items: ProductVariantListItem[];
    pageNumber: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
};

export type GetProductVariantDetailResponse = {
    productVariantId: number;
    productId: number;
    productCode: string;
    productName: string;
    sku: string;
    price: number;
    salePrice: number | null;
    weight: number | null;
    color: string | null;
    size: string | null;
    status: string;
    createdAt: string;
    updatedAt: string | null;
};

// Body request khi tạo product variant
export type CreateProductVariantRequest = {
    sku: string;
    price: number;
    salePrice?: number;
    weight?: number;
    color?: string;
    size?: string;
};

export type UpdateProductVariantRequest = {
    price: number;
    salePrice?: number;
    weight?: number;
    color?: string;
    size?: string;
};

export type UpdateProductVariantStatusRequest = {
    status: string;
};