import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "How It Works",
  description: "A job's path through EliteWorker, from prewire to final walkthrough.",
};

const workflow = [
  {
    step: "01",
    label: "Prewire",
    body: "Jobs are scheduled and assigned before drywall closes the wall. Crews see the plan, the address, and what's needed before they roll a truck.",
  },
  {
    step: "02",
    label: "Trim",
    body: "Devices, panels, and displays go in with parts tracked in real time, so nothing gets billed — or forgotten — after the fact.",
  },
  {
    step: "03",
    label: "Programming",
    body: "Systems are configured, tested, and validated against the plan, with checklists that keep every install to the same standard.",
  },
  {
    step: "04",
    label: "Final walkthrough",
    body: "Client sign-off, punch list closure, and support handoff all happen in one flow — no loose threads between install and service.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <NavBar />

      <main>
        <PageIntro
          kicker="How it works"
          title="A job's path through EliteWorker."
          subtitle="Every job in your pipeline moves through the same four stages — so handoffs stay clean, nothing slips through, and everyone from the office to the crew truck knows exactly where things stand."
        />

        <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <div className="space-y-6">
            {workflow.map((w, i) => (
              <FadeIn
                key={w.step}
                delay={i * 80}
                className="flex flex-col gap-6 rounded-[1.75rem] border border-line bg-paper p-8 shadow-[0_2px_10px_rgba(15,23,42,0.03)] sm:flex-row sm:items-center md:p-10"
              >
                <div className="flex shrink-0 items-center gap-4 sm:w-40 sm:flex-col sm:items-start sm:gap-1">
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-brand">{w.step}</span>
                  <h2 className="text-2xl font-semibold text-ink">{w.label}</h2>
                </div>
                <p className="max-w-2xl text-sm leading-7 text-ink/60 md:text-base">{w.body}</p>
              </FadeIn>
            ))}
          </div>
        </section>

        <section className="border-t border-line bg-paper-alt">
          <div className="mx-auto max-w-7xl px-6 py-24 text-center md:py-32">
            <FadeIn>
              <h2 className="text-balance font-display text-3xl font-semibold tracking-[-0.03em] text-ink md:text-5xl">
                See this workflow running on a real account.
              </h2>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href="/demo"
                  className="rounded-xl bg-accent px-7 py-3.5 text-sm font-semibold text-ink shadow-[0_18px_35px_rgba(245,158,11,0.28)] transition hover:-translate-y-0.5 hover:brightness-105"
                >
                  Book a demo
                </Link>
                <Link
                  href="/platform"
                  className="rounded-xl border border-line bg-paper px-7 py-3.5 text-sm font-semibold text-ink/80 transition hover:border-ink/25 hover:text-ink"
                >
                  Explore the platform
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
