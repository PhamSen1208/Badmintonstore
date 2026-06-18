export type ApiResponse<T> = {
    success: boolean;
    message: string;
    data?: T;
}

export type AuthUser = {
    userId: number,
    customerId: number,
    email: string,
    phone: string | null
    role: string,
    status: string
    fullName: string | null
}

export type AuthResponse = {
    accessToken: string
    expiresAt: string
    user: AuthUser
}

export type LoginRequest = {
    email: string
    password: string
}

export type RegisterRequest = {
    email: string
    phone?: string
    password: string
    fullName: string
    dateOfBirth?: string
    gender?: string
}