import { getSupabaseAdmin } from "./supabase";
import { sendReplyEmail } from "./sendReplyEmail";
import type { TriageTable, AnyStatus } from "./adminTriage";
import type { AdminUser } from "./currentAdmin";

export type Reply = {
  id: string;
  created_at: string;
  source_table: TriageTable;
  source_id: string;
  admin_id: string;
  admin_name: string | null;
  message: string;
};

// Column names for the recipient's name/email differ per table (see each
// table's row type) — this is the one place that has to know that.
const RECIPIENT_COLUMNS: Record<TriageTable, { name: string; email: string }> = {
  eliteworker_leads: { name: "name", email: "email" },
  eliteworker_beta_signups: { name: "contact_name", email: "contact_email" },
  eliteworker_demo_bookings: { name: "attendee_name", email: "attendee_email" },
};

// Deliberately doesn't take a list of row ids to filter by — that would
// require the page to await the main rows query first, then this one,
// turning one page load into two sequential round-trips. Fetching by table
// alone lets the page run this in Promise.all alongside the main query
// instead, and a handful of orphaned replies for a since-deleted row (there's
// no FK/cascade across the three source tables) cost nothing since they
// simply won't match any row when grouped.
export async function fetchRepliesGroupedByTable(table: TriageTable): Promise<Record<string, Reply[]>> {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("eliteworker_replies")
    .select("*")
    .eq("source_table", table)
    .order("created_at", { ascending: true });

  const grouped: Record<string, Reply[]> = {};
  for (const reply of (data as Reply[]) || []) {
    (grouped[reply.source_id] ??= []).push(reply);
  }
  return grouped;
}

// Table-specific side effects of sending a reply, beyond the email + reply
// row every table gets. Leads auto-advance from "new" to "contacted" — you
// just contacted them, so the status should say so without an extra click.
async function applyReplySideEffects(table: TriageTable, id: string): Promise<AnyStatus | undefined> {
  if (table !== "eliteworker_leads") return undefined;
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from(table)
    .update({ pipeline_status: "contacted" })
    .eq("id", id)
    .eq("pipeline_status", "new")
    .select("pipeline_status")
    .maybeSingle();
  return (data?.pipeline_status as AnyStatus) || undefined;
}

export async function sendAdminReply({
  table,
  id,
  admin,
  message,
}: {
  table: TriageTable;
  id: string;
  admin: AdminUser;
  message: string;
}): Promise<{ data: Reply; newStatus?: AnyStatus } | { error: string; status: number }> {
  const supabase = getSupabaseAdmin();
  const columns = RECIPIENT_COLUMNS[table];
  const { data: row, error: rowError } = await supabase
    .from(table)
    .select(`${columns.name}, ${columns.email}`)
    .eq("id", id)
    .single<Record<string, string | null>>();

  if (rowError || !row) return { error: "Not found", status: 404 };

  const to = row[columns.email];
  const name = row[columns.name] || "there";
  if (!to) return { error: "No email address on file for this entry", status: 400 };

  try {
    await sendReplyEmail({ to, name, message });
  } catch (err) {
    console.error("Admin reply email error:", err);
    return { error: "Failed to send email", status: 500 };
  }

  const { data: reply, error: insertError } = await supabase
    .from("eliteworker_replies")
    .insert({
      source_table: table,
      source_id: id,
      admin_id: admin.id,
      admin_name: admin.full_name || admin.email,
      message,
    })
    .select()
    .single();

  if (insertError) return { error: insertError.message, status: 500 };

  const newStatus = await applyReplySideEffects(table, id);
  return { data: reply as Reply, newStatus };
}
