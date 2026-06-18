import { createBrowserRouter, Navigate } from "react-router-dom";
import { LoginPage } from "@/features/auth/pages/LoginPage"
import { RegisterPage } from "@/features/auth/pages/RegisterPage"
import { ProtectedRoute } from "@/app/ProtectRoute"
import { DashboardPage } from "@/features/auth/pages/DashboardPage"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to={"/login"} replace />
    },
    {
        path: "/login",
        element: <LoginPage />
    },
    {
        path: "/register",
        element: <RegisterPage />
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "/dashboard",
                element: <DashboardPage />
            },
        ],
    },
]) 