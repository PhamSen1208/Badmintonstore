import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";
import type {
    GetProductResponse,
    CreateProductRequest,
    CreateProductResponse,
    UpdateProductRequest,
    UpdateProductResponse,
    UpdateProductStatusRequest,
    UpdateProductStatusResponse,
    GetProductParams,
    GetProductDetailResponse,

} from "../types/admin-product.types";

export async function getProducts(params: GetProductParams) {
    const response = await api.get<ApiResponse<GetProductResponse>>(
        "/api/products",
        {
            params: {
                keyword: params.keyword,
                status: params.status,
                categoryId: params.categoryId,
                brandId: params.brandId,
                pageNumber: params.pageNumber ?? 1,
                pageSize: params.pageSize ?? 10,
            },
        }
    );
    return response.data.data;
}

export async function getProductById(productId: number) {
    const response = await api.get<ApiResponse<GetProductDetailResponse>>(
        `/api/products/${productId}`
    );
    return response.data.data;
}

export async function createProduct(request: CreateProductRequest) {
    const response = await api.post<ApiResponse<CreateProductResponse>>(
        "/api/products",
        request
    );
    return response.data.data;
}

export async function updateProduct(productId: number, request: UpdateProductRequest) {
    const response = await api.patch<ApiResponse<UpdateProductResponse>>(
        `/api/products/${productId}`,
        request
    );
    return response.data.data;
}

export async function updateProductStatus(productId: number, request: UpdateProductStatusRequest) {
    const response = await api.patch<ApiResponse<UpdateProductStatusResponse>>(
        `/api/products/${productId}/status`,
        request
    );
    return response.data.data;
}
