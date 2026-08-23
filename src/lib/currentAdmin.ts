import { cache } from "react";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, readSessionUserId } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabase";

export type AdminRole = "owner" | "viewer";
export type AdminUser = { id: string; email: string; role: AdminRole; full_name: string | null };

// cache() dedupes this within a single request's render tree (e.g. the
// (dashboard) layout and its page both call it) — it does not persist across
// separate requests, so a role change still takes effect on the next request.
export const getCurrentAdmin = cache(async (): Promise<AdminUser | null> => {
  const cookieStore = await cookies();
  const userId = readSessionUserId(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
  if (!userId) return null;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("eliteworker_admin_users")
    .select("id, email, role, full_name")
    .eq("id", userId)
    .single();

  if (error || !data) return null;
  return data as AdminUser;
});
