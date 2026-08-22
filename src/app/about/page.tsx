import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "About Us",
  description: "EliteWorker is built by integrators, for integrators.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <NavBar />

      <main>
        <PageIntro kicker="About us" title="About EliteWorker" />

        <section className="border-t border-line bg-paper-alt">
          <div className="mx-auto max-w-3xl px-6 py-24 md:py-32">
            <FadeIn className="space-y-6 text-balance text-center text-base leading-8 text-ink/70 md:text-lg">
              <p>
                EliteWorker wasn&rsquo;t built in a boardroom. It was built on job sites — by a smart home
                professional with over 30 years in the industry, who spent the last five-plus years using it,
                breaking it, and rebuilding it inside his own companies until it actually worked the way a real
                integration business runs. Every workflow, every job stage, every feature exists because it solved
                a real problem for a real crew, on a real install. Now we&rsquo;re opening it up to the rest of the
                industry — and we&rsquo;re just getting started.
              </p>
              <p>
                Most software in this space was built by people who&rsquo;ve never had to explain a change order to
                a client on a Friday afternoon. EliteWorker was built by someone who has — over and over, for thirty
                years. Every workflow exists because a real job needed it. That&rsquo;s the difference between
                software built for the industry, and software built inside it.
              </p>
              <p>
                We&rsquo;re not done. Every integrator who joins EliteWorker makes the platform sharper for the next
                one — because the same principle that built it in the first place still applies: real problems,
                solved by people who actually live them. This is just the beginning, and we&rsquo;re building what
                comes next with your input, so EliteWorker becomes the best platform in the industry — not just for
                us, but for everyone running one.
              </p>
            </FadeIn>
          </div>
        </section>

        <section className="border-t border-line">
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
