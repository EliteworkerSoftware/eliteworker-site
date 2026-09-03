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
      <div className="divide-y divide-line p-5 sm:p-8">
        <div className="h-24 animate-pulse py-3">
          <div className="h-full w-full rounded-lg bg-line/60" />
        </div>
        <div className="h-24 animate-pulse py-3">
          <div className="h-full w-full rounded-lg bg-line/60" />
        </div>
        <div className="h-24 animate-pulse py-3">
          <div className="h-full w-full rounded-lg bg-line/60" />
        </div>
      </div>
    </div>
  );
}
