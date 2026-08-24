import { TOTP, Secret } from "otpauth";

// Standard 6-digit, 30-second TOTP — this is what Apple's Passwords app,
// Google Authenticator, Authy, and 1Password all implement, so any of them
// (and the "rolling code" in Apple's Passwords app specifically) can scan
// the same QR code and generate valid codes.
const ISSUER = "EliteWorker Admin";

export function generateTotpSecret(): string {
  return new Secret({ size: 20 }).base32;
}

function buildTotp(secretBase32: string, accountLabel: string): TOTP {
  return new TOTP({
    issuer: ISSUER,
    label: accountLabel,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: Secret.fromBase32(secretBase32),
  });
}

export function buildOtpauthUrl(secretBase32: string, accountLabel: string): string {
  return buildTotp(secretBase32, accountLabel).toString();
}

// delta !== null means the code matched within the allowed drift window —
// a window of 1 tolerates the code changing right as someone types it in,
// without opening the door to codes from many minutes ago/ahead.
export function verifyTotpCode(secretBase32: string, code: string, accountLabel: string): boolean {
  if (!/^\d{6}$/.test(code)) return false;
  const totp = buildTotp(secretBase32, accountLabel);
  const delta = totp.validate({ token: code, window: 1 });
  return delta !== null;
}
