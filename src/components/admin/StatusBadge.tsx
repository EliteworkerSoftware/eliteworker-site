import { Sparkles, MessageCircle, CheckCircle2, Archive } from "lucide-react";
import type { PipelineStatus } from "@/lib/adminTriage";

// A fixed, reserved palette independent of section color — pipeline status
// means the same thing everywhere, so it shouldn't borrow the brand/accent/
// teal identity used to tell sections apart. Always icon + label, never a
// bare colored dot (a lone color means nothing without the word next to it).
const STATUS_STYLES: Record<PipelineStatus, { label: string; icon: typeof Sparkles; className: string }> = {
  new: { label: "New", icon: Sparkles, className: "bg-ink/5 text-ink/50" },
  contacted: { label: "Contacted", icon: MessageCircle, className: "bg-ink/10 text-ink/70" },
  converted: { label: "Converted", icon: CheckCircle2, className: "bg-emerald-500/10 text-emerald-700" },
  archived: { label: "Archived", icon: Archive, className: "bg-ink/5 text-ink/40" },
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
