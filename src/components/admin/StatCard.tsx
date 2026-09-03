import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type Accent = "brand" | "accent" | "teal";

// A solid color underline + bare icon, not a card — the accent shows as a
// thin line that brightens on hover rather than a boxed background.
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
    <Link href={href} className="group block">
      <div className="flex items-center justify-between">
        <Icon size={20} strokeWidth={2.25} className={styles.icon} />
        {unread > 0 && (
          <span className="rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white">{unread} unread</span>
        )}
      </div>
      <p className="font-display mt-4 text-3xl font-bold text-ink">{total}</p>
      <p className="mt-1 text-sm text-ink/50">{label}</p>
      <div className={`mt-4 h-px w-full ${styles.bar} opacity-25 transition group-hover:opacity-100`} />
    </Link>
  );
}
