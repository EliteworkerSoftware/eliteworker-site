import { getCurrentAdmin } from "@/lib/currentAdmin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { fetchRepliesByIds } from "@/lib/adminReply";
import { Topbar } from "@/components/admin/Topbar";
import { LeadsTable, type Lead } from "./LeadsTable";

export default async function LeadsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) return null;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("eliteworker_leads")
    .select("*")
    .order("created_at", { ascending: false });

  const leads = (data as Omit<Lead, "replies">[]) || [];
  const repliesByLead = await fetchRepliesByIds(
    "eliteworker_leads",
    leads.map((lead) => lead.id)
  );
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
