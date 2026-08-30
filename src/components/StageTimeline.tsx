import { WiringIcon, InstallationIcon, ProgrammingIcon, QualityCheckIcon, TutorialIcon } from "@/components/SolutionIcons";

// The same five job-stage icons used in the homepage's journey strip
// (src/app/page.tsx) — reused here instead of introducing a separate visual
// language, so a blog post illustrating job-stage tracking visually ties
// back to the actual product instead of a generic stock graphic.
const stages = [
  { label: "Prewire", Icon: WiringIcon },
  { label: "Installation", Icon: InstallationIcon },
  { label: "Programming", Icon: ProgrammingIcon },
  { label: "Quality Check", Icon: QualityCheckIcon },
  { label: "Tutorial", Icon: TutorialIcon },
];

export function StageTimeline({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-start justify-between ${className}`}>
      {/* One continuous line spanning from the first circle's center to the
          last circle's center, sitting behind the circles — rather than a
          separate connector segment per gap, which broke unevenly when
          circles' columns had different-width labels. left-7/right-7 (28px)
          match the h-14 circle's radius exactly; the sm: variants match h-16. */}
      <div className="absolute top-7 right-7 left-7 -z-10 h-0.5 bg-linear-to-r from-brand-dark via-brand to-brand-light sm:top-8 sm:right-8 sm:left-8" />
      {stages.map(({ label, Icon }) => (
        <div key={label} className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-brand-dark to-brand-light shadow-sm sm:h-16 sm:w-16">
            <Icon className="h-6 w-6 text-white sm:h-7 sm:w-7" />
          </div>
          {/* Labels are hidden below sm: the prose subtitle directly above
              already names all five stages, and at phone widths five full
              labels have no room to breathe without colliding. */}
          <span className="hidden w-16 text-center text-[10px] font-semibold uppercase tracking-[0.08em] text-ink/60 sm:block sm:text-xs">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
