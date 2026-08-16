import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "Book a Demo",
  description: "Book a live 30-minute walkthrough of EliteWorker with our team.",
};

// TODO: after you create your Cal.com account, set NEXT_PUBLIC_CAL_LINK in
// .env.local to your real booking link, e.g. "your-username/eliteworker-demo"
const calLink = process.env.NEXT_PUBLIC_CAL_LINK;

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <NavBar />

      <main>
        <PageIntro
          kicker="Live walkthrough"
          title="Book a demo."
          subtitle="30 minutes, no slides. Pick a time and we'll show you EliteWorker running on a real account — scheduling, dispatch, and job tracking."
        />

        <section className="mx-auto max-w-4xl px-6 py-16">
          <div className="overflow-hidden rounded-2xl border border-line bg-paper-alt">
            {calLink ? (
              <iframe
                src={`https://cal.com/${calLink}?embed=true&theme=light`}
                width="100%"
                height="700"
                style={{ border: "none" }}
                title="Book a demo"
              />
            ) : (
              <div className="p-10 text-center text-sm text-ink/60">
                Booking calendar not connected yet. Set{" "}
                <code className="rounded bg-paper px-1.5 py-0.5 font-mono text-brand-dark">
                  NEXT_PUBLIC_CAL_LINK
                </code>{" "}
                in your environment variables to your Cal.com link (see README).
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
