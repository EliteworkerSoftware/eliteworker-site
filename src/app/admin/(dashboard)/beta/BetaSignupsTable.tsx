"use client";

import { ResourceTable, type Column } from "@/components/admin/ResourceTable";
import type { PipelineStatus } from "@/lib/adminTriage";

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
  pipeline_status: PipelineStatus;
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

export function BetaSignupsTable({ initialRows, canDelete }: { initialRows: BetaSignup[]; canDelete: boolean }) {
  return (
    <ResourceTable
      initialRows={initialRows}
      apiBase="/api/admin/beta"
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
        </div>
      )}
    />
  );
}
