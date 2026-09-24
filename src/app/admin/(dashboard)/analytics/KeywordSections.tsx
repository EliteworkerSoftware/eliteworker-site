"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Section } from "./ui";

// Search Console queries + the target-keyword pipeline (the onproit.com
// standard): keywords arrive daily from Search Console or the content
// agent, you queue the ones worth chasing, the agent writes the content,
// and you publish it from Content Review.

interface SearchQuery {
  query: string;
  clicks: number;
  impressions: number;
  position: number;
  positionChange: number | null;
}

interface SearchQueryByPage {
  page: string;
  query: string;
  clicks: number;
  impressions: number;
  position: number;
  positionChange: number | null;
}

interface SearchConsoleData {
  configured: boolean;
  topQueries: SearchQuery[];
  topQueriesByPage: SearchQueryByPage[];
}

interface TrackedKeyword {
  id: string;
  keyword: string;
  target_url: string | null;
  priority: string;
  notes: string | null;
  source: string;
  status: string;
  last_impressions: number | null;
  last_clicks: number | null;
  last_position: number | null;
  last_synced_at: string | null;
  content_url: string | null;
  queued_at: string | null;
  content_published_at: string | null;
  created_at: string;
  seen_at: string | null;
  search_volume: number | null;
}

const PRIORITY_CLASSES: Record<string, string> = {
  high: "bg-red-50 text-red-600",
  medium: "bg-amber-50 text-amber-600",
  low: "bg-paper-alt text-ink/50",
};

const PRIORITY_LEGEND = [
  { key: "high", text: "50+ searches in 30 days and already ranking within reach of page 1 (position ≤30) — the best opportunities." },
  { key: "medium", text: "15+ searches in 30 days, ranking further out — worth a look." },
  { key: "low", text: "Fewer than 15 searches." },
];

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  new: { label: "New", className: "bg-green-600 text-white" },
  discovered: { label: "Discovered", className: "bg-paper-alt text-ink/50" },
  queued: { label: "Queued for content", className: "bg-brand/10 text-brand" },
  in_review: { label: "Ready for review", className: "bg-purple-50 text-purple-600" },
  done: { label: "Done", className: "bg-green-50 text-green-700" },
};

const SOURCE_LABEL: Record<string, string> = {
  search_console: "from Search Console",
  agent: "suggested by agent",
  manual: "added by you",
};

const PAGE_SIZE = 20;

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function PositionChange({ change }: { change: number | null }) {
  if (change === null) return <span className="text-ink/40">new</span>;
  if (Math.abs(change) < 0.05) return <span className="text-ink/40">±0</span>;
  return (
    <span className={change > 0 ? "font-medium text-green-600" : "font-medium text-red-600"}>
      {change > 0 ? "+" : "-"}
      {Math.abs(change).toFixed(1)}
    </span>
  );
}

