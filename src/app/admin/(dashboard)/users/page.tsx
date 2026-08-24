import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/currentAdmin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { Topbar } from "@/components/admin/Topbar";
import AdminUsersManager from "@/components/AdminUsersManager";

export default async function UsersPage() {
  const admin = await getCurrentAdmin();
  if (!admin) return null;
  if (admin.role !== "owner") {
    redirect("/admin");
  }

  const supabase = getSupabaseAdmin();
  // Falls back to a query without last_login_at if that column doesn't
  // exist yet (before the migration runs) — the whole list disappearing
  // is a much worse failure than just not knowing who's logged in yet.
  const initial = await supabase
    .from("eliteworker_admin_users")
    .select("id, email, full_name, role, created_at, last_login_at")
    .order("created_at", { ascending: true });
  let data = initial.data;

  if (initial.error) {
    const fallback = await supabase
      .from("eliteworker_admin_users")
      .select("id, email, full_name, role, created_at")
      .order("created_at", { ascending: true });
    data = fallback.data?.map((row) => ({ ...row, last_login_at: null })) ?? null;
  }

  return (
    <div>
      <Topbar admin={admin} title="Admin users" />
      <div className="p-5 sm:p-8">
        <AdminUsersManager initialUsers={data ?? []} currentUserId={admin.id} />
      </div>
    </div>
  );
}
