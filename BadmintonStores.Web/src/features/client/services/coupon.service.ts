import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";

export interface CouponItemResponse {
    couponId: number;
    couponCode: string;
    description?: string;
    discountType: number; // 1: Percentage, 2: FixedAmount
    discountValue: number;
    minOrderAmount: number;
    maxDiscountAmount?: number;
    quantity: number;
    quantityUsed: number;
    maxUsageUser: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

export interface ValidateCouponResponse {
    isValid: boolean;
    couponId: number;
    couponCode: string;
    message: string;
    discountAmount: number;
    finalAmount: number;
}

export async function validateCoupon(couponCode: string, orderSubtotal: number) {
    const response = await api.post<ApiResponse<ValidateCouponResponse>>("/api/coupons/validate", {
        couponCode,
        orderSubtotal,
    });
    return response.data.data;
}

export async function getAvailableCoupons() {
    const response = await api.get<ApiResponse<CouponItemResponse[]>>("/api/coupons/available");
    return response.data.data;
}
