import { getCurrentAdmin } from "@/lib/currentAdmin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { Topbar } from "@/components/admin/Topbar";
import { LeadsTable, type Lead, type LeadReply } from "./LeadsTable";

export default async function LeadsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) return null;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("eliteworker_leads")
    .select("*")
    .order("created_at", { ascending: false });

  const leads = (data as Omit<Lead, "replies">[]) || [];
  const leadIds = leads.map((lead) => lead.id);
  const { data: repliesData } =
    leadIds.length > 0
      ? await supabase
          .from("eliteworker_lead_replies")
          .select("*")
          .in("lead_id", leadIds)
          .order("created_at", { ascending: true })
      : { data: [] as LeadReply[] };

  const repliesByLead = new Map<string, LeadReply[]>();
  for (const reply of (repliesData as LeadReply[]) || []) {
    const existing = repliesByLead.get(reply.lead_id);
    if (existing) existing.push(reply);
    else repliesByLead.set(reply.lead_id, [reply]);
  }
  const rows: Lead[] = leads.map((lead) => ({ ...lead, replies: repliesByLead.get(lead.id) || [] }));

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
