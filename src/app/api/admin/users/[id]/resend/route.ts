import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/currentAdmin";
import { hashPassword, generateTempPassword } from "@/lib/adminPassword";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendInviteEmail } from "@/lib/adminInvite";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin || admin.role !== "owner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { data: target, error: fetchError } = await supabase
    .from("eliteworker_admin_users")
    .select("email, full_name, role")
    .eq("id", id)
    .single();

  if (fetchError || !target) {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }

  const tempPassword = generateTempPassword();
  const { error: updateError } = await supabase
    .from("eliteworker_admin_users")
    .update({ password_hash: hashPassword(tempPassword) })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  let emailSent = true;
  try {
    await sendInviteEmail({
      to: target.email,
      fullName: target.full_name || target.email,
      role: target.role,
      tempPassword,
      subject: "Your new EliteWorker admin password",
    });
  } catch (err) {
    console.error("Admin resend invite email error:", err);
    emailSent = false;
  }

  return NextResponse.json({ ok: true, tempPassword, emailSent });
}
