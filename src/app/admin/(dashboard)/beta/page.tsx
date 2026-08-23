import { getCurrentAdmin } from "@/lib/currentAdmin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { Topbar } from "@/components/admin/Topbar";
import { BetaSignupsTable, type BetaSignup } from "./BetaSignupsTable";

export default async function BetaPage() {
  const admin = await getCurrentAdmin();
  if (!admin) return null;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("eliteworker_beta_signups")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <Topbar admin={admin} title="Beta applications" />
      <div className="p-5 sm:p-8">
        {error && <p className="mb-4 text-sm text-red-500">Failed to load: {error.message}</p>}
        <BetaSignupsTable initialRows={(data as BetaSignup[]) || []} canDelete={admin.role === "owner"} />
      </div>
    </div>
  );
}
