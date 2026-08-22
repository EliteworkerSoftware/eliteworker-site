import { createHmac, randomInt, timingSafeEqual } from "crypto";

const CODE_TTL_MS = 1000 * 60 * 10; // 10 minutes to enter the code
const VERIFIED_TTL_MS = 1000 * 60 * 30; // 30 minutes to finish the form

function sign(value: string) {
  const secret = process.env.EMAIL_VERIFY_SECRET || "";
  return createHmac("sha256", secret).update(value).digest("hex");
}

function pack(payload: Record<string, unknown>) {
  const json = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${json}.${sign(json)}`;
}

function unpack(token: string): Record<string, unknown> | null {
  const [json, signature] = token.split(".");
  if (!json || !signature) return null;

  const expected = sign(json);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    return JSON.parse(Buffer.from(json, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

export function generateCode(): string {
  return String(randomInt(100000, 1000000));
}

// The code itself lives inside the signed token, not on the server, so the
// verify step needs no database — just the token the client already has.
export function createChallengeToken(email: string, code: string): string {
  return pack({ email, code, exp: Date.now() + CODE_TTL_MS });
}

export function verifyChallengeToken(token: string, submittedCode: string): string | null {
  const data = unpack(token);
  if (!data) return null;
  const { email, code, exp } = data as { email?: string; code?: string; exp?: number };
  if (!email || !code || !exp) return null;
  if (Date.now() > exp) return null;
  if (code !== submittedCode) return null;
  return email;
}

export function createVerifiedToken(email: string): string {
  return pack({ email, exp: Date.now() + VERIFIED_TTL_MS });
}

export function verifyVerifiedToken(token: string): string | null {
  const data = unpack(token);
  if (!data) return null;
  const { email, exp } = data as { email?: string; exp?: number };
  if (!email || !exp) return null;
  if (Date.now() > exp) return null;
  return email;
}
