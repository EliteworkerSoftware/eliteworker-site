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
  const { data } = await supabase
    .from("eliteworker_admin_users")
    .select("id, email, full_name, role, created_at")
    .order("created_at", { ascending: true });

  return (
    <div>
      <Topbar admin={admin} title="Admin users" />
      <div className="p-5 sm:p-8">
        <AdminUsersManager initialUsers={data ?? []} currentUserId={admin.id} />
      </div>
    </div>
  );
}
