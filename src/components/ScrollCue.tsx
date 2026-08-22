// Bounces at the bottom of a hero/intro section to hint there's more content
// below. Tablet-only: rather than guessing by pixel width (which misses iPad
// mini portrait, iPad Pro 12.9" portrait, and every landscape orientation —
// they span 744px to 1366px), this targets touch-without-hover devices at a
// phone-excluding min-width, which correctly matches any iPad in any
// orientation while still excluding real desktops/laptops (mouse = hover).
export function ScrollCue({ light = false }: { light?: boolean }) {
  return (
    <div
      className={`absolute bottom-5 left-1/2 hidden -translate-x-1/2 animate-bounce [@media(hover:none)_and_(pointer:coarse)_and_(min-width:640px)]:flex ${
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