function Badge({ className, children }: { className: string; children: React.ReactNode }) {
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${className}`}>{children}</span>;
}

export function KeywordSections({ from, to }: { from: string; to: string }) {
  const [searchData, setSearchData] = useState<SearchConsoleData | null>(null);
  const [keywords, setKeywords] = useState<TrackedKeyword[] | null>(null);
  const [keywordsError, setKeywordsError] = useState("");
  // Keywords unseen when this visit loaded them — kept for the whole visit
  // so the "New" badge doesn't vanish the moment it's marked seen.
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const reportedSeen = useRef(new Set<string>());

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/search-console?from=${from}&to=${to}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!cancelled && json) setSearchData(json);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [from, to]);

  function receive(list: TrackedKeyword[]) {
    setKeywords(list);
    setNewIds((prev) => {
      const next = new Set(prev);
      for (const k of list) if (!k.seen_at) next.add(k.id);
      return next;
    });
  }

  async function fetchKeywords() {
    const res = await fetch("/api/admin/keywords");
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to load keywords");
    return json.keywords as TrackedKeyword[];
  }

  async function load() {
    try {
      receive(await fetchKeywords());
    } catch (err) {
      setKeywordsError(err instanceof Error ? err.message : "Failed to load keywords");
    }
  }

  useEffect(() => {
    let cancelled = false;
    fetchKeywords()
      .then((list) => {
        if (!cancelled) receive(list);
      })
      .catch((err) => {
        if (!cancelled) setKeywordsError(err instanceof Error ? err.message : "Failed to load keywords");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function setStatus(id: string, status: string, content_url?: string) {
    await fetch(`/api/admin/keywords/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, ...(content_url !== undefined ? { content_url } : {}) }),
    });
    load();
  }

  function markDone(id: string) {
    const url = window.prompt("URL of the published content for this keyword (leave blank if none)");
    if (url === null) return;
    setStatus(id, "done", url.trim() || undefined);
  }

  async function remove(id: string) {
    if (!confirm("Stop tracking this keyword?")) return;
    await fetch(`/api/admin/keywords/${id}`, { method: "DELETE" });
    load();
  }

  async function add(e: FormEvent) {
    e.preventDefault();
    if (!newKeyword.trim()) return;
    setAdding(true);
    setAddError("");
    const res = await fetch("/api/admin/keywords", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword: newKeyword }),
    });
    const json = await res.json().catch(() => ({}));
    setAdding(false);
    if (!res.ok) {
      setAddError(json.error || "Failed to add keyword");
      return;
    }
    setNewKeyword("");
    setShowAddForm(false);
    load();
  }

  const isNew = (k: TrackedKeyword) => k.status === "discovered" && newIds.has(k.id);

  const inProgress = useMemo(
    () =>
      (keywords ?? [])
        .filter((k) => k.status === "queued" || k.status === "in_review" || k.status === "done")
        .sort((a, b) =>
          (b.content_published_at || b.queued_at || b.created_at).localeCompare(a.content_published_at || a.queued_at || a.created_at)
        ),
    [keywords]
  );

  const counts = useMemo(() => {
    const list = keywords ?? [];
    return {
      total: list.length,
      new: list.filter((k) => k.status === "discovered" && newIds.has(k.id)).length,
      queued: list.filter((k) => k.status === "queued").length,
      high: list.filter((k) => k.priority === "high").length,
      done: list.filter((k) => k.status === "done").length,
    };
  }, [keywords, newIds]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (keywords ?? []).filter((k) => {
      if (q && !k.keyword.toLowerCase().includes(q)) return false;
      if (statusFilter === "new") {
        if (k.status !== "discovered" || !newIds.has(k.id)) return false;
      } else if (statusFilter !== "all" && k.status !== statusFilter) return false;
      if (priorityFilter !== "all" && k.priority !== priorityFilter) return false;
      return true;
    });
  }, [keywords, newIds, search, statusFilter, priorityFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Mark what's actually on screen as seen — only the current page.
  useEffect(() => {
    const ids = paged.filter((k) => !k.seen_at && !reportedSeen.current.has(k.id)).map((k) => k.id);
    if (ids.length === 0) return;
    for (const id of ids) reportedSeen.current.add(id);
    fetch("/api/admin/keywords/seen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    }).catch(() => {});
  }, [paged]);

  function filterTo(setter: (v: string) => void, value: string) {
    setter(value);
    setPage(1);
  }

  const hasFilters = search !== "" || statusFilter !== "all" || priorityFilter !== "all";
  const selectClasses = "rounded-lg border border-line bg-paper px-2 py-1.5 text-sm text-ink";
  const actionClasses = "text-xs font-medium hover:underline";

  function stats(k: TrackedKeyword) {
    const parts = [];
    if (k.last_impressions != null) {
      parts.push(`${k.last_impressions} searches (30d) · #${Number(k.last_position).toFixed(1)} avg position · ${k.last_clicks} clicked`);
    } else {
      parts.push("No Search Console data yet");
    }
    if (k.search_volume != null) parts.push(`~${k.search_volume.toLocaleString()}/mo Google searches`);
    parts.push(`added ${formatTimestamp(k.created_at)}`);
    return parts.join(" · ");
  }

  return (
    <>
      {searchData?.configured && (
        <Section
          storageKey="search-queries"
          title="Top search queries & landing pages"
          defaultOpen={false}
          meta={
            <span className="text-xs text-ink/40">
              ({searchData.topQueries.length} queries · {searchData.topQueriesByPage.length} pages)
            </span>
          }
          tooltip="Real searches people typed into Google where eliteworker.com showed up, from Search Console, for the date range above. Position is where you ranked (#1 is the top); the green/red number is the change vs. the previous period of the same length."
        >
          <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold tracking-wide text-ink/40 uppercase">Top queries</p>
              {searchData.topQueries.length === 0 ? (
                <p className="mt-3 text-sm text-ink/50">No search data for this range yet.</p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {searchData.topQueries.map((q) => (
                    <li key={q.query} className="text-sm">
                      <p className="text-ink/80">{q.query}</p>
                      <p className="mt-0.5 text-xs text-ink/40">
                        {q.impressions} shown · {q.clicks} clicked · #{q.position.toFixed(1)} avg (
                        <PositionChange change={q.positionChange} /> vs. prior period)
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wide text-ink/40 uppercase">Top query by landing page</p>
              {searchData.topQueriesByPage.length === 0 ? (
                <p className="mt-3 text-sm text-ink/50">No search data for this range yet.</p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {searchData.topQueriesByPage.map((p) => {
                    const path = new URL(p.page).pathname;
                    return (
                      <li key={p.page} className="text-sm">
                        <p className="font-medium text-ink">{path === "/" ? "Home (/)" : path}</p>
                        <p className="text-ink/70">&ldquo;{p.query}&rdquo;</p>
                        <p className="mt-0.5 text-xs text-ink/40">
                          {p.clicks} clicked · #{p.position.toFixed(1)} avg (<PositionChange change={p.positionChange} />)
                        </p>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </Section>
      )}

      <Section
        storageKey="content-effort"
        title="Content effort"
        tooltip="Every keyword you've queued or finished content for, most recent first. The content agent writes queued keywords on its next morning run; the status flips to 'Ready for review', nothing goes live until you publish it, and publishing marks it done with the live URL."
      >
        {!keywords ? (
          <p className="mt-4 text-sm text-ink/50">{keywordsError || "Loading…"}</p>
        ) : inProgress.length === 0 ? (
          <p className="mt-4 text-sm text-ink/50">Nothing queued yet — queue a keyword below to have content written for it.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line">
            {inProgress.map((k) => (
              <li key={k.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-ink">{k.keyword}</span>
                    <Badge className={STATUS_BADGE[k.status]?.className ?? ""}>{STATUS_BADGE[k.status]?.label ?? k.status}</Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-ink/50">
                    {k.status === "queued" && k.queued_at && `Queued ${formatTimestamp(k.queued_at)} — written on the next morning run`}
                    {k.status === "in_review" && "Content is written and waiting for you to review and publish"}
                    {k.status === "done" &&
                      (k.content_url ? (
                        <>
                          Published{k.content_published_at ? ` ${formatTimestamp(k.content_published_at)}` : ""}:{" "}
                          <a href={k.content_url} target="_blank" rel="noopener noreferrer" className="text-brand underline">
                            {k.content_url}
                          </a>
                        </>
                      ) : (
                        "Marked done"
                      ))}
                    {k.last_position != null && ` · now #${Number(k.last_position).toFixed(1)} avg position`}
                  </p>
                </div>
                {(k.status === "queued" || k.status === "in_review") && (
                  <div className="flex shrink-0 gap-3">
                    <button onClick={() => markDone(k.id)} className={`${actionClasses} text-green-700`}>
                      Mark done
                    </button>
                    <button
                      onClick={() => setStatus(k.id, k.status === "in_review" ? "queued" : "discovered")}
                      className={`${actionClasses} text-ink/50`}
                    >
                      {k.status === "in_review" ? "Send back to queue" : "Unqueue"}
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section
        storageKey="target-keywords"
        title="Target keywords"
        meta={keywords ? <span className="text-xs text-ink/40">({counts.total})</span> : undefined}
        tooltip="Fills itself: a daily job pulls every real search Search Console sees for the site (3+ impressions in 30 days), and the content agent adds weekly suggestions. Green 'New' = you haven't seen it yet. Queue anything worth chasing — the content agent picks it up on its next morning run."
      >
        {!keywords ? (
          <p className="mt-4 text-sm text-ink/50">{keywordsError || "Loading…"}</p>
        ) : (
          <>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              {counts.new > 0 && (
                <button
                  onClick={() => filterTo(setStatusFilter, "new")}
                  className="rounded-full bg-green-600 px-3 py-1 font-medium text-white hover:bg-green-700"
                >
                  {counts.new} new
                </button>
              )}
              <button onClick={() => filterTo(setStatusFilter, "queued")} className="rounded-full bg-brand/10 px-3 py-1 font-medium text-brand">
                {counts.queued} queued
              </button>
              <button onClick={() => filterTo(setPriorityFilter, "high")} className="rounded-full bg-red-50 px-3 py-1 font-medium text-red-600">
                {counts.high} high priority
              </button>
              <button onClick={() => filterTo(setStatusFilter, "done")} className="rounded-full bg-green-50 px-3 py-1 font-medium text-green-700">
                {counts.done} done
              </button>
              <button
                onClick={() => setShowAddForm((v) => !v)}
                className="ml-auto rounded-lg border border-line px-3 py-1 font-medium text-ink/60 hover:border-brand hover:text-brand"
              >
                {showAddForm ? "Cancel" : "+ Add keyword"}
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={add} className="mt-3 flex flex-wrap items-center gap-2">
                <input
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="e.g. scheduling software for av integrators"
                  className="min-w-60 flex-1 rounded-lg border border-line bg-paper px-3 py-1.5 text-sm text-ink"
                />
                <button
                  type="submit"
                  disabled={adding}
                  className="rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50"
                >
                  {adding ? "Adding…" : "Add"}
                </button>
                {addError && <p className="w-full text-xs text-red-500">{addError}</p>}
              </form>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <input
                value={search}
                onChange={(e) => filterTo(setSearch, e.target.value)}
                placeholder="Search keywords…"
                className="min-w-40 flex-1 rounded-lg border border-line bg-paper px-2 py-1.5 text-sm text-ink"
              />
              <select value={statusFilter} onChange={(e) => filterTo(setStatusFilter, e.target.value)} className={selectClasses}>
                <option value="all">All statuses</option>
                <option value="new">New (not seen yet)</option>
                <option value="discovered">Discovered</option>
                <option value="queued">Queued</option>
                <option value="in_review">Ready for review</option>
                <option value="done">Done</option>
              </select>
              <select value={priorityFilter} onChange={(e) => filterTo(setPriorityFilter, e.target.value)} className={selectClasses}>
                <option value="all">All priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              {hasFilters && (
                <button
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                    setPriorityFilter("all");
                    setPage(1);
                  }}
                  className="text-xs font-medium text-ink/50 hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>

            <div className="mt-3 flex flex-col gap-1.5 text-xs sm:flex-row sm:flex-wrap sm:gap-4">
              {PRIORITY_LEGEND.map((p) => (
                <div key={p.key} className="flex items-start gap-2 sm:max-w-64">
                  <Badge className={PRIORITY_CLASSES[p.key]}>{p.key}</Badge>
                  <span className="text-ink/50">{p.text}</span>
                </div>
              ))}
            </div>

            {keywords.length === 0 ? (
              <p className="mt-4 text-sm text-ink/50">
                Nothing yet — the daily Search Console sync hasn&apos;t found a search with 3+ impressions, or it isn&apos;t
                connected yet.
              </p>
            ) : filtered.length === 0 ? (
              <p className="mt-4 text-sm text-ink/50">No keywords match these filters.</p>
            ) : (
              <ul className="mt-4 divide-y divide-line">
                {paged.map((k) => {
                  const status = isNew(k) ? STATUS_BADGE.new : STATUS_BADGE[k.status] ?? STATUS_BADGE.discovered;
                  return (
                    <li key={k.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-ink">{k.keyword}</span>
                          <Badge className={PRIORITY_CLASSES[k.priority] ?? PRIORITY_CLASSES.medium}>{k.priority}</Badge>
                          <Badge className={status.className}>{status.label}</Badge>
                          <span className="text-[10px] tracking-wide text-ink/40 uppercase">{SOURCE_LABEL[k.source] ?? k.source}</span>
                        </div>
                        <p className="mt-0.5 text-xs text-ink/50">{stats(k)}</p>
                        {k.notes && k.source === "agent" && <p className="mt-0.5 text-xs text-ink/40 italic">{k.notes}</p>}
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        {k.status === "discovered" && (
                          <button onClick={() => setStatus(k.id, "queued")} className={`${actionClasses} text-brand`}>
                            Queue for content
                          </button>
                        )}
                        {k.status === "queued" && (
                          <button onClick={() => setStatus(k.id, "discovered")} className={`${actionClasses} text-ink/50`}>
                            Unqueue
                          </button>
                        )}
                        <button onClick={() => remove(k.id)} className={`${actionClasses} text-red-500`}>
                          Remove
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="text-xs font-medium text-ink/60 hover:underline disabled:cursor-not-allowed disabled:text-ink/20"
                >
                  ← Previous
                </button>
                <span className="text-xs text-ink/40">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
    </>
  );
}
