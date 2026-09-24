import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/currentAdmin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { PAGE_VIEWS_TABLE, isSupabaseConfigured } from "@/lib/analytics";

// Named individually (rather than one "Organic Search" bucket) so the admin
// can see which search engine sent the visit.
const SEARCH_ENGINES: { match: string; name: string }[] = [
  { match: "google.", name: "Google" },
  { match: "bing.", name: "Bing" },
  { match: "yahoo.", name: "Yahoo" },
  { match: "duckduckgo.", name: "DuckDuckGo" },
  { match: "baidu.", name: "Baidu" },
  { match: "yandex.", name: "Yandex" },
  { match: "ecosia.", name: "Ecosia" },
];
// AI answer engines send real referral traffic now — worth seeing on their own.
const AI_ASSISTANTS: { match: string; name: string }[] = [
  { match: "chatgpt.com", name: "ChatGPT" },
  { match: "openai.com", name: "ChatGPT" },
  { match: "perplexity.ai", name: "Perplexity" },
  { match: "claude.ai", name: "Claude" },
  { match: "gemini.google", name: "Gemini" },
  { match: "copilot.microsoft", name: "Copilot" },
];
const SOCIAL_SITES = ["facebook.", "instagram.", "linkedin.", "twitter.", "x.com", "tiktok.", "youtube.", "reddit."];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DISPLAY_TIMEZONE = "America/New_York";

function detectDevice(userAgent: string | null): {
  os: "Apple" | "Android" | "Windows" | "Other";
  formFactor: "Phone" | "Tablet" | "Desktop";
} {
  const ua = userAgent || "";
  if (/iPhone/i.test(ua)) return { os: "Apple", formFactor: "Phone" };
  if (/iPad/i.test(ua)) return { os: "Apple", formFactor: "Tablet" };
  if (/Android/i.test(ua)) return { os: "Android", formFactor: /Mobile/i.test(ua) ? "Phone" : "Tablet" };
  if (/Macintosh/i.test(ua)) return { os: "Apple", formFactor: "Desktop" };
  if (/Windows/i.test(ua)) return { os: "Windows", formFactor: "Desktop" };
  return { os: "Other", formFactor: "Desktop" };
}

function categorizeReferrer(referrer: string | null): string {
  if (!referrer) return "Direct";
  let host: string;
  try {
    host = new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return "Direct";
  }
  if (host === "eliteworker.com") return "Direct";
  const ai = AI_ASSISTANTS.find((s) => host.includes(s.match));
  if (ai) return ai.name;
  const searchEngine = SEARCH_ENGINES.find((s) => host.includes(s.match));
  if (searchEngine) return searchEngine.name;
  if (SOCIAL_SITES.some((s) => host.includes(s))) return "Social";
  return `Referral: ${host}`;
}

interface PageViewRow {
  id: string;
  path: string;
  referrer: string | null;
  is_mobile: boolean | null;
  event_type: string | null;
  created_at: string;
  city: string | null;
  region: string | null;
  country: string | null;
  is_likely_bot: boolean;
  user_agent: string | null;
  session_id: string | null;
  duration_seconds: number | null;
  click_label: string | null;
  click_href: string | null;
}

// "YYYY-MM-DD" from the date picker, treated as UTC-day boundaries so they
// line up with how viewsByDay buckets created_at (a UTC date slice).
function parseRangeParam(value: string | null, fallbackDaysAgo: number, endOfDay: boolean): string {
  if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return `${value}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}Z`;
  }
  return new Date(Date.now() - fallbackDaysAgo * 24 * 60 * 60 * 1000).toISOString();
}

// A conversion count for the range, plus the last-7-days slice of it.
function countConversions(rows: { created_at: string }[] | null, recentStart: string, showRecent: boolean) {
  const list = rows ?? [];
  return {
    total: list.length,
    recent: showRecent ? list.filter((r) => r.created_at >= recentStart).length : null,
  };
}

