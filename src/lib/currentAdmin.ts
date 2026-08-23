import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, readSessionUserId } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabase";

export type AdminRole = "owner" | "viewer";
export type AdminUser = { id: string; email: string; role: AdminRole };

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const userId = readSessionUserId(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
  if (!userId) return null;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("eliteworker_admin_users")
    .select("id, email, role")
    .eq("id", userId)
    .single();

  if (error || !data) return null;
  return data as AdminUser;
}
