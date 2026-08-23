import { Sparkles, MessageCircle, CalendarCheck, CheckCircle2, XCircle, MailCheck, Trophy, Archive, type LucideIcon } from "lucide-react";
import type { AnyStatus } from "@/lib/adminTriage";

// A fixed, reserved palette independent of section color — status meaning
// should read the same everywhere a given value appears. Always icon +
// label, never a bare colored dot (a lone color means nothing without the
// word next to it). Union across all three tables' status vocabularies —
// each table only ever renders the subset it actually uses. Solid, saturated
// fills with white text — a light/tinted pastel pill here reads as washed-out
// next to the rest of the admin section's now-bold color treatment.
//
// `accent` is the same color family as a plain text/border pair, used by the
// filter tab strip's active-state underline instead of the solid pill fill.
const STATUS_STYLES: Record<AnyStatus, { label: string; icon: LucideIcon; className: string; accent: string }> = {
  new: { label: "New", icon: Sparkles, className: "bg-blue-600 text-white", accent: "border-blue-600 text-blue-700" },
  contacted: {
    label: "Contacted",
    icon: MessageCircle,
    className: "bg-amber-600 text-white",
    accent: "border-amber-600 text-amber-700",
  },
  booked_demo: {
    label: "Booked for Demo",
    icon: CalendarCheck,
    className: "bg-violet-600 text-white",
    accent: "border-violet-600 text-violet-700",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    className: "bg-emerald-600 text-white",
    accent: "border-emerald-600 text-emerald-700",
  },
  declined: {
    label: "Declined",
    icon: XCircle,
    className: "bg-red-600 text-white",
    accent: "border-red-600 text-red-700",
  },
  confirm_1: {
    label: "Confirm 1",
    icon: MailCheck,
    className: "bg-cyan-600 text-white",
    accent: "border-cyan-600 text-cyan-700",
  },
  confirm_2: {
    label: "Confirm 2",
    icon: CheckCircle2,
    className: "bg-indigo-600 text-white",
    accent: "border-indigo-600 text-indigo-700",
  },
  converted: {
    label: "Converted",
    icon: Trophy,
    className: "bg-emerald-600 text-white",
    accent: "border-emerald-600 text-emerald-700",
  },
  archived: {
    label: "Archived",
    icon: Archive,
    className: "bg-slate-600 text-white",
    accent: "border-slate-600 text-slate-700",
  },
};

// Falls back gracefully for a value that predates a status-list change
// (e.g. a row's status from before a migration/remap) instead of crashing —
// the per-table select still only ever offers that table's current options.
const FALLBACK_STYLE = { icon: Sparkles, className: "bg-slate-500 text-white", accent: "border-slate-500 text-slate-600" };

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

export function statusIcon(status: AnyStatus): LucideIcon {
  return STATUS_STYLES[status]?.icon ?? FALLBACK_STYLE.icon;
}

export function statusAccent(status: AnyStatus): string {
  return STATUS_STYLES[status]?.accent ?? FALLBACK_STYLE.accent;
}
