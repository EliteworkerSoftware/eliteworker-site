import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import AdminLogoutButton from "@/components/AdminLogoutButton";
import type { AdminUser } from "@/lib/currentAdmin";

export function Topbar({ admin, title }: { admin: AdminUser; title: string }) {
  return (
    <div className="flex flex-col items-start gap-3 border-b border-line bg-paper px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div>
        <h1 className="text-xl font-semibold text-ink">{title}</h1>
        <p className="mt-0.5 text-xs text-ink/50">
          Signed in as {admin.full_name || admin.email} · <span className="capitalize">{admin.role}</span>
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/admin/security"
          className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink/70 transition hover:border-ink/25 hover:text-ink"
        >
          <ShieldCheck size={14} />
          Security
        </Link>
        <AdminLogoutButton />
      </div>
    </div>
  );
}
