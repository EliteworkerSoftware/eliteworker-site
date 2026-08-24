import { NextRequest, NextResponse } from "next/server";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { getCurrentAdmin } from "@/lib/currentAdmin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getRpID, getOrigin } from "@/lib/webauthn";
import { WEBAUTHN_CHALLENGE_COOKIE_NAME, readChallengeCookieValue } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const challenge = readChallengeCookieValue(req.cookies.get(WEBAUTHN_CHALLENGE_COOKIE_NAME)?.value);
  if (!challenge) {
    return NextResponse.json({ error: "Setup expired — try adding the passkey again" }, { status: 400 });
  }

  const { response, deviceName } = await req.json();

  let verification;
  try {
    verification = await verifyRegistrationResponse({
      response,
      expectedChallenge: challenge,
      expectedOrigin: getOrigin(),
      expectedRPID: getRpID(),
    });
  } catch (err) {
    console.error("Passkey registration verify error:", err);
    return NextResponse.json({ error: "Couldn't verify that passkey" }, { status: 400 });
  }

  if (!verification.verified || !verification.registrationInfo) {
    return NextResponse.json({ error: "Couldn't verify that passkey" }, { status: 400 });
  }

  const { credential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("eliteworker_admin_passkeys").insert({
    admin_id: admin.id,
    credential_id: credential.id,
    public_key: Buffer.from(credential.publicKey).toString("base64url"),
    counter: credential.counter,
    device_type: credentialDeviceType,
    backed_up: credentialBackedUp,
    device_name: typeof deviceName === "string" && deviceName.trim() ? deviceName.trim().slice(0, 60) : null,
  });

  const res = NextResponse.json(error ? { error: error.message } : { ok: true }, { status: error ? 500 : 200 });
  res.cookies.delete(WEBAUTHN_CHALLENGE_COOKIE_NAME);
  return res;
}
