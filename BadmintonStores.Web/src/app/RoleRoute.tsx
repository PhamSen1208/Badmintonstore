//Chặn route theo role
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";

type RoleRouteProps = {
    allowedRoles: string[];
}
export function RoleRoute({allowedRoles}: RoleRouteProps)
{
    const {user, isAuthenticated, isBootstrapping} = useAuth();

    if(isBootstrapping)
    {
        return <div className="p-6 text-sm text-muted-foreground">Đăng kiểm tra phiên đăng nhập...</div>
    }

    if(!isAuthenticated || !user)
    {
        return <Navigate to="/login" replace/>
    }

    const normalizedRole = user.role.toLowerCase();
    
    // Cho phép route nếu role của user trùng với allowedRoles
    const canAccess = allowedRoles.some(
        (role) => role.toLowerCase() === normalizedRole 
    );

    if(!canAccess)
    {
        return <Navigate to="/unauthorized" replace/>
    }

    // Hiển thị nội dung route
    return <Outlet />
}