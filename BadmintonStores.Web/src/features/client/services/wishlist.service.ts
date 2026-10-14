import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";

export interface WishlistItem {
    productId: number;
    productName: string;
    brandName?: string;
    categoryName?: string;
    basePrice: number;
    primaryImageUrl?: string;
    addedAt: string;
}

export interface ToggleWishListResult {
    productId: number;
    isFavorite: boolean;
    message: string;
}

export async function getMyWishlist(): Promise<WishlistItem[]> {
    const response = await api.get<ApiResponse<WishlistItem[]>>("/api/wishlist");
    return response.data.data || [];
}

export async function getMyWishlistIds(): Promise<number[]> {
    const response = await api.get<ApiResponse<number[]>>("/api/wishlist/ids");
    return response.data.data || [];
}

export async function toggleWishlist(productId: number): Promise<ToggleWishListResult> {
    const response = await api.post<ApiResponse<ToggleWishListResult>>(`/api/wishlist/toggle/${productId}`);
    return response.data.data;
}
