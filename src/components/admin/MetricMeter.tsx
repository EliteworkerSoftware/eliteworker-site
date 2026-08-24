type Accent = "brand" | "accent" | "teal" | "emerald";

const ACCENT_BAR: Record<Accent, string> = {
  brand: "bg-brand",
  accent: "bg-accent",
  teal: "bg-teal",
  emerald: "bg-emerald-600",
};

// Same bold-stripe card shell as StatCard, but for a month-scoped count
// rather than a running total — the month range is computed fresh on every
// page load (see the Overview page), so these read as "reset" each month
// without needing any actual reset logic or stored state.
export function MetricMeter({ label, value, accent }: { label: string; value: number; accent: Accent }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-paper">
      <div className={`h-1.5 w-full ${ACCENT_BAR[accent]}`} />
      <div className="p-6">
        <p className="font-display text-4xl font-bold text-ink">{value}</p>
        <p className="mt-1 text-sm font-medium text-ink/60">{label}</p>
      </div>
    </div>
  );
}
