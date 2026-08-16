import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";
import ContactForm from "@/components/ContactForm";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the EliteWorker team.",
};

const categories = ["AV", "Security", "Networking", "Shading", "Smart home", "Networking & IT"];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <NavBar />

      <main>
        <PageIntro
          kicker="Get in touch"
          title="Let's see your jobs running without the guesswork."
          subtitle="Tell us a bit about your business and we&apos;ll follow up to set up a walkthrough of EliteWorker on a real account."
        />

        <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <div className="grid gap-14 md:grid-cols-[0.9fr_1.1fr]">
            <FadeIn className="space-y-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">Who it&apos;s for</p>
                <p className="mt-3 max-w-sm text-sm leading-7 text-ink/60">
                  EliteWorker is built for integrators running install crews across these trades:
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-line bg-paper-alt px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-ink/60"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">Prefer a live walkthrough?</p>
                <p className="mt-3 max-w-sm text-sm leading-7 text-ink/60">
                  Skip the form and book 30 minutes directly — we&apos;ll show you EliteWorker running on a real
                  account.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={100}>
              <ContactForm />
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
