// Bounces at the bottom of a hero/intro section to hint there's more content
// below. Tablet-only: phones are short enough that this is obvious, and
// desktop viewports are tall enough to already show what's below the fold.
export function ScrollCue({ light = false }: { light?: boolean }) {
  return (
    <div
      className={`absolute bottom-5 left-1/2 hidden -translate-x-1/2 animate-bounce md:flex lg:hidden ${
        light ? "text-white/70" : "text-ink/40"
      }`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  );
}
