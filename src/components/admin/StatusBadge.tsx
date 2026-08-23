import { Sparkles, MessageCircle, CalendarCheck, CheckCircle2, XCircle, MailCheck, Trophy, Archive, type LucideIcon } from "lucide-react";
import type { AnyStatus } from "@/lib/adminTriage";

// A fixed, reserved palette independent of section color — status meaning
// should read the same everywhere a given value appears. Always icon +
// label, never a bare colored dot (a lone color means nothing without the
// word next to it). Union across all three tables' status vocabularies —
// each table only ever renders the subset it actually uses.
const STATUS_STYLES: Record<AnyStatus, { label: string; icon: LucideIcon; className: string }> = {
  new: { label: "New", icon: Sparkles, className: "bg-blue-500/12 text-blue-700 ring-1 ring-inset ring-blue-500/20" },
  contacted: {
    label: "Contacted",
    icon: MessageCircle,
    className: "bg-amber-500/12 text-amber-700 ring-1 ring-inset ring-amber-500/25",
  },
  booked_demo: {
    label: "Booked for Demo",
    icon: CalendarCheck,
    className: "bg-violet-500/12 text-violet-700 ring-1 ring-inset ring-violet-500/20",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    className: "bg-emerald-500/12 text-emerald-700 ring-1 ring-inset ring-emerald-500/20",
  },
  declined: { label: "Declined", icon: XCircle, className: "bg-red-500/12 text-red-700 ring-1 ring-inset ring-red-500/20" },
  confirm_1: { label: "Confirm 1", icon: MailCheck, className: "bg-blue-500/12 text-blue-700 ring-1 ring-inset ring-blue-500/20" },
  confirm_2: {
    label: "Confirm 2",
    icon: CheckCircle2,
    className: "bg-amber-500/12 text-amber-700 ring-1 ring-inset ring-amber-500/25",
  },
  converted: { label: "Converted", icon: Trophy, className: "bg-emerald-500/12 text-emerald-700 ring-1 ring-inset ring-emerald-500/20" },
  archived: { label: "Archived", icon: Archive, className: "bg-slate-500/10 text-slate-600 ring-1 ring-inset ring-slate-500/15" },
};

// Falls back gracefully for a value that predates a status-list change
// (e.g. a row's status from before a migration/remap) instead of crashing —
// the per-table select still only ever offers that table's current options.
const FALLBACK_STYLE = { icon: Sparkles, className: "bg-ink/5 text-ink/50 ring-1 ring-inset ring-ink/10" };

export function StatusBadge({ status }: { status: AnyStatus }) {
  const { label, icon: Icon, className } = STATUS_STYLES[status] ?? { ...FALLBACK_STYLE, label: status };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>
      <Icon size={13} strokeWidth={2.5} />
      {label}
    </span>
  );
}

export function statusLabel(status: AnyStatus): string {
  return STATUS_STYLES[status]?.label ?? status;
}
