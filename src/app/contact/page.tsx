import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";
import ContactForm from "@/components/ContactForm";
import FadeIn from "@/components/FadeIn";
import { UsaFlagIcon } from "@/components/UsaFlagIcon";
import { PillButton } from "@/components/PillButton";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the EliteWorker team.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <NavBar />

      <main>
        <PageIntro
          kicker="Get in touch"
          title="Let's see your jobs running without the guesswork."
          subtitle="We want to hear more about your business and see if we are a good fit for each other. Please use the form below to get in touch with us"
          scrollCue
        />

        <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <div className="grid items-center gap-14 md:grid-cols-[0.9fr_1.1fr]">
            <FadeIn className="space-y-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">Prefer a live walkthrough?</p>
                <p className="mt-3 max-w-sm text-sm leading-7 text-ink/60">
                  Skip the form and book 30 minutes directly — we&apos;ll show you EliteWorker running on a real
                  account.
                </p>
                <PillButton href="/demo" size="md" className="mt-5 inline-block">
                  Book a demo
                </PillButton>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">Mailing address</p>
                <p className="mt-3 max-w-sm text-sm leading-7 text-ink/60">
                  EliteWorker, LLC
                  <br />
                  PO Box 1025
                  <br />
                  Marlton, NJ 08053
                </p>
              </div>

              <p className="flex items-center gap-2 text-sm text-ink/60">
                <UsaFlagIcon className="h-3.5 w-5.5 shrink-0 rounded-xs" />
                Proudly designed and developed in the USA
              </p>
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
