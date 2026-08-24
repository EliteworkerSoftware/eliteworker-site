import Link from "next/link";
import { CalendarCheck } from "lucide-react";

export type UpcomingDemo = {
  id: string;
  attendee_name: string | null;
  event_title: string | null;
  start_time: string;
};

function formatWhen(value: string) {
  return new Date(value).toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export function UpcomingDemos({ demos }: { demos: UpcomingDemo[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-paper">
      <div className="h-1.5 w-full bg-teal" />
      <div className="p-6">
        <div className="flex items-center gap-2">
          <CalendarCheck size={19} strokeWidth={2.25} className="text-teal" />
          <h2 className="font-display text-lg font-bold text-ink">Upcoming Demos</h2>
        </div>

        {demos.length === 0 ? (
          <p className="mt-4 text-sm text-ink/40">Nothing scheduled — new bookings will show up here.</p>
        ) : (
          <div className="mt-3 divide-y divide-line">
            {demos.map((demo) => (
              <div key={demo.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{demo.attendee_name || "Unknown attendee"}</p>
                  <p className="truncate text-xs text-ink/50">{demo.event_title || "Demo"}</p>
                </div>
                <p className="shrink-0 text-sm font-medium whitespace-nowrap text-ink/70">{formatWhen(demo.start_time)}</p>
              </div>
            ))}
          </div>
        )}

        <Link href="/admin/bookings" className="mt-4 inline-block text-sm font-semibold text-teal hover:text-teal-dark">
          View all bookings →
        </Link>
      </div>
    </div>
  );
}
