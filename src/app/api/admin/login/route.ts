import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  createSessionCookieValue,
  ADMIN_2FA_PENDING_COOKIE_NAME,
  ADMIN_2FA_PENDING_MAX_AGE_SECONDS,
  create2faPendingCookieValue,
} from "@/lib/adminAuth";
import { verifyPassword } from "@/lib/adminPassword";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: user, error } = await supabase
    .from("eliteworker_admin_users")
    .select("id, password_hash")
    .eq("email", String(email).toLowerCase().trim())
    .single();

  if (error || !user || !verifyPassword(password, user.password_hash)) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  // Queried separately, and treated as "2FA not enabled" on any error —
  // before the 2FA migration is run, this column doesn't exist yet, and a
  // missing column here should never be able to block an otherwise-correct
  // login.
  const { data: totpRow } = await supabase.from("eliteworker_admin_users").select("totp_enabled").eq("id", user.id).maybeSingle();
  const totpEnabled = totpRow?.totp_enabled === true;

  // Password alone isn't a completed login when 2FA is on for this account —
  // issue only the short-lived pending cookie and make the client collect a
  // TOTP code next. last_login_at (and the real session) only get set once
  // that second step succeeds.
  if (totpEnabled) {
    const res = NextResponse.json({ ok: true, requires2fa: true });
    res.cookies.set(ADMIN_2FA_PENDING_COOKIE_NAME, create2faPendingCookieValue(user.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_2FA_PENDING_MAX_AGE_SECONDS,
    });
    return res;
  }

  // Best-effort — a failed write here shouldn't block the actual login.
  await supabase.from("eliteworker_admin_users").update({ last_login_at: new Date().toISOString() }).eq("id", user.id);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, createSessionCookieValue(user.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  });
  return res;
}
