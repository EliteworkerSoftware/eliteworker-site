import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/currentAdmin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { KEYWORDS_TABLE } from "@/lib/keywords";

const STATUSES = ["discovered", "queued", "in_review", "done"];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { status, content_url } = await req.json().catch(() => ({}));

  const update: Record<string, string | null> = {};
  if (content_url !== undefined) update.content_url = content_url || null;
  if (status !== undefined && STATUSES.includes(status)) {
    update.status = status;
    // Stamp each stage so there's a real timeline, not just a status flip.
    if (status === "queued") update.queued_at = new Date().toISOString();
    if (status === "done" && content_url) update.content_published_at = new Date().toISOString();
  }

  const { error } = await getSupabaseAdmin().from(KEYWORDS_TABLE).update(update).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { error } = await getSupabaseAdmin().from(KEYWORDS_TABLE).delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
