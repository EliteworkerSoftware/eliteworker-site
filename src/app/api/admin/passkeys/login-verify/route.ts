import { NextRequest, NextResponse } from "next/server";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getRpID, getOrigin } from "@/lib/webauthn";
import {
  WEBAUTHN_CHALLENGE_COOKIE_NAME,
  readChallengeCookieValue,
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  createSessionCookieValue,
} from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  const challenge = readChallengeCookieValue(req.cookies.get(WEBAUTHN_CHALLENGE_COOKIE_NAME)?.value);
  if (!challenge) {
    return NextResponse.json({ error: "That took too long — try again" }, { status: 400 });
  }

  const response = await req.json();
  const credentialId: string | undefined = response?.id;
  if (!credentialId) {
    return NextResponse.json({ error: "Invalid passkey response" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: passkey, error: fetchError } = await supabase
    .from("eliteworker_admin_passkeys")
    .select("id, admin_id, credential_id, public_key, counter, device_type, backed_up")
    .eq("credential_id", credentialId)
    .maybeSingle();

  if (fetchError || !passkey) {
    return NextResponse.json({ error: "That passkey isn't registered here" }, { status: 401 });
  }

  let verification;
  try {
    verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge: challenge,
      expectedOrigin: getOrigin(),
      expectedRPID: getRpID(),
      credential: {
        id: passkey.credential_id,
        publicKey: Buffer.from(passkey.public_key, "base64url"),
        counter: passkey.counter,
      },
    });
  } catch (err) {
    console.error("Passkey login verify error:", err);
    return NextResponse.json({ error: "Couldn't verify that passkey" }, { status: 401 });
  }

  if (!verification.verified) {
    return NextResponse.json({ error: "Couldn't verify that passkey" }, { status: 401 });
  }

  await supabase
    .from("eliteworker_admin_passkeys")
    .update({ counter: verification.authenticationInfo.newCounter, last_used_at: new Date().toISOString() })
    .eq("id", passkey.id);
  await supabase.from("eliteworker_admin_users").update({ last_login_at: new Date().toISOString() }).eq("id", passkey.admin_id);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, createSessionCookieValue(passkey.admin_id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  });
  res.cookies.delete(WEBAUTHN_CHALLENGE_COOKIE_NAME);
  return res;
}
