import type { Metadata } from "next";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Book a Demo",
  description: "Book a live 30-minute walkthrough of EliteWorker with our team.",
};

// TODO: after you create your Cal.com account, set NEXT_PUBLIC_CAL_LINK in
// .env.local to your real booking link, e.g. "your-username/eliteworker-demo"
const calLink = process.env.NEXT_PUBLIC_CAL_LINK;

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-graphite text-paper">
      <NavBar />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-live-cyan">Live walkthrough</p>
        <h1 className="mt-4 font-display text-3xl font-semibold md:text-4xl">Book a demo</h1>
        <p className="mt-4 max-w-xl text-paper/70">
          30 minutes, no slides. Pick a time and we&apos;ll show you EliteWorker
          running on a real account — scheduling, dispatch, and job tracking.
        </p>

        <div className="mt-10 overflow-hidden rounded-lg border border-wire-line bg-graphite-2">
          {calLink ? (
            <iframe
              src={`https://cal.com/${calLink}?embed=true&theme=dark`}
              width="100%"
              height="700"
              style={{ border: "none" }}
              title="Book a demo"
            />
          ) : (
            <div className="p-10 text-center text-sm text-paper/60">
              Booking calendar not connected yet. Set{" "}
              <code className="rounded bg-graphite px-1.5 py-0.5 font-mono text-signal-amber">
                NEXT_PUBLIC_CAL_LINK
              </code>{" "}
              in your environment variables to your Cal.com link (see README).
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
