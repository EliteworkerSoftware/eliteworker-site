import { getCurrentAdmin } from "@/lib/currentAdmin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { fetchRepliesByIds } from "@/lib/adminReply";
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

  const signups = (data as Omit<BetaSignup, "replies">[]) || [];
  const repliesById = await fetchRepliesByIds(
    "eliteworker_beta_signups",
    signups.map((signup) => signup.id)
  );
  const rows: BetaSignup[] = signups.map((signup) => ({ ...signup, replies: repliesById[signup.id] || [] }));

  return (
    <div>
      <Topbar admin={admin} title="Beta applications" />
      <div className="p-5 sm:p-8">
        {error && <p className="mb-4 text-sm text-red-500">Failed to load: {error.message}</p>}
        <BetaSignupsTable initialRows={rows} canDelete={admin.role === "owner"} />
      </div>
    </div>
  );
}
