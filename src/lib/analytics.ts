// Shared bits of the first-party visitor analytics (ported from the ONPRO IT
// site's analytics stack, the standard for every site).

export const PAGE_VIEWS_TABLE = "eliteworker_page_views";

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

// Local dev and Vercel preview deployments write to the same production
// Supabase project, so only the real domain records traffic — otherwise
// every local test load would show up as a real visitor.
export function isProductionHost(host: string | null): boolean {
  return (host ?? "").includes("eliteworker.com");
}
