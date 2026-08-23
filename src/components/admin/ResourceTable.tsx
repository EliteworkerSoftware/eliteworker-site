"use client";

import { Fragment, useState, type ReactNode } from "react";
import { ChevronDown, ChevronRight, Trash2, MailOpen, Mail } from "lucide-react";
import { PIPELINE_STATUSES, type PipelineStatus } from "@/lib/adminTriage";
import { StatusBadge } from "./StatusBadge";

export type Column<T> = { key: string; label: string; render: (row: T) => ReactNode; className?: string };

type Accent = "brand" | "accent" | "teal";

// Tailwind v4 needs statically-discoverable class names — never build these
// via string interpolation like `bg-${accent}`.
const ACCENT_STYLES: Record<Accent, { border: string; ring: string }> = {
  brand: { border: "border-l-brand", ring: "focus:border-brand" },
  accent: { border: "border-l-accent", ring: "focus:border-accent" },
  teal: { border: "border-l-teal", ring: "focus:border-teal" },
};

type BaseRow = { id: string; is_read: boolean; pipeline_status: PipelineStatus };

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
  columns,
  renderExpanded,
  accent,
  canDelete,
  emptyLabel,
}: {
  initialRows: T[];
  apiBase: string;
  columns: Column<T>[];
  renderExpanded: (row: T) => ReactNode;
  accent: Accent;
  canDelete: boolean;
  emptyLabel: string;
}) {
  const [rows, setRows] = useState(initialRows);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const styles = ACCENT_STYLES[accent];

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

  return (
    <div>
      {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
      <div className="overflow-x-auto rounded-2xl border border-line bg-paper">
        <table className="w-full min-w-187.5 text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs font-semibold uppercase tracking-wide text-ink/50">
              <th className="w-8 px-4 py-3"></th>
              {columns.map((col) => (
                <th key={col.key} className={`px-4 py-3 ${col.className || ""}`}>
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3">Pipeline</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const expanded = expandedId === row.id;
              return (
                <Fragment key={row.id}>
                  <tr
                    onClick={() => toggleExpand(row)}
                    className={`cursor-pointer border-b border-line border-l-4 last:border-b-0 align-top transition hover:bg-paper-alt ${
                      row.is_read ? "border-l-transparent" : styles.border
                    }`}
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
                        <div className="mb-4">{renderExpanded(row)}</div>
                        <div
                          className="flex flex-wrap items-center gap-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <select
                            value={row.pipeline_status}
                            onChange={(e) => patch(row.id, { pipeline_status: e.target.value as PipelineStatus })}
                            className={`rounded-lg border border-line bg-paper px-3 py-1.5 text-xs font-medium text-ink outline-none ${styles.ring}`}
                          >
                            {PIPELINE_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
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
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 2} className="px-4 py-8 text-center text-ink/40">
                  {emptyLabel}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
