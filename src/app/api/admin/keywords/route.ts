import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/currentAdmin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { KEYWORDS_TABLE } from "@/lib/keywords";

const PRIORITY_RANK: Record<string, number> = { high: 0, medium: 1, low: 2 };
const STATUS_RANK: Record<string, number> = { queued: 0, in_review: 0, discovered: 1, done: 2 };

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data, error } = await getSupabaseAdmin()
    .from(KEYWORDS_TABLE)
    .select(
      "id, keyword, target_url, priority, notes, source, status, last_impressions, last_clicks, last_position, last_synced_at, content_url, queued_at, content_published_at, created_at, seen_at, search_volume"
    );

  if (error) {
    const missing = error.message.includes(KEYWORDS_TABLE);
    return NextResponse.json(
      { error: missing ? "The keyword table hasn't been created yet — run the SQL from the README." : error.message },
      { status: 500 }
    );
  }

  // Work in progress first, then unseen discoveries, then by priority, then
  // by real demand (impressions).
  const keywords = [...data].sort((a, b) => {
    const statusDiff = (STATUS_RANK[a.status] ?? 1) - (STATUS_RANK[b.status] ?? 1);
    if (statusDiff !== 0) return statusDiff;
    const seenDiff = Number(!!a.seen_at) - Number(!!b.seen_at);
    if (seenDiff !== 0) return seenDiff;
    const priorityDiff = (PRIORITY_RANK[a.priority] ?? 1) - (PRIORITY_RANK[b.priority] ?? 1);
    if (priorityDiff !== 0) return priorityDiff;
    return (b.last_impressions ?? 0) - (a.last_impressions ?? 0);
  });

  return NextResponse.json({ keywords });
}

// Manual add — the list mostly fills itself from the daily Search Console sync.
export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { keyword, target_url } = await req.json().catch(() => ({}));
  if (typeof keyword !== "string" || !keyword.trim()) {
    return NextResponse.json({ error: "Keyword is required" }, { status: 400 });
  }

  const { error } = await getSupabaseAdmin()
    .from(KEYWORDS_TABLE)
    .insert({
      keyword: keyword.trim().toLowerCase(),
      target_url: typeof target_url === "string" && target_url.trim() ? target_url.trim() : null,
      priority: "medium",
      source: "manual",
      status: "discovered",
      // You typed it in yourself, so it's already been seen.
      seen_at: new Date().toISOString(),
    });

  if (error) {
    const message = error.code === "23505" ? "That keyword is already being tracked" : error.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
