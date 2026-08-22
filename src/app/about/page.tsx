import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import { BarChartMotif } from "@/components/BarChartMotif";
import { HorizontalBarsMotif } from "@/components/HorizontalBarsMotif";

export const metadata: Metadata = {
  title: "About Us",
  description: "EliteWorker is built by integrators, for integrators.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <NavBar />

      <main>
        <section className="relative isolate flex h-[32rem] items-center justify-center overflow-hidden md:h-[44rem]">
          <Image
            src="/Photos/Founder.png"
            alt="EliteWorker founder on a job site"
            fill
            priority
            className="-z-20 object-cover object-[78%_85%]"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-nav via-nav/70 to-nav/40" />
          <div className="mx-auto max-w-4xl px-6 text-center">
            <FadeIn>
              <p className="inline-block rounded-full bg-brand-dark px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-white">
                About us
              </p>
              <h1 className="mt-4 text-balance font-display text-4xl font-semibold tracking-[-0.03em] text-white md:text-6xl">
                About EliteWorker
              </h1>
            </FadeIn>
          </div>
        </section>

        <section className="relative isolate overflow-x-clip border-t border-line bg-paper-alt">
          <HorizontalBarsMotif
            speed={0.25}
            className="pointer-events-none absolute -left-20 top-[8%] -z-10 h-136 w-136 opacity-[0.09]"
          />
          <div className="mx-auto max-w-3xl px-6 py-24 md:py-32">
            <FadeIn className="space-y-6 text-balance text-center text-base leading-8 text-ink/70 md:text-lg">
              <p>
                EliteWorker wasn&rsquo;t built in a boardroom. It was built on job sites — by our founder, a smart
                home professional with over 30 years in the industry, who spent the last five-plus years using it,
                breaking it, and rebuilding it inside his own companies until it actually worked the way a real
                integration business runs. Every workflow, every job stage, every feature exists because it solved
                a real problem for a real crew, on a real install.
              </p>
              <p>
                Most software in this space was built by people who&rsquo;ve never had to call a client on a Friday
                night and explain the materials never arrived — not because of a shipping delay, but because they
                were too busy to order them in the first place. EliteWorker was built by someone who has — over and
                over, for thirty years. Every workflow exists because a real job needed it. That&rsquo;s the
                difference between software built for the industry, and software built inside it.
              </p>
              <p>
                We&rsquo;re not done. Every integrator who joins EliteWorker makes the platform sharper for the
                entire integrator community — because the same principle that built it in the first place still
                applies: real problems, solved by people who actually live them. This is just the beginning, and
                we&rsquo;re building what comes next with your input, so EliteWorker becomes the best tool for your
                business to succeed.
              </p>
            </FadeIn>
          </div>
        </section>

        <section className="relative isolate overflow-x-clip border-t border-line">
          <BarChartMotif
            speed={-0.18}
            className="pointer-events-none absolute -right-14 bottom-[10%] -z-10 h-120 w-120 opacity-[0.10]"
          />
          <div className="mx-auto max-w-7xl px-6 py-24 text-center md:py-32">
            <FadeIn>
              <h2 className="text-balance font-display text-3xl font-semibold tracking-[-0.03em] text-ink md:text-5xl">
                Want to see it running on a real account?
              </h2>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href="/demo"
                  className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-105"
                >
                  Book a demo
                </Link>
                <Link
                  href="/beta"
                  className="rounded-full border-2 border-brand-dark px-5 py-2.5 text-sm font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white"
                >
                  Join the Beta
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
