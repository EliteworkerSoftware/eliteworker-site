import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import { LaptopMockup, IpadMockup, IphoneMockup } from "@/components/devices/DeviceMockups";
import { HeroShowcase } from "@/components/devices/HeroShowcase";

const heroScreenRect = { left: 160 / 1996, top: 28 / 1148, width: 1679 / 1996, height: 938 / 1148 };

const trustCategories = ["AV", "Security", "Networking", "Shading", "Smart home", "Networking & IT"];

const heroCapabilities = [
  { label: "Sales", screenSrc: "/Laptop%20Mockups/191705-screen-crop.png", alt: "EliteWorker sales proposal" },
  { label: "Estimating", screenSrc: "/Laptop%20Mockups/191645-screen-crop.png", alt: "EliteWorker estimates list" },
  { label: "Scheduling", screenSrc: "/Laptop%20Mockups/191552-screen-crop.png", alt: "EliteWorker scheduling calendar" },
  { label: "Dispatch", screenSrc: "/Laptop%20Mockups/191538-screen-crop.png", alt: "EliteWorker crew dispatch view" },
  { label: "Field ops", screenSrc: "/Laptop%20Mockups/191755-screen-crop.png", alt: "EliteWorker field job overview" },
  { label: "Inventory", screenSrc: "/Laptop%20Mockups/191808-screen-crop.png", alt: "EliteWorker product inventory" },
  { label: "Support", screenSrc: "/Laptop%20Mockups/191714-screen-crop.png", alt: "EliteWorker job clock-in reminder" },
];

const teasers = [
  {
    title: "Desktop command center",
    body: "See every crew's week laid out by day, drag jobs between technicians, and spot delays before they become callbacks.",
    points: ["Drag-and-drop crew scheduling", "Live job board across every stage", "KPIs that update as work happens"],
    device: "laptop",
    image: "/Laptop%20Mockups/Screenshot%202026-08-20%20191552-front.png",
    imageMaxWidth: "max-w-full",
    alt: "EliteWorker scheduling calendar on laptop",
  },
  {
    title: "iPad field & PM view",
    body: "Project managers walk a site with the full job history in hand — checklists, photos, and stage sign-off, synced the moment they tap complete.",
    points: ["Stage-by-stage checklists", "Photo documentation per job", "One tap to advance a job's stage"],
    device: "ipad",
    image: "/Ipad%20Mockups/IMG_0528-landscape.png",
    imageMaxWidth: "max-w-full",
    alt: "EliteWorker job stage checklists on iPad",
  },
  {
    title: "iPhone technician app",
    body: "Clock in, see today's job, log parts, and drop a pin — techs get exactly what they need on site without calling the office.",
    points: ["GPS-verified clock in/out", "Parts logged against the job", "Push alerts the moment plans change"],
    device: "iphone",
    image: "/Iphone%20Mockups/IMG_8657-portrait.png",
    imageMaxWidth: "max-w-55",
    alt: "EliteWorker technician clock-in on iPhone",
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
        <section className="overflow-hidden pt-14 pb-16 md:pt-20 md:pb-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <FadeIn>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/6 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-brand-dark">
                The all-in-one platform for smart home companies
              </div>
            </FadeIn>

            <FadeIn delay={80}>
              <h1 className="mt-6 text-balance font-display text-5xl font-semibold leading-[1.05] tracking-[-0.03em] text-ink md:text-7xl">
                Chaos, meet <span className="text-gradient">clarity.</span>
              </h1>
            </FadeIn>

            <FadeIn delay={170}>
              <p className="mx-auto mt-6 max-w-xl text-balance text-base leading-7 text-ink/60 md:text-lg">
                Every worker, every job, every client — always in sync.
              </p>
            </FadeIn>

            <FadeIn delay={220}>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href="/demo"
                  className="rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:brightness-105"
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
          </div>

          <FadeIn delay={260}>
            <HeroShowcase
              blankSrc="/Laptop%20Mockups/191526-blank-tight.png"
              defaultScreenSrc="/Laptop%20Mockups/191526-screen-crop.png"
              defaultAlt="EliteWorker dashboard on laptop"
              capabilities={heroCapabilities}
              screenRect={heroScreenRect}
            />
          </FadeIn>
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

          <div className="mt-16 grid items-start gap-10 md:grid-cols-3">
            {teasers.map((t, i) => (
              <FadeIn key={t.title} delay={i * 60}>
                {t.device === "laptop" && (
                  <LaptopMockup
                    src={t.image}
                    alt={t.alt}
                    className={`mx-auto ${t.imageMaxWidth} drop-shadow-[0_25px_50px_rgba(15,23,42,0.18)] transition duration-300 hover:-translate-y-1`}
                  />
                )}
                {t.device === "ipad" && (
                  <IpadMockup
                    src={t.image}
                    alt={t.alt}
                    className={`mx-auto ${t.imageMaxWidth} drop-shadow-[0_25px_50px_rgba(15,23,42,0.18)] transition duration-300 hover:-translate-y-1`}
                  />
                )}
                {t.device === "iphone" && (
                  <IphoneMockup
                    src={t.image}
                    alt={t.alt}
                    className={`mx-auto ${t.imageMaxWidth} drop-shadow-[0_25px_50px_rgba(15,23,42,0.18)] transition duration-300 hover:-translate-y-1`}
                  />
                )}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-ink">{t.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-ink/60">{t.body}</p>
                  <ul className="mt-4 space-y-2">
                    {t.points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-sm text-ink/75">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
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
                className="rounded-xl bg-accent px-7 py-3.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:brightness-105"
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
