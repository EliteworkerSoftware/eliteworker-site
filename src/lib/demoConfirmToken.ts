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
