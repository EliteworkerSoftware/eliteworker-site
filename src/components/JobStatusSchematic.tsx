"use client";

const nodes = [
  { label: "Prewire", x: 12, y: 70 },
  { label: "Trim", x: 34, y: 30 },
  { label: "Programming", x: 60, y: 58 },
  { label: "Final Walkthrough", x: 84, y: 22 },
];

// The signature element: a wiring-diagram-style trace connecting a job's
// real lifecycle stages, with each node pulsing like a status LED on
// installed AV gear — the exact visual vocabulary EliteWorker's users
// read every day on job sites.
export default function JobStatusSchematic() {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-wire-line bg-graphite-2">
      <div className="blueprint-grid absolute inset-0" />
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <polyline
          points={nodes.map((n) => `${n.x},${n.y}`).join(" ")}
          fill="none"
          stroke="var(--live-cyan)"
          strokeWidth="0.4"
          strokeDasharray="2 1.5"
          opacity="0.7"
        />
      </svg>
      {nodes.map((n, i) => (
        <div
          key={n.label}
          className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
        >
          <span
            className="h-2.5 w-2.5 rounded-full bg-signal-amber shadow-[0_0_0_4px_rgba(242,169,59,0.15)]"
            style={{ animation: `pulse 2.4s ease-in-out ${i * 0.4}s infinite` }}
          />
          <span className="whitespace-nowrap rounded border border-wire-line bg-graphite px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-paper/70">
            {n.label}
          </span>
        </div>
      ))}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.6); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
