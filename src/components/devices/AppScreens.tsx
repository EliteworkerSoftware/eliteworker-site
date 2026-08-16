const crewDay = [
  { name: "A-12", job: "Miller Residence", stage: "Prewire", status: "On time", tone: "ok" },
  { name: "C-07", job: "Harbor Point Condo", stage: "Trim", status: "Delayed", tone: "warn" },
  { name: "B-03", job: "Ridgeline Estate", stage: "Programming", status: "Live", tone: "live" },
  { name: "D-09", job: "Oak Hollow", stage: "Walkthrough", status: "On time", tone: "ok" },
];

const dayColumns = [
  { day: "Mon", jobs: [38, 62] },
  { day: "Tue", jobs: [55, 30, 70] },
  { day: "Wed", jobs: [80, 45] },
  { day: "Thu", jobs: [60, 60, 25] },
  { day: "Fri", jobs: [90, 40] },
];

function statusClasses(tone: string) {
  if (tone === "ok") return "bg-emerald-500/15 text-emerald-300";
  if (tone === "warn") return "bg-amber-500/15 text-amber-300";
  return "bg-brand-light/15 text-brand-light";
}

export function DesktopDashboardScreen() {
  return (
    <div className="flex h-full flex-col text-[9px] text-paper/80">
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
            <span className="h-2 w-2 rounded-full bg-[#ffbd2e]" />
            <span className="h-2 w-2 rounded-full bg-[#28c840]" />
          </div>
          <span className="ml-2 font-semibold tracking-wide text-white">EliteWorker</span>
          <nav className="ml-4 hidden gap-3 text-paper/45 sm:flex">
            <span className="text-white">Schedule</span>
            <span>Jobs</span>
            <span>Crew</span>
            <span>Reports</span>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-emerald-300">On track</span>
          <span className="h-5 w-5 rounded-full bg-gradient-to-br from-brand to-brand-light" />
        </div>
      </div>

      <div className="grid flex-1 grid-cols-[0.9fr_1.4fr_1fr] gap-3 p-3">
        <div className="space-y-2">
          {[
            { label: "Jobs today", value: "12" },
            { label: "Completion", value: "94%" },
            { label: "Callbacks", value: "0" },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-lg border border-white/5 bg-white/[0.03] p-2.5">
              <p className="text-[7px] uppercase tracking-[0.16em] text-paper/40">{kpi.label}</p>
              <p className="mt-1 font-display text-base font-semibold text-white">{kpi.value}</p>
            </div>
          ))}
          <div className="rounded-lg border border-white/5 bg-white/[0.03] p-2.5">
            <p className="text-[7px] uppercase tracking-[0.16em] text-paper/40">Active alerts</p>
            <div className="mt-2 space-y-1.5">
              <div className="rounded bg-black/25 px-1.5 py-1">3 crews en route</div>
              <div className="rounded bg-black/25 px-1.5 py-1">1 material shortage</div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-white/5 bg-white/[0.03] p-2.5">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[7px] uppercase tracking-[0.16em] text-paper/40">This week</p>
            <span className="text-[7px] text-paper/40">5 crews</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {dayColumns.map((col) => (
              <div key={col.day} className="space-y-1">
                <p className="text-center text-[7px] text-paper/40">{col.day}</p>
                {col.jobs.map((h, i) => (
                  <div
                    key={i}
                    className="rounded bg-gradient-to-b from-brand-light/70 to-brand/60"
                    style={{ height: `${h * 0.55}px` }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-white/5 bg-white/[0.03] p-2.5">
          <p className="mb-2 text-[7px] uppercase tracking-[0.16em] text-paper/40">Crew status</p>
          <div className="space-y-1.5">
            {crewDay.map((c) => (
              <div key={c.name} className="flex items-center justify-between rounded bg-black/20 px-1.5 py-1.5">
                <div>
                  <p className="font-medium text-white">{c.name}</p>
                  <p className="text-paper/40">{c.stage}</p>
                </div>
                <span className={`rounded-full px-1.5 py-0.5 ${statusClasses(c.tone)}`}>{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const stages = ["Prewire", "Trim", "Programming", "Walkthrough"];

const checklist = [
  { label: "Rack wired & labeled", done: true },
  { label: "Panel devices paired", done: true },
  { label: "Shades calibrated", done: false },
  { label: "Scenes tested w/ client", done: false },
];

export function TabletFieldScreen() {
  return (
    <div className="flex h-full flex-col bg-ink-3 text-[9px] text-paper/80">
      <div className="border-b border-white/5 px-4 pb-3 pt-4">
        <p className="text-[7px] uppercase tracking-[0.18em] text-brand-light">Job #614</p>
        <h3 className="mt-0.5 text-sm font-semibold text-white">Ridgeline Estate</h3>
        <div className="mt-3 flex items-center gap-1.5">
          {stages.map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-1.5">
              <div
                className={`h-1.5 flex-1 rounded-full ${
                  i <= 2 ? "bg-gradient-to-r from-brand to-brand-light" : "bg-white/10"
                }`}
              />
            </div>
          ))}
        </div>
        <div className="mt-1.5 flex justify-between text-[7px] text-paper/40">
          {stages.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-hidden p-4">
        <div className="rounded-lg border border-white/5 bg-white/[0.03] p-3">
          <p className="mb-2 text-[7px] uppercase tracking-[0.16em] text-paper/40">Programming checklist</p>
          <div className="space-y-1.5">
            {checklist.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span
                  className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[4px] border ${
                    item.done ? "border-brand-light bg-brand-light/25 text-brand-light" : "border-white/20"
                  }`}
                >
                  {item.done ? "✓" : ""}
                </span>
                <span className={item.done ? "text-paper/50 line-through" : "text-paper/80"}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-white/5 bg-white/[0.03] p-3">
          <p className="mb-2 text-[7px] uppercase tracking-[0.16em] text-paper/40">Site photos</p>
          <div className="grid grid-cols-3 gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-md bg-gradient-to-br from-brand/30 via-brand-light/20 to-white/5"
              />
            ))}
          </div>
        </div>

        <button className="w-full rounded-lg bg-gradient-to-r from-brand to-brand-light py-2.5 text-center font-semibold text-white">
          Mark stage complete
        </button>
      </div>
    </div>
  );
}

const partsLog = ["Cat6 spool — 40ft", "In-wall speaker x2", "Shade motor bracket"];

export function PhoneTechScreen() {
  return (
    <div className="flex h-full flex-col bg-ink-3 text-[8px] text-paper/80">
      <div className="flex items-center justify-between px-4 pb-1 pt-3 text-[7px] text-paper/50">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-3 rounded-sm bg-paper/50" />
          <span className="h-1.5 w-3.5 rounded-sm bg-paper/50" />
        </div>
      </div>

      <div className="px-4 pb-3 pt-2">
        <p className="text-paper/45">Good morning,</p>
        <h3 className="text-sm font-semibold text-white">Jordan Reyes</h3>
        <button className="mt-2.5 w-full rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-400 py-2 text-center font-semibold text-white">
          Clocked in · 7:58 AM
        </button>
      </div>

      <div className="flex-1 space-y-2.5 overflow-hidden px-4">
        <div className="rounded-lg border border-white/5 bg-white/[0.03] p-2.5">
          <div className="flex items-center justify-between">
            <p className="font-medium text-white">Ridgeline Estate</p>
            <span className="rounded-full bg-brand-light/15 px-1.5 py-0.5 text-brand-light">Programming</span>
          </div>
          <p className="mt-0.5 text-paper/45">412 Ridgeline Dr</p>
          <div className="mt-2 h-14 rounded-md bg-grid-dark bg-[#0d1626]">
            <div className="flex h-full items-center justify-center">
              <span className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_0_5px_rgba(245,158,11,0.2)]" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-white/5 bg-white/[0.03] p-2.5">
          <p className="mb-1.5 text-[7px] uppercase tracking-[0.16em] text-paper/40">Parts logged</p>
          <div className="space-y-1">
            {partsLog.map((p) => (
              <div key={p} className="flex items-center justify-between rounded bg-black/20 px-1.5 py-1">
                <span>{p}</span>
                <span className="text-emerald-300">✓</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-around border-t border-white/5 px-4 py-2.5">
        {["Jobs", "Map", "Alerts", "Profile"].map((label, i) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <span className={`h-1.5 w-1.5 rounded-full ${i === 0 ? "bg-brand-light" : "bg-white/20"}`} />
            <span className={i === 0 ? "text-paper/70" : "text-paper/30"}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
