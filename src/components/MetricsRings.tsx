"use client";

import { useEffect, useState } from "react";

type HoursRing = { kind: "hours"; label: string; used: number; sold: number };
type TasksRing = { kind: "tasks"; label: string; completed: number; total: number };
type Ring = HoursRing | TasksRing;

const rings: Ring[] = [
  { kind: "hours", label: "Installation Hours", used: 6.25, sold: 8 },
  { kind: "hours", label: "Programming Hours", used: 7.5, sold: 6 },
  { kind: "tasks", label: "Tasks", completed: 18, total: 20 },
];

const GREEN = "#4ade80";
const RED = "#dc2626";
const GREY = "#9ca3af";

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const PER_RING_MS = 2000;
const GAP_MS = 400;
const SEGMENT_MS = PER_RING_MS + GAP_MS;
const TOTAL_MS = rings.length * SEGMENT_MS;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function ringData(ring: Ring) {
  if (ring.kind === "hours") {
    return {
      rawPct: ring.sold > 0 ? ring.used / ring.sold : 0,
      value: ring.used,
      valueLabel: "hrs used",
      caption: `${ring.sold.toFixed(2)} hrs sold`,
      decimals: 2,
    };
  }
  return {
    rawPct: ring.total > 0 ? ring.completed / ring.total : 0,
    value: ring.completed,
    valueLabel: "tasks",
    caption: `${ring.total} tasks assigned`,
    decimals: 0,
  };
}

export function MetricsRings() {
  const [progresses, setProgresses] = useState<number[]>(() => rings.map(() => 0));

  useEffect(() => {
    let raf = 0;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      raf = requestAnimationFrame(() => setProgresses(rings.map(() => 1)));
      return () => cancelAnimationFrame(raf);
    }

    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      setProgresses(
        rings.map((_, i) => {
          const local = elapsed - i * SEGMENT_MS;
          const t = Math.min(1, Math.max(0, local / PER_RING_MS));
          return easeOutCubic(t);
        })
      );
      if (elapsed < TOTAL_MS) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
      {rings.map((ring, i) => {
        const progress = progresses[i] ?? 0;
        const { rawPct, value, valueLabel, caption, decimals } = ringData(ring);
        const pct = Math.min(1, rawPct) * progress;
        const dashoffset = CIRCUMFERENCE * (1 - pct);
        const theta = pct * 2 * Math.PI;
        const markerX = 60 + RADIUS * Math.sin(theta);
        const markerY = 60 - RADIUS * Math.cos(theta);
        const displayValue = value * progress;

        const color =
          ring.kind === "hours"
            ? displayValue > ring.sold
              ? RED
              : GREEN
            : ring.completed >= ring.total
              ? GREEN
              : GREY;
        const numberColor = color === GREY ? "var(--ink)" : color;

        const entrance = Math.min(1, progress * 3);
        const scale = 0.5 + 0.5 * entrance;
        const offsetY = (1 - entrance) * 24;

        return (
          <div
            key={ring.label}
            className="flex flex-col items-center"
            style={{ opacity: entrance, transform: `translateY(${offsetY}px) scale(${scale})` }}
          >
            <svg
              viewBox="0 0 120 120"
              className="h-32 w-32 sm:h-40 sm:w-40"
              role="img"
              aria-label={`${ring.label}: ${value} ${valueLabel}, ${caption}`}
            >
              <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="var(--line)" strokeWidth="8" />
              <circle
                cx="60"
                cy="60"
                r={RADIUS}
                fill="none"
                stroke={color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                strokeDashoffset={dashoffset}
                transform="rotate(-90 60 60)"
                style={{ transition: "stroke 0.3s ease" }}
              />
              {progress > 0.02 && <circle cx={markerX} cy={markerY} r="5.5" fill={color} style={{ transition: "fill 0.3s ease" }} />}
              <text
                x="60"
                y="57"
                textAnchor="middle"
                fontSize="20"
                fontWeight="700"
                fill={numberColor}
                style={{ transition: "fill 0.3s ease" }}
              >
                {displayValue.toFixed(decimals)}
              </text>
              <text x="60" y="73" textAnchor="middle" fontSize="8.5" fill="var(--ink)" fillOpacity="0.5">
                {valueLabel}
              </text>
            </svg>
            <p className="mt-3 text-sm font-semibold text-ink">{ring.label}</p>
            <p className="text-xs text-ink/50">{caption}</p>
          </div>
        );
      })}
    </div>
  );
}
