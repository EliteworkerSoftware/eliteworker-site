import { getSupabaseAdmin } from "@/lib/supabase";

export const PIPELINE_STATUSES = ["new", "contacted", "converted", "archived"] as const;
export type PipelineStatus = (typeof PIPELINE_STATUSES)[number];

export type TriageTable = "eliteworker_leads" | "eliteworker_beta_signups" | "eliteworker_demo_bookings";

type TriageResult<T> = { data: T } | { error: string; status: number };

// Shared by the leads/beta/bookings [id] routes so each stays a thin
// auth-check-then-delegate wrapper instead of repeating the same
// validation/update logic three times.
export async function patchTriageFields(
  table: TriageTable,
  id: string,
  body: { is_read?: unknown; pipeline_status?: unknown }
): Promise<TriageResult<Record<string, unknown>>> {
  const patch: Record<string, unknown> = {};
  if (typeof body.is_read === "boolean") patch.is_read = body.is_read;
  if (typeof body.pipeline_status === "string") {
    if (!PIPELINE_STATUSES.includes(body.pipeline_status as PipelineStatus)) {
      return { error: "Invalid pipeline_status", status: 400 };
    }
    patch.pipeline_status = body.pipeline_status;
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
