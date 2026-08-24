"use client";

import { Fragment, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown, ChevronRight, Filter, Trash2, MailOpen, Mail } from "lucide-react";
import { STATUS_OPTIONS, type TriageTable, type AnyStatus } from "@/lib/adminTriage";
import { StatusBadge, statusLabel } from "./StatusBadge";

export type Column<T> = { key: string; label: string; render: (row: T) => ReactNode; className?: string };

// Passed into renderExpanded so a resource-specific panel (e.g. the reply
// box) can reflect a status change the server already made as a side effect
// (e.g. a lead reply auto-marking "contacted") without a second PATCH round-trip.
export type ExpandedHelpers = { setLocalStatus: (status: AnyStatus) => void };

type Accent = "brand" | "accent" | "teal";

// Tailwind v4 needs statically-discoverable class names — never build these
// via string interpolation like `bg-${accent}`.
const ACCENT_STYLES: Record<Accent, { border: string; ring: string }> = {
  brand: { border: "border-l-brand", ring: "focus:border-brand" },
  accent: { border: "border-l-accent", ring: "focus:border-accent" },
  teal: { border: "border-l-teal", ring: "focus:border-teal" },
};

type BaseRow = { id: string; is_read: boolean; pipeline_status: AnyStatus };

async function parseJsonSafe(res: Response): Promise<{ error?: string; [key: string]: unknown }> {
  try {
    return await res.json();
  } catch {
    return { error: `Unexpected response from server (${res.status})` };
  }
}

