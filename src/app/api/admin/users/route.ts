import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/currentAdmin";
import { hashPassword } from "@/lib/adminPassword";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin || admin.role !== "owner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("eliteworker_admin_users")
    .select("id, email, role, created_at")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ users: data });
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin || admin.role !== "owner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { email, password, role } = await req.json();
  if (!email || !password || (role !== "owner" && role !== "viewer")) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }
  if (String(password).length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("eliteworker_admin_users").insert({
    email: String(email).toLowerCase().trim(),
    password_hash: hashPassword(password),
    role,
  });

  if (error) {
    const message = error.code === "23505" ? "An admin with that email already exists" : error.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
