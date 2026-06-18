import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/features/auth/hooks/useAuth"

export function DashboardPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  async function handleLogout() {
    await logout()
    navigate("/login", { replace: true })
  }

  return (
    <main className="min-h-screen bg-neutral-50 p-6">
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>BadmintonStores</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Xin chào</div>
              <div className="text-xl font-semibold">
                {user?.fullName || user?.email}
              </div>
            </div>

            <div className="grid gap-3 rounded-lg border bg-white p-4 text-sm sm:grid-cols-2">
              <div>
                <div className="text-muted-foreground">Email</div>
                <div className="font-medium">{user?.email}</div>
              </div>

              <div>
                <div className="text-muted-foreground">Role</div>
                <div className="font-medium">{user?.role}</div>
              </div>

              <div>
                <div className="text-muted-foreground">Status</div>
                <div className="font-medium">{user?.status}</div>
              </div>

              <div>
                <div className="text-muted-foreground">CustomerId</div>
                <div className="font-medium">{user?.customerId ?? "-"}</div>
              </div>
            </div>

            <Button variant="outline" onClick={handleLogout}>
              Đăng xuất
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}