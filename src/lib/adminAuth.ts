import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE_NAME = "eliteworker_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
export const ADMIN_SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;

// A separate, short-lived cookie for the gap between "password verified" and
// "TOTP code verified" on a 2FA-enabled account — deliberately not the real
// session cookie, so a request with only this one can't reach anything
// behind requireAdmin.
export const ADMIN_2FA_PENDING_COOKIE_NAME = "eliteworker_admin_2fa_pending";
const PENDING_2FA_TTL_MS = 1000 * 60 * 5;
export const ADMIN_2FA_PENDING_MAX_AGE_SECONDS = PENDING_2FA_TTL_MS / 1000;

function sign(value: string) {
  const secret = process.env.ADMIN_SESSION_SECRET || "";
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function createSessionCookieValue(userId: string) {
  const payload = `${userId}.${Date.now() + SESSION_TTL_MS}`;
  return `${payload}.${sign(payload)}`;
}

// The cookie only proves *who the caller claims to be* — it deliberately does
// not carry role, so removing/demoting an admin takes effect on their very
// next request instead of waiting out a week-long stale session.
export function readSessionUserId(value: string | undefined): string | null {
  if (!value) return null;
  const parts = value.split(".");
  if (parts.length !== 3) return null;

  const [userId, expires, signature] = parts;
  const payload = `${userId}.${expires}`;
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  if (Number(expires) <= Date.now()) return null;

  return userId;
}

// Same shape as the session cookie, kept as a distinct cookie name (not just
// a shorter TTL) so it's structurally impossible for a pending-2FA cookie to
// be presented where a real session is required.
export function create2faPendingCookieValue(userId: string) {
  const payload = `${userId}.${Date.now() + PENDING_2FA_TTL_MS}`;
  return `${payload}.${sign(payload)}`;
}

export function read2faPendingUserId(value: string | undefined): string | null {
  if (!value) return null;
  const parts = value.split(".");
  if (parts.length !== 3) return null;

  const [userId, expires, signature] = parts;
  const payload = `${userId}.${expires}`;
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  if (Number(expires) <= Date.now()) return null;

  return userId;
}
