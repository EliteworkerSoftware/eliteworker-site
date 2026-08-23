"use client";

import { useState } from "react";
import { ResourceTable, type Column } from "@/components/admin/ResourceTable";
import { ReplyPanel, type ReplyRecord } from "@/components/admin/ReplyPanel";
import type { AnyStatus } from "@/lib/adminTriage";

export type BetaSignup = {
  id: string;
  created_at: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  phone: string;
  address: string;
  employees: string | null;
  annual_revenue: string | null;
  brands: string | null;
  notes: string | null;
  is_read: boolean;
  pipeline_status: AnyStatus;
  decline_reason: string | null;
  replies: ReplyRecord[];
};

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

const columns: Column<BetaSignup>[] = [
  { key: "created_at", label: "Submitted", render: (row) => formatDate(row.created_at), className: "whitespace-nowrap" },
  { key: "company_name", label: "Company", render: (row) => row.company_name },
  { key: "contact_name", label: "Contact", render: (row) => row.contact_name },
  { key: "contact_email", label: "Email", render: (row) => row.contact_email },
  { key: "phone", label: "Phone", render: (row) => row.phone },
];

function DeclineReasonField({ id, initialReason }: { id: string; initialReason: string | null }) {
  const [reason, setReason] = useState(initialReason || "");
  const [saved, setSaved] = useState(initialReason || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/beta/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decline_reason: reason || null }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setSaved(reason);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="sm:col-span-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Reason for declining</p>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Why this application was declined (internal note, not sent to the applicant)..."
        rows={2}
        className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-accent"
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      <div className="mt-1.5 flex items-center gap-2">
        <button
          type="button"
          disabled={saving || reason === saved}
          onClick={handleSave}
          className="rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-white transition hover:bg-ink disabled:opacity-40"
        >
          {saving ? "Saving…" : "Save reason"}
        </button>
        {reason === saved && saved && <span className="text-xs text-ink/40">Saved</span>}
      </div>
    </div>
  );
}

export function BetaSignupsTable({ initialRows, canDelete }: { initialRows: BetaSignup[]; canDelete: boolean }) {
  return (
    <ResourceTable
      initialRows={initialRows}
      apiBase="/api/admin/beta"
      statusTable="eliteworker_beta_signups"
      columns={columns}
      accent="accent"
      canDelete={canDelete}
      emptyLabel="No beta applications yet."
      renderExpanded={(row) => (
        <div className="grid max-w-2xl gap-3 text-sm text-ink sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Address</p>
            <p className="mt-1">{row.address}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Employees</p>
            <p className="mt-1">{row.employees || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Revenue</p>
            <p className="mt-1">{row.annual_revenue || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Brands carried</p>
            <p className="mt-1">{row.brands || "—"}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Notes</p>
            <p className="mt-1 leading-relaxed">{row.notes || "—"}</p>
          </div>
          {row.pipeline_status === "declined" && <DeclineReasonField id={row.id} initialReason={row.decline_reason} />}
          <div className="sm:col-span-2">
            <ReplyPanel
              replyApi={`/api/admin/beta/${row.id}/reply`}
              recipientName={row.contact_name}
              recipientEmail={row.contact_email}
              initialReplies={row.replies}
            />
          </div>
        </div>
      )}
    />
  );
}
