import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";
import BookingWidget from "@/components/BookingWidget";

export const metadata: Metadata = {
  title: "Reschedule your demo",
  robots: { index: false, follow: false },
};

export default async function ReschedulePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;

  return (
    <div className="min-h-screen bg-paper text-ink">
      <NavBar />
      <main>
        <PageIntro kicker="Reschedule" title="Pick a new time." subtitle="Choose a new slot for your EliteWorker demo below." />
        <section className="mx-auto max-w-4xl px-6 py-16">
          <div className="overflow-hidden rounded-2xl border border-line bg-paper-alt">
            <BookingWidget mode="reschedule" token={token} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
