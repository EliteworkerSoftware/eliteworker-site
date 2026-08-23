import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type Accent = "brand" | "accent" | "teal";

const ACCENT_STYLES: Record<Accent, { tint: string; icon: string }> = {
  brand: { tint: "bg-brand/10", icon: "text-brand" },
  accent: { tint: "bg-accent/10", icon: "text-accent" },
  teal: { tint: "bg-teal/10", icon: "text-teal" },
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
      className="block rounded-2xl border border-line bg-paper p-6 transition hover:border-ink/15 hover:shadow-[0_4px_16px_rgba(15,23,42,0.05)]"
    >
      <div className="flex items-center justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles.tint}`}>
          <Icon size={19} className={styles.icon} />
        </span>
        {unread > 0 && (
          <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-600">
            {unread} unread
          </span>
        )}
      </div>
      <p className="mt-4 text-3xl font-semibold text-ink">{total}</p>
      <p className="mt-1 text-sm text-ink/50">{label}</p>
    </Link>
  );
}
