import { createHmac, timingSafeEqual } from "crypto";

// Falls back to ADMIN_SESSION_SECRET so this works with zero extra setup —
// set a dedicated DEMO_CONFIRM_SECRET if you'd rather not reuse it.
function secret(): string {
  return process.env.DEMO_CONFIRM_SECRET || process.env.ADMIN_SESSION_SECRET || "";
}

// Unauthenticated, so the token itself is what proves this click is
// legitimate — signed rather than just a raw booking id in the URL.
export function createConfirmToken(bookingId: string): string {
  const signature = createHmac("sha256", secret()).update(bookingId).digest("hex");
  return `${bookingId}.${signature}`;
}

export function verifyConfirmToken(token: string): string | null {
  const [bookingId, signature] = token.split(".");
  if (!bookingId || !signature) return null;

  const expected = createHmac("sha256", secret()).update(bookingId).digest("hex");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return bookingId;
}

export type BookingAction = "cancel" | "reschedule";

// Same HMAC-over-string approach as createConfirmToken/verifyConfirmToken,
// with the action folded into the signed payload so a cancel link can't be
// replayed as a reschedule link (or vice versa) — one secret, two
// non-interchangeable link types.
export function createBookingActionToken(bookingId: string, action: BookingAction): string {
  const payload = `${bookingId}.${action}`;
  const signature = createHmac("sha256", secret()).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

export function verifyBookingActionToken(token: string, expectedAction: BookingAction): string | null {
  const [bookingId, action, signature] = token.split(".");
  if (!bookingId || !action || !signature || action !== expectedAction) return null;

  const payload = `${bookingId}.${action}`;
  const expected = createHmac("sha256", secret()).update(payload).digest("hex");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return bookingId;
}
