import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/currentAdmin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { verifyPassword } from "@/lib/adminPassword";

// Requires re-entering the password — turning off 2FA is the one action
// where a hijacked, already-logged-in browser tab shouldn't be enough on
// its own.
export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { password } = await req.json();
  if (typeof password !== "string") {
    return NextResponse.json({ error: "Enter your password" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: user, error: fetchError } = await supabase
    .from("eliteworker_admin_users")
    .select("password_hash")
    .eq("id", admin.id)
    .single();

  if (fetchError || !user || !verifyPassword(password, user.password_hash)) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const { error } = await supabase
    .from("eliteworker_admin_users")
    .update({ totp_enabled: false, totp_secret: null })
    .eq("id", admin.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
