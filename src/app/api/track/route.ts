import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { PAGE_VIEWS_TABLE, isProductionHost, isSupabaseConfigured } from "@/lib/analytics";

// Flags (rather than drops) traffic that self-identifies or pattern-matches
// as automated — named crawlers, generic HTTP clients, scripts, monitoring
// tools, and headless browsers — so the dashboard can show bot traffic as
// its own category instead of hiding it. A headless browser spoofing a real
// User-Agent looks identical to a human here; a header check can't catch it.
const BOT_PATTERN =
  /bot|crawl|spider|slurp|facebookexternalhit|preview|headless|curl|wget|python-requests|python-urllib|go-http-client|java\/|libwww|okhttp|axios|node-fetch|postmanruntime|insomnia|http_?client|scrapy|phantomjs|selenium|puppeteer|playwright|lighthouse|pingdom|uptimerobot|monitor/i;

const VALID_EVENTS = new Set(["click", "call_click"]);

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured() || !isProductionHost(req.headers.get("host"))) {
    return NextResponse.json({ ok: true });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body.path !== "string" || !body.path) {
    return NextResponse.json({ error: "path is required" }, { status: 400 });
  }
  const { path, referrer, event, sessionId, clickLabel, clickHref } = body;
  const eventType = VALID_EVENTS.has(event) ? event : null;

  const userAgent = req.headers.get("user-agent") ?? "";
  const cityHeader = req.headers.get("x-vercel-ip-city");

  try {
    const { data, error } = await getSupabaseAdmin()
      .from(PAGE_VIEWS_TABLE)
      .insert({
        path: path.slice(0, 500),
        referrer: typeof referrer === "string" ? referrer.slice(0, 500) : null,
        country: req.headers.get("x-vercel-ip-country"),
        region: req.headers.get("x-vercel-ip-country-region"),
        city: cityHeader ? decodeURIComponent(cityHeader) : null,
        is_mobile: /Mobile|Android|iPhone/i.test(userAgent),
        event_type: eventType,
        is_likely_bot: !userAgent || BOT_PATTERN.test(userAgent),
        user_agent: userAgent ? userAgent.slice(0, 300) : null,
        session_id: typeof sessionId === "string" ? sessionId.slice(0, 64) : null,
        click_label: typeof clickLabel === "string" ? clickLabel.slice(0, 200) : null,
        click_href: typeof clickHref === "string" ? clickHref.slice(0, 500) : null,
      })
      .select("id")
      .single();

    if (error) throw error;
    return NextResponse.json({ ok: true, id: data.id });
  } catch (err) {
    console.error("Page view tracking error:", err);
    return NextResponse.json({ ok: true });
  }
}
