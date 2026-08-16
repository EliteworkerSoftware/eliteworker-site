import FadeIn from "@/components/FadeIn";

export default function PageIntro({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="border-b border-line bg-paper-alt">
      <div className="mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
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
    </section>
  );
}
