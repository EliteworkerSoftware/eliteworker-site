import { getSupabaseAdmin } from "./supabase";
import { sendReplyEmail } from "./sendReplyEmail";
import type { TriageTable } from "./adminTriage";
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

export async function fetchRepliesByIds(table: TriageTable, ids: string[]): Promise<Record<string, Reply[]>> {
  if (ids.length === 0) return {};
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("eliteworker_replies")
    .select("*")
    .eq("source_table", table)
    .in("source_id", ids)
    .order("created_at", { ascending: true });

  const grouped: Record<string, Reply[]> = {};
  for (const reply of (data as Reply[]) || []) {
    (grouped[reply.source_id] ??= []).push(reply);
  }
  return grouped;
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
}): Promise<{ data: Reply } | { error: string; status: number }> {
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
  return { data: reply as Reply };
}
