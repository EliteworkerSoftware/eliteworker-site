import sitemap from "@/app/sitemap";

// Every public URL, straight from the sitemap, so the search-engine ping
// cron and the sitemap can never list different pages.
export function getAllSiteUrls(): string[] {
  return sitemap().map((entry) => entry.url);
}
