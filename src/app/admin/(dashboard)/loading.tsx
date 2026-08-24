// Shown immediately on every tab click while the new page's data loads —
// without this, Next.js has nothing to render until the whole page (auth
// check + Supabase queries) resolves, which reads as the dashboard being
// unresponsive rather than just fetching.
export default function DashboardLoading() {
  return (
    <div>
      <div className="flex items-center justify-between border-b border-line bg-paper px-5 py-4 sm:px-8">
        <div className="h-5 w-40 animate-pulse rounded bg-line" />
        <div className="h-8 w-20 animate-pulse rounded-full bg-line" />
      </div>
      <div className="space-y-4 p-5 sm:p-8">
        <div className="h-24 animate-pulse rounded-2xl border border-line bg-paper" />
        <div className="h-24 animate-pulse rounded-2xl border border-line bg-paper" />
        <div className="h-24 animate-pulse rounded-2xl border border-line bg-paper" />
      </div>
    </div>
  );
}
