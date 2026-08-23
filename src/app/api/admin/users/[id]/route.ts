import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/currentAdmin";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin || admin.role !== "owner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { fullName } = await req.json();
  if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
    return NextResponse.json({ error: "Full name is required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("eliteworker_admin_users")
    .update({ full_name: fullName.trim() })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin || admin.role !== "owner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  if (id === admin.id) {
    return NextResponse.json({ error: "You can't remove your own account" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // Never allow removing the last owner — that would lock everyone out of
  // user management with no way back in short of a direct DB edit.
  const { data: target } = await supabase.from("eliteworker_admin_users").select("role").eq("id", id).single();
  if (target?.role === "owner") {
    const { count } = await supabase
      .from("eliteworker_admin_users")
      .select("id", { count: "exact", head: true })
      .eq("role", "owner");
    if ((count ?? 0) <= 1) {
      return NextResponse.json({ error: "Can't remove the last owner" }, { status: 400 });
    }
  }

  const { error } = await supabase.from("eliteworker_admin_users").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
