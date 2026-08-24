import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  createSessionCookieValue,
  ADMIN_2FA_PENDING_COOKIE_NAME,
  read2faPendingUserId,
} from "@/lib/adminAuth";
import { verifyTotpCode } from "@/lib/totp";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { code } = await req.json();
  const userId = read2faPendingUserId(req.cookies.get(ADMIN_2FA_PENDING_COOKIE_NAME)?.value);
  if (!userId) {
    return NextResponse.json({ error: "Your session expired — please sign in again" }, { status: 401 });
  }
  if (typeof code !== "string") {
    return NextResponse.json({ error: "Enter your 6-digit code" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: user, error } = await supabase
    .from("eliteworker_admin_users")
    .select("id, email, totp_secret, totp_enabled")
    .eq("id", userId)
    .single();

  if (error || !user || !user.totp_enabled || !user.totp_secret || !verifyTotpCode(user.totp_secret, code, user.email)) {
    return NextResponse.json({ error: "Invalid code" }, { status: 401 });
  }

  await supabase.from("eliteworker_admin_users").update({ last_login_at: new Date().toISOString() }).eq("id", user.id);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, createSessionCookieValue(user.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  });
  res.cookies.delete(ADMIN_2FA_PENDING_COOKIE_NAME);
  return res;
}
