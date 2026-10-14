import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";
import type {
    CouponListItem,
    CreateCouponPayload,
    GetAdminCouponsParams,
    GetAdminCouponsResponse
} from "../types/admin-coupons-types";

//Lấy danh sách mã giảm giá (admin)
export async function GetCoupons(params: GetAdminCouponsParams)
{
    const response = await api.get<ApiResponse<GetAdminCouponsResponse>>("api/coupons", {
        params: {
            keyword: params.keyword,
            isActive: params.status == "active" ? true : params.status == "inactive" ? false : undefined,
            pageNumber: params.pageNumber,
            pageSize: params.pageSize
        }
    });
    return response.data.data;
}

//Lấy thông tin chi tiết 1 coupon
export async function GetCouponById(couponId: number)
{
    const response = await api.get<ApiResponse<CouponListItem>>(`api/coupons/${couponId}`);
    return response.data.data;
}

//Tạo coupon mới (admin)
export async function CreateCoupon(payload: CreateCouponPayload)
{
    const response = await api.post<ApiResponse<CouponListItem>>("api/coupons", payload);
    return response.data.data;
}

//Cập nhật coupon
export async function UpdateCoupon(couponId: number, payload: CreateCouponPayload)
{
    const response = await api.put<ApiResponse<boolean>>(`api/coupons/${couponId}`, payload);
    return response.data.data;
}

//Bật tắt trạng thái coupon (admin)
export async function ToggleCouponStatus(couponId: number)
{
    const response = await api.patch<ApiResponse<boolean>>(`api/coupons/${couponId}/toggle`);
    return response.data.data;
}