import Link from "next/link";
import NavBar from "@/components/NavBar";
import JobStatusSchematic from "@/components/JobStatusSchematic";
import ContactForm from "@/components/ContactForm";

const features = [
  {
    label: "Scheduling & dispatch",
    body: "Assign jobs to the right crew, see every truck's day at a glance, and reshuffle when a job runs long — without a wall of sticky notes.",
  },
  {
    label: "Field mobile app",
    body: "Techs clock in, log parts, and update job status from their phone or Apple Watch, with GPS so you know where every crew is right now.",
  },
  {
    label: "PM-managed workflow",
    body: "Every job moves through the same stages — prewire, trim, programming, final walkthrough — so nothing slips through the cracks between handoffs.",
  },
  {
    label: "Reporting & KPIs",
    body: "See job profitability, technician performance, and callback rates without exporting a spreadsheet.",
  },
];

const workflow = [
  { step: "01", label: "Prewire", body: "Job is scheduled and dispatched to the crew before drywall goes up." },
  { step: "02", label: "Trim", body: "Devices, panels, and displays go in. Techs log parts used against the job." },
  { step: "03", label: "Programming", body: "Systems are configured and tested against the original design." },
  { step: "04", label: "Final walkthrough", body: "Client sign-off, punch list closed, job handed to support." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-graphite text-paper">
      <NavBar />

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-live-cyan">
            Built for smart home integrators
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-balance md:text-5xl">
            Run every job from prewire to final walkthrough — in one place.
          </h1>
          <p className="mt-6 max-w-md text-paper/70">
            EliteWorker is the operations platform for AV, security, networking,
            and shading contractors. Scheduling, dispatch, field reporting, and
            job tracking, built by people who run integration jobs every day.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/demo"
              className="rounded-md bg-signal-amber px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Book a demo
            </Link>
            <Link
              href="/#features"
              className="rounded-md border border-wire-line px-6 py-3 text-sm font-semibold text-paper/80 transition hover:border-paper/40 hover:text-paper"
            >
              See what it does
            </Link>
          </div>
        </div>
        <JobStatusSchematic />
      </section>

      {/* Credibility strip */}
      <section className="border-y border-wire-line bg-graphite-2/60">
        <div className="mx-auto max-w-6xl px-6 py-6 text-center text-sm text-paper/60">
          Built inside a working integration company and refined on real jobs before anyone else ever saw it.
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="font-display text-3xl font-semibold text-balance md:text-4xl">
          Everything a job needs, nothing it doesn&apos;t.
        </h2>
        <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-wire-line bg-wire-line md:grid-cols-2">
          {features.map((f) => (
            <div key={f.label} className="bg-graphite-2 p-8">
              <h3 className="font-display text-lg font-semibold text-signal-amber">{f.label}</h3>
              <p className="mt-3 text-sm leading-relaxed text-paper/70">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="font-display text-3xl font-semibold text-balance md:text-4xl">
          A job&apos;s path through EliteWorker.
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-4">
          {workflow.map((w) => (
            <div key={w.step} className="border-t-2 border-live-cyan pt-4">
              <span className="font-mono text-xs text-live-cyan">{w.step}</span>
              <h3 className="mt-2 font-display text-base font-semibold">{w.label}</h3>
              <p className="mt-2 text-sm text-paper/60">{w.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section id="contact" className="border-t border-wire-line bg-graphite-2/60">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-semibold">See it running on a real job.</h2>
            <p className="mt-2 text-sm text-paper/60">30 minutes, no slides — we&apos;ll walk through a live account.</p>
            <Link
              href="/demo"
              className="mt-6 inline-block rounded-md bg-signal-amber px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Book a demo
            </Link>
            <p className="mt-8 text-sm text-paper/50">Prefer to just ask a question first? Use the form.</p>
          </div>
          <ContactForm />
        </div>
      </section>

      <footer className="border-t border-wire-line px-6 py-10 text-center text-xs text-paper/40">
        © {new Date().getFullYear()} EliteWorker. Built by Elite Smart Home, LLC.
      </footer>
    </div>
  );
}
