export function getDefaultRouteByRole(role: string) {
    const normalizedRole = role.toLowerCase();

    if(normalizedRole == 'admin' || normalizedRole == 'staff')
    {
        return "/admin";
    }

    if(normalizedRole == 'customer')
    {
        return "/";
    }
    
    return "/";
}