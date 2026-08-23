"use client";

import { ResourceTable, type Column } from "@/components/admin/ResourceTable";
import { ReplyPanel, type ReplyRecord } from "@/components/admin/ReplyPanel";
import type { PipelineStatus } from "@/lib/adminTriage";

export type Lead = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  is_read: boolean;
  pipeline_status: PipelineStatus;
  replies: ReplyRecord[];
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
          <ReplyPanel
            replyApi={`/api/admin/leads/${row.id}/reply`}
            recipientName={row.name}
            recipientEmail={row.email}
            initialReplies={row.replies}
          />
        </div>
      )}
    />
  );
}
