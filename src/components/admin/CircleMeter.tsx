type Accent = "brand" | "accent" | "teal" | "emerald";

const ACCENT_COLOR: Record<Accent, string> = {
  brand: "#3b82f6",
  accent: "#f59e0b",
  teal: "#0d9488",
  emerald: "#059669",
};

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Fill percentage is this month's count against last month's — not an
// arbitrary decoration, so the ring actually means "ahead of/behind last
// month" rather than just dressing up a number in a circle. Uncapped
// growth (last month was 0) reads as a full ring; no activity either
// month reads as empty.
function percentVsLastMonth(thisMonth: number, lastMonth: number): number {
  if (lastMonth <= 0) return thisMonth > 0 ? 100 : 0;
  return Math.max(0, Math.min(100, (thisMonth / lastMonth) * 100));
}

export function CircleMeter({
  label,
  value,
  lastMonthValue,
  accent,
}: {
  label: string;
  value: number;
  lastMonthValue: number;
  accent: Accent;
}) {
  const percent = percentVsLastMonth(value, lastMonthValue);
  const offset = CIRCUMFERENCE * (1 - percent / 100);
  const color = ACCENT_COLOR[accent];

  return (
    <div className="flex flex-col items-center rounded-2xl border border-line bg-paper p-6 text-center">
      <div className="relative h-28 w-28">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="var(--line)" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-3xl font-bold text-ink">{value}</span>
        </div>
      </div>
      <p className="mt-3 text-sm font-medium text-ink/60">{label}</p>
      <p className="mt-0.5 text-xs text-ink/35">{lastMonthValue} last month</p>
    </div>
  );
}