export async function GET(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });

  const { searchParams } = new URL(req.url);
  const rangeStart = parseRangeParam(searchParams.get("from"), 30, false);
  const rangeEnd = parseRangeParam(searchParams.get("to"), 0, true);

  // The "recent" comparison is the last 7 days of the selected range, hidden
  // client-side when the range itself is 7 days or shorter.
  const sevenDaysBeforeEnd = new Date(new Date(rangeEnd).getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const recentStart = sevenDaysBeforeEnd > rangeStart ? sevenDaysBeforeEnd : rangeStart;
  const showRecent = recentStart > rangeStart;

  const supabase = getSupabaseAdmin();
  const inRange = (table: string) =>
    supabase.from(table).select("created_at").gte("created_at", rangeStart).lte("created_at", rangeEnd);

  const [viewsResult, demosResult, betaResult, leadsResult] = await Promise.all([
    supabase
      .from(PAGE_VIEWS_TABLE)
      .select(
        "id, path, referrer, is_mobile, event_type, created_at, city, region, country, is_likely_bot, user_agent, session_id, duration_seconds, click_label, click_href"
      )
      .gte("created_at", rangeStart)
      .lte("created_at", rangeEnd)
      .order("created_at", { ascending: false })
      .limit(10000),
    inRange("eliteworker_demo_bookings"),
    inRange("eliteworker_beta_signups"),
    inRange("eliteworker_leads"),
  ]);

  if (viewsResult.error || !viewsResult.data) {
    return NextResponse.json(
      { error: viewsResult.error?.message.includes(PAGE_VIEWS_TABLE) ? "The analytics table hasn't been created yet — run the SQL from the README." : "Failed to load analytics" },
      { status: 500 }
    );
  }

  const allRows = viewsResult.data as PageViewRow[];
  const humanRows = allRows.filter((r) => !r.is_likely_bot);
  const botRows = allRows.filter((r) => r.is_likely_bot);
  const pageviewRows = humanRows.filter((r) => !r.event_type);
  const botPageviewRows = botRows.filter((r) => !r.event_type);

  const totalViews = pageviewRows.length;
  const recentViews = showRecent ? pageviewRows.filter((r) => r.created_at >= recentStart).length : null;
  const visitors = new Set(pageviewRows.map((r) => r.session_id).filter(Boolean)).size;

  const dayCounts = new Map<string, number>();
  const hourCounts = new Map<number, number>();
  const dayOfWeekCounts = new Map<number, number>();
  for (const row of pageviewRows) {
    const day = row.created_at.slice(0, 10);
    dayCounts.set(day, (dayCounts.get(day) ?? 0) + 1);

    const localDate = new Date(row.created_at);
    const hour = Number(
      new Intl.DateTimeFormat("en-US", { hour: "numeric", hour12: false, timeZone: DISPLAY_TIMEZONE }).format(localDate)
    );
    const normalizedHour = hour === 24 ? 0 : hour;
    hourCounts.set(normalizedHour, (hourCounts.get(normalizedHour) ?? 0) + 1);

    const weekdayName = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: DISPLAY_TIMEZONE }).format(localDate);
    const dayIndex = DAY_NAMES.indexOf(weekdayName);
    if (dayIndex >= 0) dayOfWeekCounts.set(dayIndex, (dayOfWeekCounts.get(dayIndex) ?? 0) + 1);
  }
  const viewsByDay = Array.from(dayCounts.entries())
    .map(([day, count]) => ({ day, count }))
    .sort((a, b) => a.day.localeCompare(b.day));
  const viewsByHour = Array.from({ length: 24 }, (_, hour) => ({ hour, count: hourCounts.get(hour) ?? 0 }));
  const viewsByDayOfWeek = DAY_NAMES.map((day, i) => ({ day, count: dayOfWeekCounts.get(i) ?? 0 }));

  const tally = <T,>(rows: T[], key: (r: T) => string | null, limit: number) => {
    const counts = new Map<string, number>();
    for (const r of rows) {
      const k = key(r);
      if (k) counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  };

  const topPages = tally(pageviewRows, (r) => r.path, 10);
  const trafficSources = tally(pageviewRows, (r) => categorizeReferrer(r.referrer), 8);
  // Only full city + state + country — a bare "US" (VPNs, some carriers)
  // isn't useful in a location breakdown.
  const topLocations = tally(
    pageviewRows,
    (r) => (r.city && r.region && r.country ? [r.city, r.region, r.country].join(", ") : null),
    10
  );
  const topClicks = tally(
    humanRows.filter((r) => r.event_type === "click"),
    (r) => r.click_label,
    10
  );

  const mobileCount = pageviewRows.filter((r) => r.is_mobile).length;
  const mobilePct = totalViews > 0 ? Math.round((mobileCount / totalViews) * 100) : 0;

  const botAgentCounts = new Map<string, number>();
  const botAgentLastSeen = new Map<string, string>();
  for (const row of botPageviewRows) {
    const agent = row.user_agent || "(no User-Agent)";
    botAgentCounts.set(agent, (botAgentCounts.get(agent) ?? 0) + 1);
    // Rows are newest-first, so the first sighting is the most recent.
    if (!botAgentLastSeen.has(agent)) botAgentLastSeen.set(agent, row.created_at);
  }
  const topBotAgents = Array.from(botAgentCounts.entries())
    .map(([agent, count]) => ({ agent, count, lastSeen: botAgentLastSeen.get(agent)! }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Every human row grouped by session, so one visitor's full journey —
  // pages, time on each, every click — can be drilled into.
  const sessionGroups = new Map<string, PageViewRow[]>();
  for (const row of humanRows) {
    if (!row.session_id) continue;
    if (!sessionGroups.has(row.session_id)) sessionGroups.set(row.session_id, []);
    sessionGroups.get(row.session_id)!.push(row);
  }
  const sessions = Array.from(sessionGroups.entries())
    .map(([sessionId, rows]) => {
      const sorted = [...rows].sort((a, b) => a.created_at.localeCompare(b.created_at));
      const first = sorted[0];
      const device = detectDevice(first.user_agent);
      return {
        sessionId,
        firstSeen: first.created_at,
        lastSeen: sorted[sorted.length - 1].created_at,
        pageCount: sorted.filter((r) => !r.event_type).length,
        clicks: sorted.filter((r) => r.event_type).length,
        totalDurationSeconds: sorted.reduce((sum, r) => sum + (r.duration_seconds ?? 0), 0),
        os: device.os,
        formFactor: device.formFactor,
        city: first.city,
        region: first.region,
        country: first.country,
        entrySource: categorizeReferrer(first.referrer),
        timeline: sorted.map((r) => ({
          type: r.event_type ? "click" : "page",
          path: r.path,
          label: r.click_label,
          durationSeconds: r.duration_seconds,
          timestamp: r.created_at,
        })),
      };
    })
    .sort((a, b) => b.lastSeen.localeCompare(a.lastSeen))
    .slice(0, 100);

  return NextResponse.json({
    rangeFrom: rangeStart.slice(0, 10),
    rangeTo: rangeEnd.slice(0, 10),
    totalViews,
    recentViews,
    visitors,
    mobilePct,
    demoBookings: countConversions(demosResult.data, recentStart, showRecent),
    betaSignups: countConversions(betaResult.data, recentStart, showRecent),
    leads: countConversions(leadsResult.data, recentStart, showRecent),
    viewsByDay,
    viewsByHour,
    viewsByDayOfWeek,
    topPages,
    trafficSources,
    topLocations,
    topClicks,
    botViews: botPageviewRows.length,
    topBotAgents,
    sessions,
  });
}
