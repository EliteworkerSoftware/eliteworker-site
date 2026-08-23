import { getCurrentAdmin } from "@/lib/currentAdmin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { fetchRepliesGroupedByTable } from "@/lib/adminReply";
import { Topbar } from "@/components/admin/Topbar";
import { LeadsTable, type Lead } from "./LeadsTable";

export default async function LeadsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) return null;

  const supabase = getSupabaseAdmin();
  // Both queries are independent — run them together instead of one after
  // the other, since each round-trip only adds latency to a page that
  // already has to wait on the admin auth check first.
  const [{ data, error }, repliesByLead] = await Promise.all([
    supabase.from("eliteworker_leads").select("*").order("created_at", { ascending: false }),
    fetchRepliesGroupedByTable("eliteworker_leads"),
  ]);

  const leads = (data as Omit<Lead, "replies">[]) || [];
  const rows: Lead[] = leads.map((lead) => ({ ...lead, replies: repliesByLead[lead.id] || [] }));

  return (
    <div>
      <Topbar admin={admin} title="Contact leads" />
      <div className="p-5 sm:p-8">
        {error && <p className="mb-4 text-sm text-red-500">Failed to load: {error.message}</p>}
        <LeadsTable initialRows={rows} canDelete={admin.role === "owner"} />
      </div>
    </div>
  );
}
