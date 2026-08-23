import { useAuth } from "@/features/auth/hooks/useAuth";

export function AccountPage() {
  const { user } = useAuth();

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Tài khoản của tôi</h1>

      <div className="mt-6 rounded-lg border bg-white p-6">
        <p className="text-sm text-muted-foreground">Email</p>
        <p className="mt-1 font-medium">{user?.email}</p>

        <p className="mt-4 text-sm text-muted-foreground">Vai trò</p>
        <p className="mt-1 font-medium">{user?.role}</p>
      </div>
    </section>
  );
}