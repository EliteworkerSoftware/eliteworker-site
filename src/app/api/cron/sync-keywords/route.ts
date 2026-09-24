import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isSupabaseConfigured } from "@/lib/analytics";
import { isSearchConsoleConfigured, querySearchAnalytics } from "@/lib/search-console";
import { computePriority } from "@/lib/keyword-priority";
import { enrichSearchVolumes } from "@/lib/keyword-volume";
import { KEYWORDS_TABLE } from "@/lib/keywords";

// Minimum impressions in the trailing 30 days for a query to be worth
// tracking — filters one-off noise instead of cluttering the list.
const MIN_IMPRESSIONS = 3;

function isoDayNDaysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

// Daily (see vercel.json): every real query Search Console saw eliteworker.com
// appear for becomes a tracked keyword. New ones arrive as "discovered" and
// unseen (the green "New" badge); existing ones get fresh stats but keep
// their status and priority. Then looks up search volumes (budget-capped).
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured() || !isSearchConsoleConfigured()) {
    return NextResponse.json({ ok: true, synced: 0, skipped: "not configured" });
  }

  const supabase = getSupabaseAdmin();
  const rows = await querySearchAnalytics({
    startDate: isoDayNDaysAgo(30),
    endDate: isoDayNDaysAgo(3),
    dimensions: ["query"],
    rowLimit: 5000,
  });
  const qualifying = rows.filter((r) => r.impressions >= MIN_IMPRESSIONS);

  const { data: existing } = await supabase.from(KEYWORDS_TABLE).select("keyword");
  const existingKeywords = new Set((existing ?? []).map((r) => r.keyword));

  let inserted = 0;
  let updated = 0;
  for (const r of qualifying) {
    const keyword = r.keys[0];
    const stats = {
      last_impressions: r.impressions,
      last_clicks: r.clicks,
      last_position: r.position,
      last_synced_at: new Date().toISOString(),
      notes: `Auto: ${r.impressions} impressions, position #${r.position.toFixed(1)}, ${r.clicks} clicks (Search Console, last 30 days)`,
    };

    if (existingKeywords.has(keyword)) {
      await supabase.from(KEYWORDS_TABLE).update(stats).eq("keyword", keyword);
      updated++;
    } else {
      await supabase.from(KEYWORDS_TABLE).insert({
        keyword,
        priority: computePriority(r.impressions, r.position),
        source: "search_console",
        status: "discovered",
        ...stats,
      });
      inserted++;
    }
  }

  // After the sync so keywords just inserted get their volume in the same
  // pass. Budget-capped inside; a failure here doesn't fail the sync.
  const volume = await enrichSearchVolumes(supabase).catch((err) => ({ error: String(err) }));

  return NextResponse.json({ ok: true, scanned: rows.length, qualifying: qualifying.length, inserted, updated, volume });
}
