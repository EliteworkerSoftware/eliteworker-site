import { getSupabaseAdmin } from "@/lib/supabase";

// Each resource has its own status vocabulary — a lead's journey isn't a
// beta applicant's or a demo booking's — so the allowed values (and their
// order, which drives filter/select ordering) live per table here instead
// of one shared enum.
export const STATUS_OPTIONS = {
  eliteworker_leads: ["new", "contacted", "booked_demo", "archived"],
  eliteworker_beta_signups: ["new", "approved", "declined", "archived"],
  eliteworker_demo_bookings: ["confirm_1", "confirm_2", "converted", "archived"],
} as const;

export type TriageTable = keyof typeof STATUS_OPTIONS;
export type StatusOf<T extends TriageTable> = (typeof STATUS_OPTIONS)[T][number];
export type AnyStatus = StatusOf<TriageTable>;

type TriageResult<T> = { data: T } | { error: string; status: number };

// Shared by the leads/beta/bookings [id] routes so each stays a thin
// auth-check-then-delegate wrapper instead of repeating the same
// validation/update logic three times.
export async function patchTriageFields(
  table: TriageTable,
  id: string,
  body: { is_read?: unknown; pipeline_status?: unknown; decline_reason?: unknown }
): Promise<TriageResult<Record<string, unknown>>> {
  const patch: Record<string, unknown> = {};
  if (typeof body.is_read === "boolean") patch.is_read = body.is_read;
  if (typeof body.pipeline_status === "string") {
    const allowed: readonly string[] = STATUS_OPTIONS[table];
    if (!allowed.includes(body.pipeline_status)) {
      return { error: "Invalid status", status: 400 };
    }
    patch.pipeline_status = body.pipeline_status;
  }
  // Only beta applications carry a decline reason — the column only exists
  // on that table, so this only ever applies there in practice.
  if (table === "eliteworker_beta_signups" && (typeof body.decline_reason === "string" || body.decline_reason === null)) {
    patch.decline_reason = body.decline_reason;
  }
  if (Object.keys(patch).length === 0) {
    return { error: "No valid fields to update", status: 400 };
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from(table).update(patch).eq("id", id).select().single();
  if (error) return { error: error.message, status: 500 };
  return { data };
}

export async function deleteTriageRow(table: TriageTable, id: string): Promise<{ ok: true } | { error: string; status: number }> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) return { error: error.message, status: 500 };
  return { ok: true };
}
