"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  Bot,
  CalendarCheck,
  ChevronDown,
  ClipboardList,
  Eye,
  Inbox,
  Info,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";

interface TimelineEvent {
  type: "page" | "click";
  path: string;
  label: string | null;
  durationSeconds: number | null;
  timestamp: string;
}

interface VisitorSession {
  sessionId: string;
  firstSeen: string;
  lastSeen: string;
  pageCount: number;
  clicks: number;
  totalDurationSeconds: number;
  os: "Apple" | "Android" | "Windows" | "Other";
  formFactor: "Phone" | "Tablet" | "Desktop";
  city: string | null;
  region: string | null;
  country: string | null;
  entrySource: string;
  timeline: TimelineEvent[];
}

interface Conversion {
  total: number;
  recent: number | null;
}

interface Counted {
  label: string;
  count: number;
}

interface AnalyticsData {
  totalViews: number;
  recentViews: number | null;
  visitors: number;
  mobilePct: number;
  demoBookings: Conversion;
  betaSignups: Conversion;
  leads: Conversion;
  viewsByDay: { day: string; count: number }[];
  viewsByHour: { hour: number; count: number }[];
  viewsByDayOfWeek: { day: string; count: number }[];
  topPages: Counted[];
  trafficSources: Counted[];
  topLocations: Counted[];
  topClicks: Counted[];
  botViews: number;
  topBotAgents: { agent: string; count: number; lastSeen: string }[];
  sessions: VisitorSession[];
}

const WEEKDAY_ABBR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SESSIONS_PAGE_SIZE = 10;
const RANGE_PRESETS = [
  { label: "Today", days: 0 },
  { label: "Last 7 days", days: 6 },
  { label: "Last 30 days", days: 29 },
  { label: "Last 90 days", days: 89 },
];

function isoDateNDaysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function formatDayLabel(isoDay: string) {
  const [year, month, day] = isoDay.split("-").map(Number);
  // UTC, matching the server's UTC-day bucketing.
  return { weekday: WEEKDAY_ABBR[new Date(Date.UTC(year, month - 1, day)).getUTCDay()], date: `${month}/${day}` };
}

function formatHour(hour: number) {
  if (hour === 0) return "12am";
  if (hour === 12) return "12pm";
  return hour < 12 ? `${hour}am` : `${hour - 12}pm`;
}

function formatDuration(seconds: number) {
  if (!seconds || seconds < 1) return "—";
  if (seconds < 60) return `${Math.round(seconds)}s`;
  return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
}

function formatLocation(s: { city: string | null; region: string | null; country: string | null }) {
  if (!s.city || !s.region || !s.country) return "Unknown location";
  return [s.city, s.region, s.country].join(", ");
}

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function pathLabel(path: string) {
  return path === "/" ? "Home (/)" : path;
}

function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setOpen(false)}
        aria-label="More info"
        className="flex items-center justify-center text-ink/30 hover:text-ink/60"
      >
        <Info size={14} />
      </button>
      {open && (
        <span className="absolute left-1/2 top-full z-20 mt-2 w-64 -translate-x-1/2 rounded-lg bg-ink px-3 py-2 text-xs leading-snug font-normal text-white shadow-lg">
          {text}
        </span>
      )}
    </span>
  );
}

const SECTION_STORAGE_PREFIX = "ew-analytics-open:";
const TOGGLE_ALL_EVENT = "ew-analytics-toggle-all";

// A collapsible section. Remembers open/closed per browser and follows the
// page's Collapse all / Expand all.
function Section({
  storageKey,
  title,
  tooltip,
  meta,
  defaultOpen = true,
  className = "",
  children,
}: {
  storageKey: string;
  title: string;
  tooltip?: string;
  meta?: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    try {
      const saved = localStorage.getItem(SECTION_STORAGE_PREFIX + storageKey);
      if (saved !== null) el.open = saved === "1";
    } catch {
      // storage unavailable — keep the default
    }
    const onToggleAll = (e: Event) => {
      el.open = (e as CustomEvent<boolean>).detail;
    };
    window.addEventListener(TOGGLE_ALL_EVENT, onToggleAll);
    return () => window.removeEventListener(TOGGLE_ALL_EVENT, onToggleAll);
  }, [storageKey]);

  return (
    <details
      ref={ref}
      open={defaultOpen}
      onToggle={(e) => {
        try {
          localStorage.setItem(SECTION_STORAGE_PREFIX + storageKey, e.currentTarget.open ? "1" : "0");
        } catch {
          // storage unavailable — state just won't persist
        }
      }}
      className={`group self-start border-t border-line pt-5 ${className}`}
    >
      <summary
        // Clicking the (i) button shouldn't also collapse the section.
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("button")) e.preventDefault();
        }}
        className="flex cursor-pointer list-none items-center gap-2 [&::-webkit-details-marker]:hidden"
      >
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        {meta}
        {tooltip && <InfoTooltip text={tooltip} />}
        <ChevronDown size={16} className="ml-auto shrink-0 text-ink/30 transition-transform group-open:rotate-180" />
      </summary>
      <div className="pb-2">{children}</div>
    </details>
  );
}

