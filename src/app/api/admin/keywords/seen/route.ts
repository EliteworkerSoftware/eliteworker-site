import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/currentAdmin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { KEYWORDS_TABLE } from "@/lib/keywords";

// Called for the keywords actually shown on screen, so the "New" badge
// clears once they've been looked at — not just because they exist further
// down an unopened page of the list.
export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { ids } = await req.json().catch(() => ({}));
  if (!Array.isArray(ids) || ids.length === 0 || !ids.every((id) => typeof id === "string")) {
    return NextResponse.json({ error: "ids is required" }, { status: 400 });
  }

  const { error } = await getSupabaseAdmin()
    .from(KEYWORDS_TABLE)
    .update({ seen_at: new Date().toISOString() })
    .in("id", ids)
    .is("seen_at", null);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
