import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";
import FadeIn from "@/components/FadeIn";
import BetaForm from "@/components/BetaForm";

export const metadata: Metadata = {
  title: "Join the Beta",
  description: "Get early access to EliteWorker before general availability.",
};

export default function BetaPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <NavBar />

      <main>
        <PageIntro
          kicker="Early access"
          title="Help us build you the best tool for your business"
          subtitle="We didn't build EliteWorker to add another tool to your stack — we built it so you can spend less time in your business and more time growing it. Beta partners get early access and a direct line to shape what we build next: what's missing, what's slowing you down, and what would actually buy you back your time. Tell us about your business, and let's build the tool that helps you scale it."
        />

        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-2xl px-6">
            <FadeIn>
              <p className="mb-10 text-balance text-center text-2xl font-semibold text-ink">Start Here</p>
              <BetaForm />
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
