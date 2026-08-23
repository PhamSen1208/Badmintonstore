import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { setAccessToken } from "@/lib/api";
import type { AuthResponse, AuthUser, LoginRequest, RegisterRequest } from "../types/auth.types";
import {
    login as loginApi,
    logout as logoutApi,
    refreshToken,
    register as registerApi
} from "../services/auth.service";

// Định nghĩa kiểu dữ liệu cho context
type AuthContextValue = {
    user: AuthUser | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isBootstrapping: boolean;
    login: (request: LoginRequest) => Promise<AuthResponse>;
    logout: () => Promise<void>;
    register: (request: RegisterRequest) => Promise<AuthResponse>;
}

// Tạo Context và export
export const AuthContext = createContext<AuthContextValue | null>(null)

type AuthProviderProps = {
    children: ReactNode;
}


export function AuthProvider({children}: AuthProviderProps)
{
    const [user, setUser] = useState<AuthUser | null>(null); //Lưu thông tin user hiện tại
    const [accessTokenValue, setAccessTokenValue] = useState<string | null>(null); // Lưu accessToken
    const [isBootstrapping, setIsBootstrapping] = useState(true); //Lưu trạng thái khởi tạo

    // Hàm áp dụng thông tin đăng nhập vào state
    const applyAuth = useCallback((result: AuthResponse) => {
        setUser(result.user)
        setAccessTokenValue(result.accessToken)
        setAccessToken(result.accessToken)
    }, [])

    // Hàm xóa thông tin đăng nhập
    const clearAuth = useCallback(() => {
        setUser(null);
        setAccessTokenValue(null)
        setAccessToken(null)
    }, [])

    // Effect để kiểm tra xem user đã đăng nhập chưa hay refresh trang
    useEffect(() => {
        async function bootstrapAuth()
        {
            try{
                const result = await refreshToken();
                applyAuth(result);
            } catch(e){
                clearAuth();
            } finally {
                setIsBootstrapping(false);
            }
        }
        bootstrapAuth();
    }, [applyAuth, clearAuth])

    //Hàm đăng nhập
    async function login(request: LoginRequest) {
        const result = await loginApi(request)
        applyAuth(result)
        return result
    }

    //Hàm đăng ký
    async function register(request: RegisterRequest) {
        const result = await registerApi(request)
        applyAuth(result)
        return result
    }
  //Hàm đăng xuất
  async function logout() {
    try {
      await logoutApi()
    } finally {
      clearAuth()
    }
  }

  //Tạo context value
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken: accessTokenValue,
      isAuthenticated: !!user && !!accessTokenValue,
      isBootstrapping,
      login,
      register,
      logout,
    }),
    [user, accessTokenValue, isBootstrapping],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

