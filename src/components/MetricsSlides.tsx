"use client";

import { useEffect, useRef, useState } from "react";
import { MetricsRings } from "@/components/MetricsRings";

const SLIDE_MS = 9500;

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Task = { title: string; location: string };
type WorkDayEvent = { day: number; employee: string; color: string; time: string; tasks: Task[] };

const workDayEvents: WorkDayEvent[] = [
  {
    day: 7,
    employee: "Jake Reyes",
    color: "#f97316",
    time: "8:16am – 9:57am",
    tasks: [
      { title: "Install Surroundscape Burial Subwoofer", location: "Back Yard" },
      { title: "Install Surroundscape Satellite Speaker x2", location: "Back Yard" },
    ],
  },
  {
    day: 11,
    employee: "Maria Chen",
    color: "#3b82f6",
    time: "9:30am – 1:10pm",
    tasks: [
      { title: "Program Lighting Scenes", location: "Living Room" },
      { title: "Test Network Switch Configuration", location: "Media Closet" },
    ],
  },
  {
    day: 16,
    employee: "Alex Novak",
    color: "#16a34a",
    time: "6:07am – 11:08am",
    tasks: [
      { title: "Mount 85″ Display", location: "Family Room" },
      { title: "Terminate Speaker Wire Runs", location: "Family Room" },
      { title: "Label Structured Wiring Panel", location: "Utility Closet" },
    ],
  },
];

const calendarDays = (() => {
  const prevMonthTail = [26, 27, 28, 29, 30, 31].map((date) => ({ date, inMonth: false }));
  const currentMonth = Array.from({ length: 16 }, (_, i) => ({ date: i + 1, inMonth: true }));
  return [...prevMonthTail, ...currentMonth].map((d) => ({
    ...d,
    event: d.inMonth ? workDayEvents.find((e) => e.day === d.date) : undefined,
  }));
})();

const teamHours = [
  { name: "Jake Reyes", role: "Installation", timeIn: "6:07 am", timeOut: "11:08 am", hours: 5.02, max: 8 },
  { name: "Maria Chen", role: "Programming", timeIn: "8:00 am", timeOut: "1:15 pm", hours: 5.25, max: 8 },
  { name: "Alex Novak", role: "Installation", timeIn: "7:30 am", timeOut: "3:45 pm", hours: 8.25, max: 8 },
] as const;