export function ResourceTable<T extends BaseRow>({
  initialRows,
  apiBase,
  statusTable,
  columns,
  renderExpanded,
  accent,
  canDelete,
  emptyLabel,
}: {
  initialRows: T[];
  apiBase: string;
  statusTable: TriageTable;
  columns: Column<T>[];
  renderExpanded: (row: T, helpers: ExpandedHelpers) => ReactNode;
  accent: Accent;
  canDelete: boolean;
  emptyLabel: string;
}) {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("highlight");

  const [rows, setRows] = useState(initialRows);
  const [expandedId, setExpandedId] = useState<string | null>(highlightId);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<AnyStatus | "all">("all");
  const styles = ACCENT_STYLES[accent];
  const statusOptions = STATUS_OPTIONS[statusTable];
  const highlightRef = useRef<HTMLDivElement | HTMLTableRowElement | null>(null);

  // Deep-linked from elsewhere (e.g. the Overview page's Upcoming Demos) via
  // ?highlight=<id> — open straight to that row and scroll it into view
  // instead of leaving the visitor to hunt for it in the full list.
  useEffect(() => {
    if (!highlightId) return;
    const row = initialRows.find((r) => r.id === highlightId);
    if (row && !row.is_read) patch(row.id, { is_read: true });
    highlightRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightId]);

  async function patch(id: string, body: Partial<Pick<BaseRow, "is_read" | "pipeline_status">>) {
    setError("");
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...body } : r)));
    try {
      const res = await fetch(`${apiBase}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await parseJsonSafe(res);
      if (!res.ok) throw new Error(data.error || "Update failed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  }

  function setLocalStatus(id: string, status: AnyStatus) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, pipeline_status: status } : r)));
  }

  function toggleExpand(row: T) {
    const opening = expandedId !== row.id;
    setExpandedId(opening ? row.id : null);
    if (opening && !row.is_read) {
      patch(row.id, { is_read: true });
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this entry? This can't be undone.")) return;
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`${apiBase}/${id}`, { method: "DELETE" });
      const data = await parseJsonSafe(res);
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setRows((prev) => prev.filter((r) => r.id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  const counts = useMemo(() => {
    const c: Partial<Record<AnyStatus, number>> = {};
    for (const row of rows) c[row.pipeline_status] = (c[row.pipeline_status] || 0) + 1;
    return c;
  }, [rows]);
  const visibleRows = filter === "all" ? rows : rows.filter((r) => r.pipeline_status === filter);

  // Shared between the desktop table's expanded row and the mobile card's
  // expanded section — the status select + read toggle + delete button.
  function renderActions(row: T) {
    return (
      <div className="flex flex-wrap items-center gap-3" onClick={(e) => e.stopPropagation()}>
        <select
          value={row.pipeline_status}
          onChange={(e) => patch(row.id, { pipeline_status: e.target.value as AnyStatus })}
          className={`rounded-lg border border-line bg-paper px-3 py-1.5 text-xs font-medium text-ink outline-none ${styles.ring}`}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {statusLabel(status)}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => patch(row.id, { is_read: !row.is_read })}
          className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink/70 transition hover:border-ink/25 hover:text-ink"
        >
          {row.is_read ? <Mail size={13} /> : <MailOpen size={13} />}
          {row.is_read ? "Mark unread" : "Mark read"}
        </button>

        {canDelete && (
          <button
            type="button"
            disabled={busyId === row.id}
            onClick={() => handleDelete(row.id)}
            className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:border-red-300 hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 size={13} />
            {busyId === row.id ? "Deleting…" : "Delete"}
          </button>
        )}
      </div>
    );
  }

  // A single filter button — a tab strip either scrolled off-screen or
  // wrapped into a cramped second line on a phone. A native select opens the
  // OS's own picker on mobile (no custom dropdown/backdrop to build or get
  // wrong) and still looks and behaves like a normal button on desktop.
  const filterBar = (
    <div className="mb-4">
      <div className="relative inline-block">
        <Filter size={14} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink/40" />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as AnyStatus | "all")}
          className="appearance-none rounded-full border border-line bg-paper py-2 pr-9 pl-9 text-sm font-semibold text-ink outline-none focus:border-brand"
        >
          <option value="all">All ({rows.length})</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {statusLabel(status)} ({counts[status] || 0})
            </option>
          ))}
        </select>
        <ChevronDown size={15} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ink/40" />
      </div>
    </div>
  );

  if (rows.length === 0) {
    return (
      <div>
        {filterBar}
        <div className="rounded-2xl border border-line bg-paper px-4 py-8 text-center text-ink/40">{emptyLabel}</div>
      </div>
    );
  }

  return (
    <div>
      {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
      {filterBar}

      {/* Mobile/tablet: a stacked card per row — every column reads as a
          label:value pair instead of needing a wide table with horizontal
          scroll. */}
      <div className="space-y-3 md:hidden">
        {visibleRows.map((row) => {
          const expanded = expandedId === row.id;
          return (
            <div
              key={row.id}
              ref={row.id === highlightId ? (el) => { highlightRef.current = el; } : undefined}
              className={`overflow-hidden rounded-2xl border border-l-4 bg-paper ${
                row.id === highlightId ? "border-brand" : "border-line"
              } ${row.is_read ? "border-l-transparent" : styles.border}`}
            >
              <button type="button" onClick={() => toggleExpand(row)} className="flex w-full flex-col gap-2 px-4 py-3 text-left">
                {/* Status gets the full row to itself — putting it in a
                    shrink-0 column next to the data (as before) squeezed the
                    label:value rows into less width, forcing values to
                    truncate harder than they needed to. */}
                <div className="flex items-center justify-between gap-3">
                  <StatusBadge status={row.pipeline_status} />
                  {expanded ? <ChevronDown size={16} className="text-ink/40" /> : <ChevronRight size={16} className="text-ink/40" />}
                </div>
                <div className="min-w-0 space-y-1.5">
                  {columns.map((col) => (
                    <div key={col.key} className="flex items-baseline justify-between gap-3">
                      <span className="shrink-0 text-[10px] font-semibold tracking-wide text-ink/40 uppercase">{col.label}</span>
                      <span className={`truncate text-sm ${row.is_read ? "text-ink/70" : "font-semibold text-ink"}`}>
                        {col.render(row)}
                      </span>
                    </div>
                  ))}
                </div>
              </button>
              {expanded && (
                <div className="border-t border-line bg-paper-alt px-4 py-5">
                  <div className="mb-4">{renderExpanded(row, { setLocalStatus: (status) => setLocalStatus(row.id, status) })}</div>
                  {renderActions(row)}
                </div>
              )}
            </div>
          );
        })}
        {visibleRows.length === 0 && (
          <div className="rounded-2xl border border-line bg-paper px-4 py-8 text-center text-ink/40">Nothing matches this filter.</div>
        )}
      </div>

      {/* Desktop: the full table. */}
      <div className="hidden overflow-x-auto rounded-2xl border border-line bg-paper md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs font-semibold uppercase tracking-wide text-ink/50">
              <th className="w-8 px-4 py-3"></th>
              {columns.map((col) => (
                <th key={col.key} className={`px-4 py-3 ${col.className || ""}`}>
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => {
              const expanded = expandedId === row.id;
              return (
                <Fragment key={row.id}>
                  <tr
                    ref={row.id === highlightId ? (el) => { highlightRef.current = el; } : undefined}
                    onClick={() => toggleExpand(row)}
                    className={`cursor-pointer border-b border-l-4 last:border-b-0 align-top transition hover:bg-paper-alt ${
                      row.id === highlightId ? "border-brand" : "border-line"
                    } ${row.is_read ? "border-l-transparent" : styles.border}`}
                  >
                    <td className="px-4 py-3 text-ink/40">
                      {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </td>
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-4 py-3 ${row.is_read ? "text-ink/70" : "font-semibold text-ink"} ${col.className || ""}`}
                      >
                        {col.render(row)}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <StatusBadge status={row.pipeline_status} />
                    </td>
                  </tr>
                  {expanded && (
                    <tr className="border-b border-line bg-paper-alt last:border-b-0">
                      <td colSpan={columns.length + 2} className="px-4 py-5">
                        <div className="mb-4">
                          {renderExpanded(row, { setLocalStatus: (status) => setLocalStatus(row.id, status) })}
                        </div>
                        {renderActions(row)}
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {visibleRows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 2} className="px-4 py-8 text-center text-ink/40">
                  Nothing matches this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
