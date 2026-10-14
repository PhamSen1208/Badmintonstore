import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";

export interface ProductReview {
  id: number;
  customerId: number;
  customerName: string;
  customerAvatar?: string;
  productId: number;
  orderId?: number;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface ProductReviewSummary {
  productId: number;
  averageRating: number;
  totalReviews: number;
  fiveStarCount: number;
  fourStarCount: number;
  threeStarCount: number;
  twoStarCount: number;
  oneStarCount: number;
}

export interface CreateProductReviewData {
  productId: number;
  orderId?: number;
  rating: number;
  comment: string;
}

export async function getProductReviews(productId: number, rating?: number): Promise<ProductReview[]> {
  const params = rating ? { rating } : {};
  const response = await api.get<ApiResponse<ProductReview[]>>(`/api/reviews/product/${productId}`, { params });
  return Array.isArray(response.data?.data) ? response.data.data : [];
}

export async function getProductReviewSummary(productId: number): Promise<ProductReviewSummary> {
  const response = await api.get<ApiResponse<ProductReviewSummary>>(`/api/reviews/product/${productId}/summary`);
  return response.data?.data || {
    productId,
    averageRating: 0,
    totalReviews: 0,
    fiveStarCount: 0,
    fourStarCount: 0,
    threeStarCount: 0,
    twoStarCount: 0,
    oneStarCount: 0,
  };
}

export async function createProductReview(data: CreateProductReviewData): Promise<ProductReview> {
  const response = await api.post<ApiResponse<ProductReview>>("/api/reviews", data);
  return response.data.data;
}

export async function deleteProductReview(id: number): Promise<boolean> {
  const response = await api.delete<ApiResponse<boolean>>(`/api/reviews/${id}`);
  return !!response.data.data;
}

export async function adminDeleteProductReview(id: number): Promise<boolean> {
  const response = await api.delete<ApiResponse<boolean>>(`/api/reviews/admin/${id}`);
  return !!response.data.data;
}
