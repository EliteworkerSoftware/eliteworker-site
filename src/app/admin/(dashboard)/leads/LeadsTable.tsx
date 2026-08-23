"use client";

import { useState } from "react";
import { ResourceTable, type Column } from "@/components/admin/ResourceTable";
import type { PipelineStatus } from "@/lib/adminTriage";

export type LeadReply = {
  id: string;
  created_at: string;
  lead_id: string;
  admin_id: string;
  admin_name: string | null;
  message: string;
};

export type Lead = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  is_read: boolean;
  pipeline_status: PipelineStatus;
  replies: LeadReply[];
};

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

const columns: Column<Lead>[] = [
  { key: "created_at", label: "Submitted", render: (row) => formatDate(row.created_at), className: "whitespace-nowrap" },
  { key: "name", label: "Name", render: (row) => row.name },
  { key: "email", label: "Email", render: (row) => row.email },
  { key: "company", label: "Company", render: (row) => row.company || "—" },
];

async function parseJsonSafe(res: Response): Promise<{ error?: string; [key: string]: unknown }> {
  try {
    return await res.json();
  } catch {
    return { error: `Unexpected response from server (${res.status})` };
  }
}

function ReplyPanel({ lead }: { lead: Lead }) {
  const [replies, setReplies] = useState(lead.replies);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function handleSend() {
    if (!message.trim() || sending) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await parseJsonSafe(res);
      if (!res.ok) throw new Error(data.error || "Failed to send reply");
      setReplies((prev) => [...prev, data.reply as LeadReply]);
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reply");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mt-4 max-w-2xl border-t border-line pt-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
        {replies.length > 0 ? "Reply history" : "Reply"}
      </p>

      {replies.length > 0 && (
        <div className="mt-2 space-y-2">
          {replies.map((reply) => (
            <div key={reply.id} className="rounded-lg border border-line bg-paper px-3 py-2">
              <p className="text-xs text-ink/45">
                {formatDate(reply.created_at)} {reply.admin_name ? `· ${reply.admin_name}` : ""}
              </p>
              <p className="mt-1 text-sm whitespace-pre-wrap text-ink">{reply.message}</p>
            </div>
          ))}
        </div>
      )}

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={`Reply to ${lead.name} — sent from ${lead.email}...`}
        rows={3}
        className="mt-3 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-brand"
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      <div className="mt-2 flex justify-end">
        <button
          type="button"
          disabled={sending || !message.trim()}
          onClick={handleSend}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-brand/90 disabled:opacity-50"
        >
          {sending ? "Sending…" : "Send reply"}
        </button>
      </div>
    </div>
  );
}

export function LeadsTable({ initialRows, canDelete }: { initialRows: Lead[]; canDelete: boolean }) {
  return (
    <ResourceTable
      initialRows={initialRows}
      apiBase="/api/admin/leads"
      columns={columns}
      accent="brand"
      canDelete={canDelete}
      emptyLabel="No contact leads yet."
      renderExpanded={(row) => (
        <div>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Message</p>
            <p className="mt-1 text-sm leading-relaxed text-ink">{row.message}</p>
          </div>
          <ReplyPanel lead={row} />
        </div>
      )}
    />
  );
}
