import { api } from "@/lib/api";

import type { ApiResponse, LoginRequest, AuthResponse, RegisterRequest } from "../types/auth.types";

export async function login(request: LoginRequest) {
    //Gửi request post tới API
    const response = await api.post<ApiResponse<AuthResponse>>(
        "api/auth/login",
        request,
    )
    //Trả về dữ liệu từ response
    return response.data.data
}

export async function register(request: RegisterRequest) {
    const response = await api.post<ApiResponse<AuthResponse>>(
        "api/auth/register",
        request,
    )
    return response.data.data
}

//Lấy thông tin người dùng hiện tại
export async function getMe() {
    const response = await api.get<ApiResponse<AuthResponse["user"]>>(
        "api/customers/me"
    )
    return response.data.data
}

export async function refreshToken() {
    const response = await api.post<ApiResponse<AuthResponse>>(
        "api/auth/refresh"
    )
    return response.data.data
}

export async function logout() {
    await api.post<ApiResponse<object>>("/api/auth/logout")
}