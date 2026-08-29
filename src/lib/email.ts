// Shared by every route that accepts a free-typed email address, so the
// format rule can't drift between them the way two separate regexes would.
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && value.length <= 320 && EMAIL_RE.test(value);
}
