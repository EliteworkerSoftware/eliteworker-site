import type { ReactNode } from "react";
import FadeIn from "@/components/FadeIn";
import { ScrollCue } from "@/components/ScrollCue";

export default function PageIntro({
  kicker,
  title,
  subtitle,
  children,
  scrollCue = false,
  compactBottom = false,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  scrollCue?: boolean;
  // Trims just the bottom padding — for pages like /contact where the next
  // section should sit close beneath the intro copy instead of the usual
  // generous breathing room other pages want on both sides.
  compactBottom?: boolean;
}) {
  return (
    <section className="relative isolate overflow-x-clip border-b border-line bg-paper-alt">
      {children}
      <div
        className={`mx-auto max-w-4xl px-6 pt-20 text-center md:pt-28 ${compactBottom ? "pb-10 md:pb-14" : "pb-20 md:pb-28"}`}
      >
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">{kicker}</p>
          <h1 className="mt-4 text-balance font-display text-4xl font-semibold tracking-[-0.03em] text-ink md:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-7 text-ink/60 md:text-lg">
              {subtitle}
            </p>
          )}
        </FadeIn>
      </div>
      {scrollCue && <ScrollCue />}
    </section>
  );
}
