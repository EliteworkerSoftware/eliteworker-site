import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/currentAdmin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { verifyTotpCode } from "@/lib/totp";

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { code } = await req.json();
  if (typeof code !== "string") {
    return NextResponse.json({ error: "Enter your 6-digit code" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: user, error: fetchError } = await supabase
    .from("eliteworker_admin_users")
    .select("totp_secret")
    .eq("id", admin.id)
    .single();

  if (fetchError || !user?.totp_secret) {
    return NextResponse.json({ error: "Start setup again — no code was generated" }, { status: 400 });
  }
  if (!verifyTotpCode(user.totp_secret, code, admin.email)) {
    return NextResponse.json({ error: "That code didn't match — try the current code from your app" }, { status: 401 });
  }

  const { error } = await supabase.from("eliteworker_admin_users").update({ totp_enabled: true }).eq("id", admin.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
