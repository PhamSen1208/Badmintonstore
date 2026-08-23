import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";
import type {
    GetProductVariantsResponse,
    GetProductVariantDetailResponse,
    CreateProductVariantRequest,
    GetProductVariantsParams,
    UpdateProductVariantRequest,
    UpdateProductVariantStatusRequest,
    ProductVariantListItem,
} from "../types/product-variant.types";

export async function getProductVariants(productId: number, params?: GetProductVariantsParams) {
    const response = await api.get<ApiResponse<GetProductVariantsResponse>>(
        `/api/products/${productId}/variants`,
        {
            params: {
                keyword: params?.keyword,
                status: params?.status,
                pageNumber: params?.pageNumber ?? 1,
                pageSize: params?.pageSize ?? 10,
            },
        }
    );
    return response.data.data;
}

export async function getProductVariantById(productVariantId: number) {
    const response = await api.get<ApiResponse<GetProductVariantDetailResponse>>(
        `/api/product-variants/${productVariantId}`
    );
    return response.data.data;
}

export async function createProductVariant(productId: number, request: CreateProductVariantRequest) {
    const response = await api.post<ApiResponse<ProductVariantListItem>>
        (
            `/api/products/${productId}/variants`,
            request
        )
    return response.data.data;
}
export async function updateProductVariant(productVariantId: number, request: UpdateProductVariantRequest) {
    const response = await api.patch<ApiResponse<ProductVariantListItem>>(
        `/api/product-variants/${productVariantId}`,
        request
    )
    return response.data.data;
}

export async function updateProductVariantStatus(productVariantId: number, request: UpdateProductVariantStatusRequest) {
    const response = await api.patch<ApiResponse<ProductVariantListItem>>(
        `/api/product-variants/${productVariantId}/status`,
        request
    )
    return response.data.data;
}