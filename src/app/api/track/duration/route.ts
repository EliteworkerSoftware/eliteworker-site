import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { PAGE_VIEWS_TABLE, isProductionHost, isSupabaseConfigured } from "@/lib/analytics";

// Fired via sendBeacon when a visitor navigates away or closes the tab, to
// record how long they spent on the page already logged by /api/track.
// Capped so a laptop left open overnight doesn't skew the numbers.
const MAX_DURATION_SECONDS = 3600;

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured() || !isProductionHost(req.headers.get("host"))) {
    return NextResponse.json({ ok: true });
  }

  const body = await req.json().catch(() => null);
  const id = body?.id;
  const duration = Number(body?.duration);
  if (typeof id !== "string" || !id || !Number.isFinite(duration) || duration < 0) {
    return NextResponse.json({ error: "id and duration are required" }, { status: 400 });
  }

  try {
    await getSupabaseAdmin()
      .from(PAGE_VIEWS_TABLE)
      .update({ duration_seconds: Math.min(Math.round(duration), MAX_DURATION_SECONDS) })
      .eq("id", id);
  } catch (err) {
    console.error("Duration tracking error:", err);
  }

  return NextResponse.json({ ok: true });
}
