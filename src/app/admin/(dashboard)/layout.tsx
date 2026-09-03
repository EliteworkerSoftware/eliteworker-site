import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/currentAdmin";
import { Sidebar } from "@/components/admin/Sidebar";
import { AdminProfileMenu } from "@/components/admin/AdminProfileMenu";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-paper-alt md:flex-row">
      <Sidebar admin={admin} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {/* Desktop only — on mobile the account menu already lives in the
            sidebar's top logo strip, so this stays hidden there. */}
        <div className="hidden shrink-0 justify-end border-b border-line bg-paper px-8 py-3 md:flex">
          <AdminProfileMenu admin={admin} />
        </div>
        {/* Bottom padding clears the fixed mobile tab bar so the last bit of
            content isn't hidden behind it — not needed at md+, where nav is
            the sidebar column instead. */}
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto pb-20 md:pb-0">{children}</main>
      </div>
    </div>
  );
}
