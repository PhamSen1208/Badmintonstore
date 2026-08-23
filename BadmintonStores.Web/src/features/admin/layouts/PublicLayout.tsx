import { Outlet } from "react-router-dom";
import { ClientHeader } from "@/features/client/components/ClientHeader";
import { ClientFooter } from "@/features/client/components/ClientFooter";

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <ClientHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <ClientFooter />
    </div>
  );
}