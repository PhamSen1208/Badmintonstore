import { api } from "@/lib/api";

import type { ApiResponse, LoginRequest, AuthResponse, RegisterRequest } from "../types/auth.types";

export async function login(request: LoginRequest) {
    const response = await api.post<ApiResponse<AuthResponse>>(
        "/api/auth/login",
        request,
    )
    return response.data.data
}

export async function googleLogin(idToken: string) {
    const response = await api.post<ApiResponse<AuthResponse>>(
        "/api/auth/google-login",
        { idToken }
    );
    return response.data.data;
}

export async function register(request: RegisterRequest) {
    const response = await api.post<ApiResponse<AuthResponse>>(
        "/api/auth/register",
        request,
    )
    return response.data.data
}

//Lấy thông tin người dùng hiện tại
export async function getMe() {
    const response = await api.get<ApiResponse<AuthResponse["user"]>>(
        "/api/auth/me"
    )
    return response.data.data
}

export async function refreshToken() {
    const response = await api.post<ApiResponse<AuthResponse>>(
        "/api/auth/refresh"
    )
    return response.data.data
}

export async function logout() {
    await api.post<ApiResponse<object>>("/api/auth/logout")
}

export async function changePassword(payload: { currentPassword: string; newPassword: string; confirmNewPassword: string }) {
    const response = await api.post<ApiResponse<object>>(
        "/api/auth/change-password",
        payload
    );
    return response.data.data; 
}