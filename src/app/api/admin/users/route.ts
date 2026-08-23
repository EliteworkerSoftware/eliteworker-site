import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/currentAdmin";
import { hashPassword, generateTempPassword } from "@/lib/adminPassword";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendInviteEmail } from "@/lib/adminInvite";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin || admin.role !== "owner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("eliteworker_admin_users")
    .select("id, email, full_name, role, created_at")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ users: data });
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin || admin.role !== "owner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { email, fullName, role } = await req.json();
  if (!email || !fullName || (role !== "owner" && role !== "viewer")) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  const tempPassword = generateTempPassword();
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("eliteworker_admin_users").insert({
    email: String(email).toLowerCase().trim(),
    full_name: String(fullName).trim(),
    password_hash: hashPassword(tempPassword),
    role,
  });

  if (error) {
    const message = error.code === "23505" ? "An admin with that email already exists" : error.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // The DB write is authoritative and already succeeded — a Mailgun hiccup
  // shouldn't turn into a 500 for an account that now exists but has no way
  // to know its own password, so this failure is reported, not thrown.
  let emailSent = true;
  try {
    await sendInviteEmail({
      to: String(email).toLowerCase().trim(),
      fullName: String(fullName).trim(),
      role,
      tempPassword,
      subject: "You've been added to EliteWorker admin",
    });
  } catch (err) {
    console.error("Admin invite email error:", err);
    emailSent = false;
  }

  return NextResponse.json({ ok: true, tempPassword, emailSent });
}