function Metric({
  icon: Icon,
  tint,
  label,
  value,
  recent,
  tooltip,
}: {
  icon: LucideIcon;
  tint: string;
  label: string;
  value: string | number;
  recent?: number | null;
  tooltip: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Icon size={18} strokeWidth={2.25} className={tint} />
        <InfoTooltip text={tooltip} />
      </div>
      <p className="font-display mt-3 text-3xl font-bold text-ink">{value}</p>
      <p className="mt-1 text-sm text-ink/50">{label}</p>
      {recent != null && <p className="mt-0.5 text-xs text-ink/40">{recent} in the last 7 days</p>}
    </div>
  );
}

function RankedList({ items, empty, format = (s) => s }: { items: Counted[]; empty: string; format?: (s: string) => string }) {
  if (items.length === 0) return <p className="mt-4 text-sm text-ink/50">{empty}</p>;
  const max = Math.max(...items.map((i) => i.count));
  return (
    <ul className="mt-4 space-y-2.5">
      {items.map((i) => (
        <li key={i.label} className="text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="truncate text-ink/80">{format(i.label)}</span>
            <span className="shrink-0 font-medium text-ink">{i.count}</span>
          </div>
          <div className="mt-1 h-1 rounded-full bg-line">
            <div className="h-1 rounded-full bg-brand/60" style={{ width: `${(i.count / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function BarChart({
  bars,
  heightClass,
  gapClass,
}: {
  bars: { key: string; count: number; tip: string }[];
  heightClass: string;
  gapClass: string;
}) {
  const max = Math.max(1, ...bars.map((b) => b.count));
  return (
    <div className="mt-4 flex gap-2">
      <div className={`flex ${heightClass} w-8 shrink-0 flex-col justify-between text-right text-[10px] leading-none text-ink/40`}>
        <span>{max}</span>
        <span>{Math.round(max / 2)}</span>
        <span>0</span>
      </div>
      <div className={`flex ${heightClass} flex-1 items-end ${gapClass} border-l border-line pl-2`}>
        {bars.map((b) => (
          <div key={b.key} className="group relative h-full flex-1">
            <div
              className="absolute bottom-0 w-full rounded-t bg-brand transition-colors group-hover:bg-brand-dark"
              style={{ height: `${Math.max(3, (b.count / max) * 100)}%` }}
            />
            <div className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 rounded bg-ink px-2 py-1 text-xs whitespace-nowrap text-white group-hover:block">
              {b.tip}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const FORM_FACTOR_ICON = { Phone: Smartphone, Tablet: Tablet, Desktop: Monitor };

function DeviceBadge({ os, formFactor }: { os: VisitorSession["os"]; formFactor: VisitorSession["formFactor"] }) {
  const FormIcon = FORM_FACTOR_ICON[formFactor];
  return (
    <span className="inline-flex items-center gap-1.5 text-ink/80">
      {os === "Apple" && <Image src="/brands/apple.svg" alt="Apple" width={14} height={14} className="h-3.5 w-3.5" />}
      {os === "Android" && <Image src="/brands/android.svg" alt="Android" width={14} height={14} className="h-3.5 w-3.5" />}
      <FormIcon size={14} className="text-ink/50" />
      {formFactor}
    </span>
  );
}

function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="space-y-2">
      {events.map((e, i) => (
        <li key={i} className="flex items-start gap-3 text-sm">
          <span className="mt-0.5 w-20 shrink-0 text-xs text-ink/40">
            {new Date(e.timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" })}
          </span>
          {e.type === "page" ? (
            <span className="text-ink/70">
              Viewed <span className="font-medium text-ink">{pathLabel(e.path)}</span>
              {e.durationSeconds != null && <span className="text-ink/40"> — {formatDuration(e.durationSeconds)}</span>}
            </span>
          ) : (
            <span className="text-ink/70">
              <span className="font-medium text-accent">Clicked</span> &quot;{e.label ?? "unlabeled"}&quot;
              <span className="text-ink/40"> on {pathLabel(e.path)}</span>
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState("");
  const [from, setFrom] = useState(isoDateNDaysAgo(29));
  const [to, setTo] = useState(isoDateNDaysAgo(0));
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [sessionsPage, setSessionsPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/admin/analytics?from=${from}&to=${to}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load analytics");
        if (!cancelled) {
          setError("");
          setData(json);
          setSessionsPage(1);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load analytics");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [from, to]);

  function toggleAll(open: boolean) {
    window.dispatchEvent(new CustomEvent(TOGGLE_ALL_EVENT, { detail: open }));
  }

  function toggleSession(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Under 8 days each weekday appears at most once, so the weekday chart
  // would just repeat the daily one.
  const rangeDays = Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86400000) + 1;
  const totalPages = data ? Math.max(1, Math.ceil(data.sessions.length / SESSIONS_PAGE_SIZE)) : 1;
  const currentPage = Math.min(sessionsPage, totalPages);
  const pagedSessions = data
    ? data.sessions.slice((currentPage - 1) * SESSIONS_PAGE_SIZE, currentPage * SESSIONS_PAGE_SIZE)
    : [];

  const inputClasses = "rounded-lg border border-line bg-paper px-2 py-1 text-sm text-ink";
  const chipClasses = "rounded-lg border border-line px-3 py-1 text-xs font-medium text-ink/60 hover:border-brand hover:text-brand";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs font-medium text-ink/50">
          From
          <input type="date" value={from} max={to} onChange={(e) => setFrom(e.target.value)} className={inputClasses} />
        </label>
        <label className="flex items-center gap-2 text-xs font-medium text-ink/50">
          To
          <input
            type="date"
            value={to}
            min={from}
            max={isoDateNDaysAgo(0)}
            onChange={(e) => setTo(e.target.value)}
            className={inputClasses}
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {RANGE_PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => {
                setFrom(isoDateNDaysAgo(p.days));
                setTo(isoDateNDaysAgo(0));
              }}
              className={chipClasses}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-2">
          <button onClick={() => toggleAll(false)} className={chipClasses}>
            Collapse all
          </button>
          <button onClick={() => toggleAll(true)} className={chipClasses}>
            Expand all
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {!data ? (
        !error && <p className="text-sm text-ink/50">Loading…</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-5">
            <Metric
              icon={Eye}
              tint="text-ink/60"
              label={`Page views · ${data.visitors} visitors`}
              value={data.totalViews}
              recent={data.recentViews}
              tooltip="Page loads by real people in the range (suspected bots are counted separately at the bottom). Visitors = distinct browser sessions."
            />
            <Metric
              icon={CalendarCheck}
              tint="text-teal"
              label="Demo bookings"
              value={data.demoBookings.total}
              recent={data.demoBookings.recent}
              tooltip="Demos booked on the site in this range (by when they were booked, not when the demo happens)."
            />
            <Metric
              icon={ClipboardList}
              tint="text-accent"
              label="Beta applications"
              value={data.betaSignups.total}
              recent={data.betaSignups.recent}
              tooltip="Beta program applications submitted in this range."
            />
            <Metric
              icon={Inbox}
              tint="text-brand"
              label="Contact leads"
              value={data.leads.total}
              recent={data.leads.recent}
              tooltip="Contact form submissions saved in this range."
            />
            <Metric
              icon={Smartphone}
              tint="text-ink/60"
              label="Mobile visitors"
              value={`${data.mobilePct}%`}
              tooltip="Share of page views from a phone or other mobile device."
            />
          </div>

          <Section
            storageKey="views-per-day"
            title="Views per day"
            tooltip="Page views for each calendar day in the range (UTC days). Shows the trend — spikes, dips, and the effect of anything you changed on a given date."
          >
            {data.viewsByDay.length === 0 ? (
              <p className="mt-4 text-sm text-ink/50">No page views recorded yet.</p>
            ) : (
              <>
                <BarChart
                  heightClass="h-40"
                  gapClass="gap-1"
                  bars={data.viewsByDay.map((d) => ({ key: d.day, count: d.count, tip: `${d.day}: ${d.count}` }))}
                />
                <div className="mt-2 flex gap-1 pl-12">
                  {data.viewsByDay.map((d) => {
                    const { weekday, date } = formatDayLabel(d.day);
                    return (
                      <div key={d.day} className="flex flex-1 flex-col items-center leading-tight">
                        <span className="text-[9px] font-medium text-ink/50">{weekday}</span>
                        <span className="text-[9px] text-ink/40">{date}</span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </Section>

          <div className={`grid grid-cols-1 gap-8 ${rangeDays > 7 ? "lg:grid-cols-2" : ""}`}>
            <Section
              storageKey="time-of-day"
              title="Views by time of day"
              tooltip="Page views bucketed by hour (Eastern time), summed across the range — when prospects tend to browse."
            >
              <BarChart
                heightClass="h-32"
                gapClass="gap-0.5"
                bars={data.viewsByHour.map((d) => ({ key: String(d.hour), count: d.count, tip: `${formatHour(d.hour)}: ${d.count}` }))}
              />
              <div className="mt-1 flex gap-0.5 pl-12">
                {data.viewsByHour.map((d) => (
                  <div key={d.hour} className="flex-1 text-center text-[9px] text-ink/40">
                    {d.hour % 3 === 0 && formatHour(d.hour)}
                  </div>
                ))}
              </div>
            </Section>
            {rangeDays > 7 && (
              <Section
                storageKey="day-of-week"
                title="Views by day of week"
                tooltip="Page views by weekday (Eastern time), each weekday's occurrences added together — which day performs best on average."
              >
                <BarChart
                  heightClass="h-32"
                  gapClass="gap-2"
                  bars={data.viewsByDayOfWeek.map((d) => ({ key: d.day, count: d.count, tip: String(d.count) }))}
                />
                <div className="mt-1 flex gap-2 pl-12">
                  {data.viewsByDayOfWeek.map((d) => (
                    <div key={d.day} className="flex-1 text-center text-[10px] text-ink/40">
                      {d.day}
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Section storageKey="top-pages" title="Top pages" tooltip="Most-viewed pages in the range.">
              <RankedList items={data.topPages} empty="No page views recorded yet." format={pathLabel} />
            </Section>
            <Section
              storageKey="traffic-sources"
              title="Traffic sources"
              tooltip="How visitors arrived: Direct (typed the URL, a bookmark, or no referrer sent — e.g. links in texts or some email apps), a named search engine, an AI assistant (ChatGPT, Perplexity…), Social, or a Referral from another site."
            >
              <RankedList items={data.trafficSources} empty="No page views recorded yet." />
            </Section>
            <Section
              storageKey="top-clicks"
              title="Most-clicked buttons & links"
              tooltip="Every link and button click on the site, by its visible label — shows which calls to action (Book a demo, Join the beta…) actually get clicked."
            >
              <RankedList items={data.topClicks} empty="No clicks recorded yet." />
            </Section>
            <Section
              storageKey="top-locations"
              title="Top locations"
              tooltip="Visitor city/state/country from their IP address, only when all three could be determined. VPNs and some carriers can't be resolved this precisely and are left out here (still counted in page views)."
            >
              <RankedList items={data.topLocations} empty="No location data recorded yet." />
            </Section>
          </div>

          <Section
            storageKey="recent-visitors"
            title="Recent visitors"
            meta={<span className="text-xs text-ink/40">({data.sessions.length})</span>}
            tooltip="One row per browser session. Click a row for the full journey — every page, time on each, and every button or link clicked, in order."
          >
            {data.sessions.length === 0 ? (
              <p className="mt-4 text-sm text-ink/50">No visitor sessions recorded yet.</p>
            ) : (
              <>
                <div className="mt-4 hidden overflow-x-auto sm:block">
                  <table className="w-full min-w-180 text-left text-sm">
                    <thead>
                      <tr className="border-b border-line text-xs tracking-wide text-ink/40 uppercase">
                        <th className="pr-4 pb-2 font-medium">First seen</th>
                        <th className="pr-4 pb-2 font-medium">Location</th>
                        <th className="pr-4 pb-2 font-medium">Source</th>
                        <th className="pr-4 pb-2 font-medium">Device</th>
                        <th className="pr-4 pb-2 font-medium">Pages</th>
                        <th className="pr-4 pb-2 font-medium">Clicks</th>
                        <th className="pr-4 pb-2 font-medium">Time on site</th>
                        <th className="pb-2" />
                      </tr>
                    </thead>
                    <tbody>
                      {pagedSessions.map((s) => {
                        const open = expanded.has(s.sessionId);
                        return (
                          <Fragment key={s.sessionId}>
                            <tr
                              onClick={() => toggleSession(s.sessionId)}
                              className="cursor-pointer border-b border-line/60 hover:bg-paper-alt"
                            >
                              <td className="py-2 pr-4 text-ink/80">{formatTimestamp(s.firstSeen)}</td>
                              <td className="py-2 pr-4 text-ink/80">{formatLocation(s)}</td>
                              <td className="py-2 pr-4 text-ink/80">{s.entrySource}</td>
                              <td className="py-2 pr-4">
                                <DeviceBadge os={s.os} formFactor={s.formFactor} />
                              </td>
                              <td className="py-2 pr-4 text-ink/80">{s.pageCount}</td>
                              <td className="py-2 pr-4 font-medium text-brand">{s.clicks}</td>
                              <td className="py-2 pr-4 text-ink/80">{formatDuration(s.totalDurationSeconds)}</td>
                              <td className="py-2">
                                <ChevronDown size={16} className={`text-ink/30 transition-transform ${open ? "rotate-180" : ""}`} />
                              </td>
                            </tr>
                            {open && (
                              <tr className="border-b border-line/60 bg-paper-alt">
                                <td colSpan={8} className="px-4 py-4">
                                  <Timeline events={s.timeline} />
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 space-y-3 sm:hidden">
                  {pagedSessions.map((s) => {
                    const open = expanded.has(s.sessionId);
                    return (
                      <div key={s.sessionId} className="border-b border-line pb-3">
                        <button
                          onClick={() => toggleSession(s.sessionId)}
                          className="flex w-full items-center justify-between gap-3 text-left"
                        >
                          <div>
                            <p className="text-sm font-medium text-ink">{formatTimestamp(s.firstSeen)}</p>
                            <p className="text-xs text-ink/50">
                              {formatLocation(s)} · {s.entrySource}
                            </p>
                            <p className="mt-1 text-xs text-ink/50">
                              {s.pageCount} pages · {s.clicks} clicks · {formatDuration(s.totalDurationSeconds)}
                            </p>
                          </div>
                          <ChevronDown size={16} className={`shrink-0 text-ink/30 transition-transform ${open ? "rotate-180" : ""}`} />
                        </button>
                        {open && (
                          <div className="mt-3">
                            <Timeline events={s.timeline} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3">
                    <button
                      onClick={() => setSessionsPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage <= 1}
                      className="text-xs font-medium text-ink/60 hover:underline disabled:cursor-not-allowed disabled:text-ink/20"
                    >
                      ← Previous
                    </button>
                    <span className="text-xs text-ink/40">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setSessionsPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage >= totalPages}
                      className="text-xs font-medium text-ink/60 hover:underline disabled:cursor-not-allowed disabled:text-ink/20"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </Section>

          <Section
            storageKey="bot-traffic"
            title="Potential bot traffic"
            defaultOpen={false}
            meta={
              <span className="flex items-center gap-1 text-xs text-ink/40">
                <Bot size={12} /> {data.botViews} requests
              </span>
            }
            tooltip="Requests whose User-Agent self-identifies or pattern-matches a crawler, script, or monitoring tool. Excluded from every number above. A bot disguised as a real browser looks human and isn't caught."
          >
            {data.topBotAgents.length === 0 ? (
              <p className="mt-4 text-sm text-ink/50">No suspected bot traffic in this range.</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {data.topBotAgents.map((b) => (
                  <li key={b.agent} className="flex items-start justify-between gap-4 text-sm">
                    <span className="min-w-0 break-all text-ink/70">{b.agent}</span>
                    <span className="shrink-0 text-right text-xs text-ink/50">
                      <span className="font-medium text-ink">{b.count}</span> · last {formatTimestamp(b.lastSeen)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </>
      )}
    </div>
  );
}
