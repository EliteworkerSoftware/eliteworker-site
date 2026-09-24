import { NextRequest, NextResponse } from "next/server";
import { SITE_URL } from "@/emails/constants";
import { getAllSiteUrls } from "@/lib/site-urls";
import { isIndexNowConfigured, submitUrlsToIndexNow } from "@/lib/indexnow";
import { isSearchConsoleConfigured, submitSitemap } from "@/lib/search-console";

// Daily (see vercel.json) so new and changed pages get picked up without
// anyone resubmitting by hand: pings IndexNow (Bing, Yandex) with every URL
// and resubmits the sitemap to Google. The sitemap resubmit needs the
// Search Console service account to be a Full user on the property; it
// fails harmlessly (reported, not thrown) until then.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const urls = getAllSiteUrls();
  const results: Record<string, unknown> = { urlCount: urls.length };

  if (isIndexNowConfigured()) {
    try {
      await submitUrlsToIndexNow(urls);
      results.indexNow = "ok";
    } catch (e) {
      results.indexNow = `error: ${(e as Error).message}`;
    }
  } else {
    results.indexNow = "skipped: not configured";
  }

  if (isSearchConsoleConfigured()) {
    try {
      await submitSitemap(`${SITE_URL}/sitemap.xml`);
      results.googleSitemap = "ok";
    } catch (e) {
      results.googleSitemap = `error: ${(e as Error).message}`;
    }
  } else {
    results.googleSitemap = "skipped: not configured";
  }

  return NextResponse.json({ ok: true, ...results });
}
