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
          title="Join the beta."
          subtitle="Get early access to EliteWorker and help shape it before general availability. Tell us a bit about your business and we'll follow up with next steps."
        />

        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-lg px-6">
            <FadeIn>
              <BetaForm />
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
