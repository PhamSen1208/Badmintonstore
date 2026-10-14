//Thông tin các coupon (Đã và đang được sử dụng)
export interface CouponListItem {
    couponId: number,
    couponCode: string,
    description?: string;
    discountType: number; // 1: Percentage (%), 2: FixedAmount (Số tiền cố định)
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

export interface GetAdminCouponsResponse {
    items: CouponListItem[];
    pageIndex: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
}

export interface GetAdminCouponsParams
{
    keyword?: string;
    status?: string;
    pageNumber: number;
    pageSize: number;
}

//Tạo thông tin coupon khi admin nhập
export interface CreateCouponPayload {
    couponCode: string;
    description?: string;
    discountType: number;
    discountValue: number;
    minOrderAmount: number;
    maxDiscountAmount?: number;
    quantity: number;
    maxUsageUser: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
}