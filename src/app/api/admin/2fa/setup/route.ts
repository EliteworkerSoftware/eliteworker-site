import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { getCurrentAdmin } from "@/lib/currentAdmin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { generateTotpSecret, buildOtpauthUrl } from "@/lib/totp";

// Generates a new secret and stores it, but doesn't enable 2FA yet — that
// only happens once /confirm proves the admin actually scanned it and can
// produce a valid code, so a half-finished setup can never lock anyone out.
export async function POST() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const secret = generateTotpSecret();
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("eliteworker_admin_users")
    .update({ totp_secret: secret, totp_enabled: false })
    .eq("id", admin.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const otpauthUrl = buildOtpauthUrl(secret, admin.email);
  const qrDataUrl = await QRCode.toDataURL(otpauthUrl);

  return NextResponse.json({ ok: true, secret, otpauthUrl, qrDataUrl });
}
