import { NextResponse } from "next/server";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { getCurrentAdmin } from "@/lib/currentAdmin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getRpID, RP_NAME } from "@/lib/webauthn";
import { WEBAUTHN_CHALLENGE_COOKIE_NAME, WEBAUTHN_CHALLENGE_MAX_AGE_SECONDS, createChallengeCookieValue } from "@/lib/adminAuth";

export async function POST() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = getSupabaseAdmin();
  const { data: existing } = await supabase.from("eliteworker_admin_passkeys").select("credential_id").eq("admin_id", admin.id);

  const options = await generateRegistrationOptions({
    rpName: RP_NAME,
    rpID: getRpID(),
    userName: admin.email,
    userDisplayName: admin.full_name || admin.email,
    attestationType: "none",
    // Stops someone registering the same device/passkey twice.
    excludeCredentials: (existing || []).map((row) => ({ id: row.credential_id })),
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "preferred",
    },
  });

  const res = NextResponse.json(options);
  res.cookies.set(WEBAUTHN_CHALLENGE_COOKIE_NAME, createChallengeCookieValue(options.challenge), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: WEBAUTHN_CHALLENGE_MAX_AGE_SECONDS,
  });
  return res;
}
