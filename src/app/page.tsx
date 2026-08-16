import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import { Laptop, Tablet, Phone } from "@/components/devices/DeviceFrames";
import { DesktopDashboardScreen, TabletFieldScreen, PhoneTechScreen } from "@/components/devices/AppScreens";

const trustCategories = ["AV", "Security", "Networking", "Shading", "Smart home", "Networking & IT"];

const capabilities = ["Sales", "Estimating", "Scheduling", "Dispatch", "Field ops", "Inventory", "Support"];

const teasers = [
  {
    title: "Desktop command center",
    body: "Drag-and-drop crew scheduling and a live job board for the whole office.",
  },
  {
    title: "iPad field & PM view",
    body: "Stage checklists, photo documentation, and one-tap sign-off on site.",
  },
  {
    title: "iPhone technician app",
    body: "Clock in, log parts, and get today's job without calling the office.",
  },
];

const features = [
  {
    label: "Scheduling & dispatch",
    body: "Assign jobs to the right crew and reshuffle when a job runs long — without sticky notes or status chaos.",
  },
  {
    label: "Field mobile app",
    body: "Techs clock in, log parts, and update job status from their phone, with GPS visibility for every crew.",
  },
  {
    label: "PM-managed workflow",
    body: "Every job moves through the same stages so handoffs stay clean and no task slips through.",
  },
  {
    label: "Reporting & KPIs",
    body: "Track call-backs, profitability, and technician performance without exporting spreadsheets.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <NavBar />

      <main>
        <section className="mx-auto max-w-7xl px-6 pb-20 pt-20 md:pb-28 md:pt-28">
          <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_1.15fr]">
            <div className="space-y-8">
              <FadeIn>
                <div className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/[0.06] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-brand-dark">
                  The all-in-one platform for smart home companies
                </div>
              </FadeIn>

              <FadeIn delay={80}>
                <h1 className="max-w-xl text-balance font-display text-5xl font-semibold leading-[1.05] tracking-[-0.03em] text-ink md:text-6xl">
                  Your whole business. <span className="text-gradient">One platform.</span>
                </h1>
              </FadeIn>

              <FadeIn delay={170}>
                <p className="max-w-lg text-balance text-base leading-7 text-ink/60 md:text-lg">
                  One solution designed to scale all aspects of your smart home business.
                </p>
              </FadeIn>

              <FadeIn delay={220}>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/demo"
                    className="rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-ink shadow-[0_18px_35px_rgba(245,158,11,0.28)] transition hover:-translate-y-0.5 hover:brightness-105"
                  >
                    Book a demo
                  </Link>
                  <Link
                    href="/platform"
                    className="rounded-xl border border-line px-6 py-3.5 text-sm font-semibold text-ink/80 transition hover:border-ink/25 hover:text-ink"
                  >
                    Explore the platform
                  </Link>
                </div>
              </FadeIn>

              <FadeIn delay={260}>
                <div className="flex flex-wrap gap-2 pt-2">
                  {capabilities.map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-line bg-paper-alt px-3 py-1.5 text-[11px] font-medium text-ink/60"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={160} className="relative mx-auto w-full max-w-[620px] py-6">
              <div className="pointer-events-none absolute inset-0 -z-10 rounded-[3rem] bg-[radial-gradient(circle,_rgba(96,165,250,0.16),_transparent_62%)] blur-3xl" />

              <Laptop className="mx-auto w-full max-w-[520px]">
                <DesktopDashboardScreen />
              </Laptop>

              <Tablet
                orientation="portrait"
                className="animate-float absolute -right-2 top-2 hidden w-[150px] rotate-[9deg] sm:block"
                style={{ ["--rot" as string]: "9deg" }}
              >
                <TabletFieldScreen />
              </Tablet>

              <Phone
                className="animate-float-delayed absolute -bottom-8 -left-4 w-[110px] rotate-[-11deg]"
                style={{ ["--rot" as string]: "-11deg" }}
              >
                <PhoneTechScreen />
              </Phone>
            </FadeIn>
          </div>
        </section>

        <section className="border-y border-line bg-paper-alt">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-6 text-center text-sm md:flex-row md:items-center md:justify-between md:text-left">
            <p className="uppercase tracking-[0.22em] text-ink/40">Built for teams running real jobs</p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs uppercase tracking-[0.18em] text-ink/50 md:justify-end">
              {trustCategories.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <FadeIn className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">One platform, every screen</p>
            <h2 className="mt-4 text-balance font-display text-3xl font-semibold tracking-[-0.03em] text-ink md:text-5xl">
              The same job, live everywhere your team works.
            </h2>
          </FadeIn>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {teasers.map((t, i) => (
              <FadeIn
                key={t.title}
                delay={i * 60}
                className="rounded-[1.75rem] border border-line bg-paper p-8 shadow-[0_2px_10px_rgba(15,23,42,0.03)] transition hover:-translate-y-1 hover:border-brand-light/40 hover:shadow-[0_20px_40px_rgba(15,23,42,0.06)]"
              >
                <h3 className="text-lg font-semibold text-ink">{t.title}</h3>
                <p className="mt-3 text-sm leading-6 text-ink/60">{t.body}</p>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="mt-10 text-center">
            <Link href="/platform" className="text-sm font-semibold text-brand-dark transition hover:text-brand">
              See the full platform walkthrough →
            </Link>
          </FadeIn>
        </section>

        <section className="border-t border-line bg-paper-alt">
          <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
            <FadeIn className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">Why teams switch</p>
              <h2 className="mt-4 text-balance font-display text-3xl font-semibold tracking-[-0.03em] text-ink md:text-5xl">
                Everything a modern install business needs to run clean.
              </h2>
            </FadeIn>

            <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {features.map((feature, i) => (
                <FadeIn
                  key={feature.label}
                  delay={i * 60}
                  className="rounded-[1.75rem] border border-line bg-paper p-7 shadow-[0_2px_10px_rgba(15,23,42,0.03)] transition hover:-translate-y-1 hover:border-brand-light/40 hover:shadow-[0_20px_40px_rgba(15,23,42,0.06)]"
                >
                  <h3 className="text-lg font-semibold text-ink">{feature.label}</h3>
                  <p className="mt-3 text-sm leading-6 text-ink/60">{feature.body}</p>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <FadeIn className="rounded-[2rem] border border-line bg-paper-alt px-8 py-14 text-center md:px-16 md:py-20">
            <h2 className="text-balance font-display text-3xl font-semibold tracking-[-0.03em] text-ink md:text-5xl">
              See your jobs running without the guesswork.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-ink/60">
              Let us walk through a real account and show how EliteWorker keeps crews, projects, and client
              expectations aligned from day one.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/demo"
                className="rounded-xl bg-accent px-7 py-3.5 text-sm font-semibold text-ink shadow-[0_18px_35px_rgba(245,158,11,0.28)] transition hover:-translate-y-0.5 hover:brightness-105"
              >
                Book a demo
              </Link>
              <Link
                href="/contact"
                className="rounded-xl border border-line bg-paper px-7 py-3.5 text-sm font-semibold text-ink/80 transition hover:border-ink/25 hover:text-ink"
              >
                Contact us
              </Link>
            </div>
          </FadeIn>
        </section>
      </main>

      <Footer />
    </div>
  );
}
