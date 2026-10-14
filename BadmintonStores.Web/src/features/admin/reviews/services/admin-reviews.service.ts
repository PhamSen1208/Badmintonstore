import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";

export interface AdminReviewItem {
    id: number;
    customerId: number;
    customerName: string;
    customerAvatar?: string;
    productId: number;
    productName: string;
    orderId?: number;
    rating: number;
    comment: string;
    isVerifiedPurchase: boolean;
    createdAt: string;
}

export interface GetAdminReviewsResponse {
    items: AdminReviewItem[];
    pageNumber: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

export interface GetAdminReviewsParams {
    keyword?: string;
    rating?: number;
    pageNumber?: number;
    pageSize?: number;
}

export async function getAdminReviews(params: GetAdminReviewsParams) {
    const response = await api.get<ApiResponse<GetAdminReviewsResponse>>("/api/reviews/admin", {
        params: {
            keyword: params.keyword || undefined, 
            rating: params.rating || undefined,
            pageNumber: params.pageNumber || 1,
            pageSize: params.pageSize || 10,
        }
    });
    return response.data.data;
}

export async function adminDeleteReview(reviewId: number) {
    const response = await api.delete<ApiResponse<boolean>>(`/api/reviews/admin/${reviewId}`);
    return response.data.data;
}
