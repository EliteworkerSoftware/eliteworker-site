import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type Accent = "brand" | "accent" | "teal";

// A solid color stripe + bare icon, not a soft pastel-tinted badge — matches
// the bold-stripe motif already used on the login screen and in emails,
// rather than the softer "friendly SaaS" look the rest of the admin section
// moved away from.
const ACCENT_STYLES: Record<Accent, { bar: string; icon: string }> = {
  brand: { bar: "bg-brand", icon: "text-brand" },
  accent: { bar: "bg-accent", icon: "text-accent" },
  teal: { bar: "bg-teal", icon: "text-teal" },
};

export function StatCard({
  href,
  label,
  total,
  unread,
  icon: Icon,
  accent,
}: {
  href: string;
  label: string;
  total: number;
  unread: number;
  icon: LucideIcon;
  accent: Accent;
}) {
  const styles = ACCENT_STYLES[accent];
  return (
    <Link
      href={href}
      className="block overflow-hidden rounded-2xl border border-line bg-paper transition hover:border-ink/20 hover:shadow-[0_4px_20px_rgba(15,23,42,0.08)]"
    >
      <div className={`h-1.5 w-full ${styles.bar}`} />
      <div className="p-6">
        <div className="flex items-center justify-between">
          <Icon size={20} strokeWidth={2.25} className={styles.icon} />
          {unread > 0 && (
            <span className="rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white">{unread} unread</span>
          )}
        </div>
        <p className="font-display mt-4 text-3xl font-bold text-ink">{total}</p>
        <p className="mt-1 text-sm text-ink/50">{label}</p>
      </div>
    </Link>
  );
}