function EventModal({ event, onClose }: { event: WorkDayEvent; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-line bg-paper p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: event.color }}
            >
              {event.employee
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">Work Day — {event.employee}</p>
              <p className="text-xs text-ink/50">
                {event.time} · {event.tasks.length} tasks completed
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-ink/40 transition hover:text-ink" aria-label="Close">
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {event.tasks.map((task) => (
            <div key={task.title} className="rounded-lg border border-line bg-paper-alt px-3 py-2.5">
              <p className="text-sm font-medium text-ink">{task.title}</p>
              <p className="text-xs text-ink/50">{task.location}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-full bg-brand-dark px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Close
        </button>
      </div>
    </div>
  );
}

const DEMO_DAY = 7;

function TimelineSlide() {
  const [selected, setSelected] = useState<WorkDayEvent | null>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [clicking, setClicking] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const demoButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(
      setTimeout(() => {
        const container = containerRef.current;
        setCursor(container ? { x: 24, y: 24 } : null);
      }, 500)
    );

    timers.push(
      setTimeout(() => {
        const container = containerRef.current;
        const btn = demoButtonRef.current;
        if (!container || !btn) return;
        const cRect = container.getBoundingClientRect();
        const bRect = btn.getBoundingClientRect();
        setCursor({
          x: bRect.left - cRect.left + bRect.width / 2,
          y: bRect.top - cRect.top + bRect.height / 2,
        });
      }, 1800)
    );

    timers.push(setTimeout(() => setClicking(true), 3000));
    timers.push(
      setTimeout(() => {
        setClicking(false);
        const demoEvent = workDayEvents.find((e) => e.day === DEMO_DAY);
        if (demoEvent) setSelected(demoEvent);
      }, 3300)
    );
    timers.push(setTimeout(() => setSelected(null), SLIDE_MS - 1500));
    timers.push(setTimeout(() => setCursor(null), SLIDE_MS - 1300));

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-xl">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-ink">August 2026</p>
        <div className="flex gap-1 text-ink/40">
          <span className="flex h-6 w-6 items-center justify-center rounded-md border border-line text-xs">‹</span>
          <span className="flex h-6 w-6 items-center justify-center rounded-md border border-line text-xs">›</span>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-line bg-paper">
        <div className="grid grid-cols-7 border-b border-line bg-paper-alt text-[10px] font-semibold uppercase tracking-wide text-ink/50">
          {weekdays.map((d) => (
            <div key={d} className="px-2 py-1.5 text-center">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {calendarDays.map((day, i) => (
            <div
              key={i}
              className={`min-h-16 border-b border-r border-line px-1.5 py-1 text-[10px] last:border-r-0 ${
                day.inMonth ? "text-ink/70" : "text-ink/25"
              }`}
            >
              <span className="text-[10px]">{day.date}</span>
              {day.event && (
                <button
                  ref={day.date === DEMO_DAY && day.inMonth ? demoButtonRef : undefined}
                  type="button"
                  onClick={() => setSelected(day.event!)}
                  className="mt-1 flex w-full items-center gap-1 truncate rounded bg-paper-alt px-1 py-0.5 text-left transition-all hover:brightness-95"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: day.event.color }} />
                  <span className="truncate">{day.event.employee.split(" ")[0]}</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {cursor && (
        <div
          className="pointer-events-none absolute z-10 transition-all ease-out"
          style={{ left: cursor.x, top: cursor.y, transitionDuration: "1300ms" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--ink)" style={{ transform: "translate(-3px, -3px)" }}>
            <path d="M4 2l15 6.5-6 1.8-2.2 6.2z" />
          </svg>
          {clicking && <span className="absolute -inset-3 animate-ping rounded-full bg-brand/30" />}
        </div>
      )}

      {selected && <EventModal event={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

const ROW_ENTRANCES = ["translate(-60px, 0)", "translate(60px, 0)", "translate(0, -40px)"];

function TeamHoursSlide() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="mx-auto w-full max-w-xl space-y-3">
      {teamHours.map((person, i) => {
        const pct = Math.min(1, person.hours / person.max);
        const delay = i * 450;
        return (
          <div
            key={person.name}
            className="rounded-xl border border-line bg-paper px-4 py-3 transition-all ease-out"
            style={{
              opacity: shown ? 1 : 0,
              transform: shown ? "translate(0, 0)" : ROW_ENTRANCES[i % ROW_ENTRANCES.length],
              transitionDuration: "700ms",
              transitionDelay: `${delay}ms`,
            }}
          >
            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="font-semibold text-ink">{person.name}</p>
                <p className="text-xs text-ink/50">{person.role}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-ink">{person.hours.toFixed(2)} hrs</p>
                <p className="text-xs text-ink/50">
                  {person.timeIn} – {person.timeOut}
                </p>
              </div>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-paper-alt">
              <div
                className="h-full rounded-full bg-brand transition-all ease-out"
                style={{
                  width: shown ? `${pct * 100}%` : "0%",
                  transitionDuration: "1000ms",
                  transitionDelay: `${delay + 500}ms`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FadeSwap({ children }: { children: React.ReactNode }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="w-full transition-opacity ease-out" style={{ opacity: shown ? 1 : 0, transitionDuration: "1500ms" }}>
      {children}
    </div>
  );
}

const slides = [
  { label: "Hours", render: () => <MetricsRings /> },
  { label: "Schedule", render: () => <TimelineSlide /> },
  { label: "Team", render: () => <TeamHoursSlide /> },
];

export function MetricsSlides() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  // Counts automatic advances only (manual clicks don't consume the budget).
  // Once it reaches slides.length, one full lap has completed and auto-play stops.
  const [autoStep, setAutoStep] = useState(0);
  // Bumped on every fresh lap so FadeSwap remounts even when the reset lands
  // back on the same slide index (e.g. active was already 0 before leaving view).
  const [lapId, setLapId] = useState(0);
  const wasInView = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Every time the section newly enters view (scrolled away and back counts),
  // start a fresh lap through all three slides from the top.
  useEffect(() => {
    if (inView && !wasInView.current) {
      setActive(0);
      setAutoStep(0);
      setLapId((n) => n + 1);
    }
    wasInView.current = inView;
  }, [inView]);

  useEffect(() => {
    if (!inView || autoStep >= slides.length) return;
    const id = setTimeout(() => {
      setActive((i) => (i + 1) % slides.length);
      setAutoStep((s) => s + 1);
    }, SLIDE_MS);
    return () => clearTimeout(id);
  }, [inView, autoStep, active]);

  return (
    <div ref={ref} className="flex w-full flex-col items-center">
      <div className="flex min-h-72 w-full items-center justify-center">
        <FadeSwap key={`${lapId}-${active}`}>{slides[active].render()}</FadeSwap>
      </div>
      <div className="mt-8 flex gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.label}
            type="button"
            onClick={() => setActive(i)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition ${
              active === i ? "bg-brand-dark text-white" : "border border-line text-ink/60 hover:border-brand-light/50 hover:text-ink"
            }`}
          >
            {slide.label}
          </button>
        ))}
      </div>
    </div>
  );
}
