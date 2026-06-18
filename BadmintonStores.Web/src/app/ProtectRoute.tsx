import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/features/auth/hooks/useAuth"

export function ProtectedRoute() {
  const { isAuthenticated, isBootstrapping } = useAuth()

  if (isBootstrapping) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-sm text-muted-foreground">Đang kiểm tra phiên đăng nhập...</div>
      </main>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}