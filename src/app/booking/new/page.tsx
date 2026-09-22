import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";
import BookingWidget from "@/components/BookingWidget";

// Temporary preview route for testing the self-built booking flow before
// cutover — NOT linked from nav, and /demo still shows the Cal.com iframe
// until this is verified end-to-end and the plan's cutover step swaps it in.
export const metadata: Metadata = {
  title: "Book a Demo (preview)",
  robots: { index: false, follow: false },
};

export default function BookingPreviewPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <NavBar />
      <main>
        <PageIntro
          kicker="Preview — not linked yet"
          title="Book a demo."
          subtitle="Testing the self-built booking flow ahead of cutover."
        />
        <section className="mx-auto max-w-4xl px-6 py-16">
          <div className="overflow-hidden rounded-2xl border border-line bg-paper-alt">
            <BookingWidget mode="book" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
