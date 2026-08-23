import { Sparkles, MessageCircle, CheckCircle2, Archive } from "lucide-react";
import type { PipelineStatus } from "@/lib/adminTriage";

// A fixed, reserved palette independent of section color — pipeline status
// means the same thing everywhere, so it shouldn't borrow the brand/accent/
// teal identity used to tell sections apart. Always icon + label, never a
// bare colored dot (a lone color means nothing without the word next to it).
// Each stage gets its own saturated color (not just gray) so the pipeline
// column reads at a glance without having to read every label.
const STATUS_STYLES: Record<PipelineStatus, { label: string; icon: typeof Sparkles; className: string }> = {
  new: { label: "New", icon: Sparkles, className: "bg-blue-500/12 text-blue-700 ring-1 ring-inset ring-blue-500/20" },
  contacted: {
    label: "Contacted",
    icon: MessageCircle,
    className: "bg-amber-500/12 text-amber-700 ring-1 ring-inset ring-amber-500/25",
  },
  converted: {
    label: "Converted",
    icon: CheckCircle2,
    className: "bg-emerald-500/12 text-emerald-700 ring-1 ring-inset ring-emerald-500/20",
  },
  archived: { label: "Archived", icon: Archive, className: "bg-slate-500/10 text-slate-600 ring-1 ring-inset ring-slate-500/15" },
};

export function StatusBadge({ status }: { status: PipelineStatus }) {
  const { label, icon: Icon, className } = STATUS_STYLES[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>
      <Icon size={13} strokeWidth={2.5} />
      {label}
    </span>
  );
}
