"use client";

import { ResourceTable, type Column } from "@/components/admin/ResourceTable";
import { ReplyPanel, type ReplyRecord } from "@/components/admin/ReplyPanel";
import type { PipelineStatus } from "@/lib/adminTriage";

export type DemoBooking = {
  id: string;
  created_at: string;
  booking_uid: string;
  attendee_name: string | null;
  attendee_email: string | null;
  start_time: string | null;
  end_time: string | null;
  event_title: string | null;
  status: string;
  is_read: boolean;
  pipeline_status: PipelineStatus;
  replies: ReplyRecord[];
};

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

const columns: Column<DemoBooking>[] = [
  {
    key: "start_time",
    label: "When",
    render: (row) => (row.start_time ? formatDate(row.start_time) : "—"),
    className: "whitespace-nowrap",
  },
  { key: "attendee_name", label: "Attendee", render: (row) => row.attendee_name || "—" },
  { key: "attendee_email", label: "Email", render: (row) => row.attendee_email || "—" },
  { key: "event_title", label: "Event", render: (row) => row.event_title || "—" },
  {
    key: "status",
    label: "Booking status",
    render: (row) => <span className="capitalize">{row.status}</span>,
  },
];

export function DemoBookingsTable({ initialRows, canDelete }: { initialRows: DemoBooking[]; canDelete: boolean }) {
  return (
    <ResourceTable
      initialRows={initialRows}
      apiBase="/api/admin/bookings"
      columns={columns}
      accent="teal"
      canDelete={canDelete}
      emptyLabel="No demo bookings yet."
      renderExpanded={(row) => (
        <div className="grid max-w-xl gap-3 text-sm text-ink sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Ends</p>
            <p className="mt-1">{row.end_time ? formatDate(row.end_time) : "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Booking UID</p>
            <p className="mt-1 break-all font-mono text-xs">{row.booking_uid}</p>
          </div>
          <div className="sm:col-span-2">
            <ReplyPanel
              replyApi={`/api/admin/bookings/${row.id}/reply`}
              recipientName={row.attendee_name || "there"}
              recipientEmail={row.attendee_email}
              initialReplies={row.replies}
            />
          </div>
        </div>
      )}
    />
  );
}
