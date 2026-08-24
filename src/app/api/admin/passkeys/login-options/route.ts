import { NextResponse } from "next/server";
import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { getRpID } from "@/lib/webauthn";
import { WEBAUTHN_CHALLENGE_COOKIE_NAME, WEBAUTHN_CHALLENGE_MAX_AGE_SECONDS, createChallengeCookieValue } from "@/lib/adminAuth";

// No auth check here — this runs before anyone's identified. Leaving
// allowCredentials empty is what makes it "usernameless": the browser shows
// whichever EliteWorker passkeys already exist on the device, and the
// server figures out who that credential belongs to once it comes back.
export async function POST() {
  const options = await generateAuthenticationOptions({
    rpID: getRpID(),
    userVerification: "preferred",
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
