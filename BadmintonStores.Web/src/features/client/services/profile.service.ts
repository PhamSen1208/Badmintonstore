import {api} from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";
import type{ UpdateProfileRequest } from "../types/profile.types";

export async function updateProfile(customerId: number, request: UpdateProfileRequest)
{
    await api.patch<ApiResponse<any>>(
        `/api/customers/${customerId}`, {
            fullName: request.fullName,
        }
    );

    if(request.address || request.district || request.city)
    {
        await api.post(`/api/CustomerAddresses`,{
            customerId: customerId,
            recipientName: request.fullName,
            phoneNumber: request.phone,
            city: request.city,
            district: request.district,
            addressDetail: request.address,
            isDefault: true
        });
    }
}
