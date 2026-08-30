import type { ComponentType } from "react";

// A brand-gradient header band for blog index cards: the post's own topic
// icon (from blogPosts.ts, sourced from the same icon set as the homepage's
// customer-lifecycle journey) blown up huge, ghosted, and bleeding off the
// corner behind a short category label — so each card reads as distinct at
// a glance instead of every post looking identical, with no per-post
// photography needed.
export function BlogCardHeader({
  Icon,
  category,
  className = "",
}: {
  Icon: ComponentType<{ className?: string }>;
  category: string;
  className?: string;
}) {
  return (
    <div
      className={`relative isolate flex items-end overflow-hidden bg-linear-to-br from-brand-dark via-brand to-brand-light p-5 ${className}`}
    >
      {/* -z-10 keeps this behind the label — an absolutely-positioned
          sibling with no z-index would otherwise paint after (on top of)
          the label's normal-flow text, even though it's earlier in the DOM.
          `isolate` on this div is required for that -z-10 to stay scoped
          here — plain `relative` alone doesn't create a stacking context,
          so without it the icon escapes and paints behind unrelated page
          content instead of just behind the label. */}
      <Icon className="absolute -right-10 -bottom-12 -z-10 h-56 w-56 text-white/20" />
      <span className="text-lg font-semibold text-white/80 md:text-xl">{category}</span>
    </div>
  );
}
