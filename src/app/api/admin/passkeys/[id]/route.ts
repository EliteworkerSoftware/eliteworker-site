import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/currentAdmin";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const supabase = getSupabaseAdmin();
  // Scoped to admin_id too — without this, knowing another admin's passkey
  // row id would be enough to delete it.
  const { error } = await supabase.from("eliteworker_admin_passkeys").delete().eq("id", id).eq("admin_id", admin.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
