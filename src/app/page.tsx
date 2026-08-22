import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import { BarChartMotif } from "@/components/BarChartMotif";
import { HorizontalBarsMotif } from "@/components/HorizontalBarsMotif";
import { LaptopMockup, IpadMockup, IphoneMockup } from "@/components/devices/DeviceMockups";
import { ShowcaseItem } from "@/components/ShowcaseItem";
import { CommandCenterShowcase } from "@/components/CommandCenterShowcase";
import { MetricsSlides } from "@/components/MetricsSlides";
import { highlightWord } from "@/lib/highlightWord";
import {
  SaleIcon,
  OrderIcon,
  ScheduleIcon,
  WiringIcon,
  InstallationIcon,
  ProgrammingIcon,
  QualityCheckIcon,
  TutorialIcon,
  BillingIcon,
} from "@/components/SolutionIcons";

const commandCenter = {
  kicker: "COMMAND CENTER",
  title: "Your entire company, at a glance.",
  highlight: "glance.",
  points: [
    {
      label: "Estimating",
      images: {
        laptop: {
          src: "/Laptop%20Mockups/proposal.png",
          alt: "EliteWorker estimates list on laptop",
        },
        tablet: {
          src: "/Ipad%20Mockups/IMG_0521-landscape.png",
          alt: "EliteWorker dashboard on iPad",
        },
        phone: {
          src: "/Iphone%20Mockups/IMG_8650-portrait.png",
          alt: "EliteWorker dashboard on iPhone",
        },
      },
    },
    {
      label: "Scheduling",
      images: {
        laptop: {
          src: "/Laptop%20Mockups/MySchedule.png",
          alt: "EliteWorker scheduling calendar on laptop",
        },
        tablet: {
          src: "/Ipad%20Mockups/IMG_0528-landscape.png",
          alt: "EliteWorker schedule on iPad",
        },
        phone: {
          src: "/Iphone%20Mockups/IMG_8657-portrait.png",
          alt: "EliteWorker schedule on iPhone",
        },
      },
    },
    {
      label: "Project Management",
      images: {
        laptop: {
          src: "/Laptop%20Mockups/MyJobs.png",
          alt: "EliteWorker job board on laptop",
        },
        tablet: {
          src: "/Ipad%20Mockups/IMG_0525-landscape.png",
          alt: "EliteWorker job list on iPad",
        },
        phone: {
          src: "/Iphone%20Mockups/IMG_8651-portrait.png",
          alt: "EliteWorker job detail on iPhone",
        },
      },
    },
    {
      label: "Workorders",
      images: {
        laptop: {
          src: "/Laptop%20Mockups/workorderdropdown.png",
          alt: "EliteWorker workorder tasks on laptop",
        },
        tablet: {
          src: "/Ipad%20Mockups/IMG_0528-landscape.png",
          alt: "EliteWorker workorder stages on iPad",
        },
        phone: {
          src: "/Iphone%20Mockups/IMG_8653-portrait.png",
          alt: "EliteWorker workorder tasks on iPhone",
        },
      },
    },
    {
      label: "Billing",
      images: {
        laptop: {
          src: "/Laptop%20Mockups/Salespage.png",
          alt: "EliteWorker proposal and billing on laptop",
        },
        tablet: {
          src: "/Ipad%20Mockups/IMG_0519-landscape.png",
          alt: "EliteWorker on iPad",
        },
        phone: {
          src: "/Iphone%20Mockups/IMG_8650-portrait.png",
          alt: "EliteWorker dashboard on iPhone",
        },
      },
    },
    {
      label: "Payroll",
      images: {
        laptop: {
          src: "/Laptop%20Mockups/clockinreminder.png",
          alt: "EliteWorker payroll on laptop",
        },
        tablet: {
          src: "/Ipad%20Mockups/IMG_0521-landscape.png",
          alt: "EliteWorker dashboard on iPad",
        },
        phone: {
          src: "/Iphone%20Mockups/IMG_8657-portrait.png",
          alt: "EliteWorker on iPhone",
        },
      },
    },
    {
      label: "HR Management",
      images: {
        laptop: {
          src: "/Laptop%20Mockups/worker_login.png",
          alt: "EliteWorker HR management on laptop",
        },
        tablet: {
          src: "/Ipad%20Mockups/IMG_0525-landscape.png",
          alt: "EliteWorker job list on iPad",
        },
        phone: {
          src: "/Iphone%20Mockups/IMG_8651-portrait.png",
          alt: "EliteWorker job detail on iPhone",
        },
      },
    },
    {
      label: "Inventory",
      images: {
        laptop: {
          src: "/Laptop%20Mockups/products.png",
          alt: "EliteWorker inventory on laptop",
        },
        tablet: {
          src: "/Ipad%20Mockups/IMG_0528-landscape.png",
          alt: "EliteWorker schedule on iPad",
        },
        phone: {
          src: "/Iphone%20Mockups/IMG_8653-portrait.png",
          alt: "EliteWorker workorder tasks on iPhone",
        },
      },
    },
    {
      label: "Commission Tracking",
      images: {
        laptop: {
          src: "/Laptop%20Mockups/job.png",
          alt: "EliteWorker commission tracking on laptop",
        },
        tablet: {
          src: "/Ipad%20Mockups/IMG_0519-landscape.png",
          alt: "EliteWorker on iPad",
        },
        phone: {
          src: "/Iphone%20Mockups/IMG_8650-portrait.png",
          alt: "EliteWorker dashboard on iPhone",
        },
      },
    },
    {
      label: "Password Management",
      images: {
        laptop: {
          src: "/Laptop%20Mockups/Calendar.png",
          alt: "EliteWorker password management on laptop",
        },
        tablet: {
          src: "/Ipad%20Mockups/IMG_0521-landscape.png",
          alt: "EliteWorker dashboard on iPad",
        },
        phone: {
          src: "/Iphone%20Mockups/IMG_8657-portrait.png",
          alt: "EliteWorker on iPhone",
        },
      },
    },
    {
      label: "Automated Alerts",
      images: {
        laptop: {
          src: "/Laptop%20Mockups/proposal.png",
          alt: "EliteWorker automated alerts on laptop",
        },
        tablet: {
          src: "/Ipad%20Mockups/IMG_0525-landscape.png",
          alt: "EliteWorker job list on iPad",
        },
        phone: {
          src: "/Iphone%20Mockups/IMG_8651-portrait.png",
          alt: "EliteWorker job detail on iPhone",
        },
      },
    },
    {
      label: "Employee Metrics",
      images: {
        laptop: {
          src: "/Laptop%20Mockups/MyJobs.png",
          alt: "EliteWorker employee metrics on laptop",
        },
        tablet: {
          src: "/Ipad%20Mockups/IMG_0528-landscape.png",
          alt: "EliteWorker schedule on iPad",
        },
        phone: {
          src: "/Iphone%20Mockups/IMG_8653-portrait.png",
          alt: "EliteWorker workorder tasks on iPhone",
        },
      },
    },
  ],
} as const;

// Starts near the sidebar (right where the click just landed) at body height —
// not the page header — then sweeps left-to-right across the body.
const contentSweep = [
  { x: 20, y: 42 },
  { x: 90, y: 42 },
] as const;

const customerPortalDemoSteps = [
  {
    src: "/No%20Device%20Screenshots/Customer_overview.png",
    alt: "EliteWorker customer portal overview tab",
    tabTarget: { x: 6, y: 14.5 },
    contentPan: contentSweep,
  },
  {
    src: "/No%20Device%20Screenshots/customer_proposals.png",
    alt: "EliteWorker customer portal proposals tab",
    tabTarget: { x: 6, y: 18.5 },
    contentPan: contentSweep,
  },
  {
    src: "/No%20Device%20Screenshots/Customer_credits.png",
    alt: "EliteWorker customer portal credits tab",
    tabTarget: { x: 6, y: 22.1 },
    contentPan: contentSweep,
  },
  {
    src: "/No%20Device%20Screenshots/Customer_invoices.png",
    alt: "EliteWorker customer portal invoices tab",
    tabTarget: { x: 6, y: 25.9 },
    contentPan: contentSweep,
  },
] as const;

const showcase = [
  {
    kicker: "Customer Portal",
    title: "No More \"Can You Send Me an Update?\"",
    highlight: "Update?",
    points: [
      {
        label: "Review and accept proposals online, with a full history of past approvals",
        image: "/No%20Device%20Screenshots/Customer_invoices.png",
        alt: "EliteWorker invoices in the customer portal",
      },
      {
        label: "Pay invoices securely, with partial payment tracking so nothing's a mystery",
        image: "/No%20Device%20Screenshots/Customer_invoices.png",
        alt: "EliteWorker invoices in the customer portal",
      },
      {
        label: "See account credits and where they've been applied",
        image: "/No%20Device%20Screenshots/Customer_invoices.png",
        alt: "EliteWorker invoices in the customer portal",
      },
      {
        label: "Track project status in real time — no \"can you send me an update?\" emails",
        image: "/No%20Device%20Screenshots/Customer_invoices.png",
        alt: "EliteWorker invoices in the customer portal",
      },
      {
        label: "One login, always current — no more digging through email threads for the latest version",
        image: "/No%20Device%20Screenshots/Customer_invoices.png",
        alt: "EliteWorker invoices in the customer portal",
      },
    ],
    device: "tablet" as const,
    interactive: false,
    bare: true,
    demoSteps: customerPortalDemoSteps,
  },
  {
    kicker: "Partner Portal",
    title: "Your Partners, Always in the Loop",
    highlight: "Loop",
    points: [
      {
        label: "Track commission on every referred project, automatically calculated from real job data",
        image: "/Iphone%20Mockups/IMG_8652-portrait.png",
        alt: "EliteWorker commission tracking on iPhone",
      },
      {
        label: "See payment status — pending vs. paid — without asking \"when do I get paid?\"",
        image: "/Iphone%20Mockups/IMG_8654-portrait.png",
        alt: "EliteWorker commission payment status on iPhone",
      },
      {
        label: "View project details tied to each commission, not just a dollar amount",
        image: "/Iphone%20Mockups/IMG_8656-portrait.png",
        alt: "EliteWorker project details on iPhone",
      },
      {
        label: "One login, always current — no more chasing updates over email",
        image: "/Iphone%20Mockups/IMG_8658-portrait.png",
        alt: "EliteWorker partner portal login on iPhone",
      },
    ],
    device: "phone" as const,
    interactive: true,
    bare: false,
    demoSteps: undefined,
  },
] as const;

const metrics = {
  kicker: "Metrics",
  title: "Know exactly what happened, on every job.",
  highlight: "job.",
  subtitle:
    "Every hour, every task, every technician — tracked automatically, so you never have to ask “what actually got done today?”",
  points: [
    "Track exactly how long each employee was onsite, down to the minute",
    "See which tasks were completed, by which employee, on which day",
    "Compare hours sold vs. hours actually used, on every job",
    "Full task-level history — no guessing what happened last week",
    "Timesheets and job activity, tied together automatically — no separate systems to reconcile",
  ],
} as const;

const journeySteps = [
  { label: "Sale", Icon: SaleIcon },
  { label: "Bill", Icon: BillingIcon },
  { label: "Order", Icon: OrderIcon },
  { label: "Schedule", Icon: ScheduleIcon },
  { label: "Prewire", Icon: WiringIcon },
  { label: "Install", Icon: InstallationIcon },
  { label: "Program", Icon: ProgrammingIcon },
  { label: "Quality", Icon: QualityCheckIcon },
  { label: "Tutorial", Icon: TutorialIcon },
] as const;

const sectionPadding = "py-24 md:py-32";

export default function Home() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <NavBar />

      <main>
        {/* Hero */}
        <section className={`relative isolate z-10 ${sectionPadding}`}>
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-x-clip">
            <HorizontalBarsMotif
              speed={0.28}
              className="absolute -left-6 top-[2%] h-44 w-44 opacity-[0.06] sm:-left-12 sm:h-84 sm:w-84 lg:-left-14 lg:h-96 lg:w-96 xl:-left-17 xl:h-116 xl:w-116"
            />
            <BarChartMotif
              speed={-0.22}
              className="absolute -right-6 top-[40%] h-44 w-44 opacity-[0.06] sm:-right-12 sm:h-84 sm:w-84 lg:-right-14 lg:h-96 lg:w-96 xl:-right-17 xl:h-116 xl:w-116"
            />
          </div>
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid items-center gap-16 lg:grid-cols-[1fr_1.35fr]">
              <FadeIn>
                <h1 className="font-display text-6xl font-semibold leading-[0.95] tracking-[-0.04em] text-ink whitespace-nowrap sm:text-7xl md:text-8xl">
                  <span className="block">Your Business,</span>
                  <span className="block">
                    on <span className="text-gradient">Autopilot.</span>
                  </span>
                </h1>
                <p className="mt-7 max-w-lg text-balance text-lg leading-8 text-ink/60 md:text-xl">
                  Every job, every customer, every worker — orchestrated automatically, all in one place.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link
                    href="/demo"
                    className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-105 md:text-base"
                  >
                    Book a Demo
                  </Link>
                </div>
              </FadeIn>

              <div className="relative mx-auto -mb-40 w-full max-w-3xl">
                <FadeIn delay={140} className="relative z-10">
                  <LaptopMockup
                    src="/Laptop%20Mockups/Dashboard.png"
                    alt="EliteWorker dashboard on laptop"
                    priority
                    className="mx-auto w-[92%]"
                  />
                </FadeIn>

                <FadeIn delay={220} className="absolute -right-2 top-2 z-20 w-[44%]">
                  <IpadMockup
                    src="/Ipad%20Mockups/IMG_0528-landscape.png"
                    alt="EliteWorker job stage checklists on iPad"
                    priority
                    className="w-full"
                  />
                </FadeIn>

                <FadeIn delay={300} className="absolute -bottom-10 -left-2 z-20 w-[27%]">
                  <IphoneMockup
                    src="/Iphone%20Mockups/IMG_8657-portrait.png"
                    alt="EliteWorker technician schedule on iPhone"
                    priority
                    className="w-full"
                  />
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {/* Journey */}
        <section className="relative bg-paper-alt">
          <div className="mx-auto max-w-5xl px-6 pt-44 pb-16 text-center md:pt-36 md:pb-20">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/40">
              A single solution to run and scale your business every step of the way
            </p>
            <FadeIn className="mt-10 grid grid-cols-3 justify-items-center gap-x-6 gap-y-8 px-2 sm:flex sm:flex-nowrap sm:justify-center sm:gap-8 sm:overflow-x-auto sm:scrollbar-none">
              {journeySteps.map(({ label, Icon }) => (
                <div key={label} className="flex w-16 shrink-0 flex-col items-center gap-3 sm:w-20">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-line bg-paper sm:h-16 sm:w-16">
                    <Icon className="h-6 w-6 text-ink/70 sm:h-7 sm:w-7" />
                  </div>
                  <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-ink/60 sm:text-xs">{label}</span>
                </div>
              ))}
            </FadeIn>
          </div>
        </section>

        {/* Platform showcase */}
        <section className={`relative isolate ${sectionPadding}`}>
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-x-clip">
            <BarChartMotif
              speed={0.25}
              className="absolute -left-6 top-[4%] h-44 w-44 opacity-[0.06] sm:-left-12 sm:h-84 sm:w-84 lg:-left-14 lg:h-96 lg:w-96 xl:-left-17 xl:h-116 xl:w-116"
            />
            <HorizontalBarsMotif
              speed={-0.25}
              className="absolute -left-6 top-[48%] h-44 w-44 opacity-[0.06] sm:-left-12 sm:h-84 sm:w-84 lg:-left-14 lg:h-96 lg:w-96 xl:-left-17 xl:h-116 xl:w-116"
            />
            <BarChartMotif
              speed={0.18}
              className="absolute -right-6 bottom-[4%] h-44 w-44 opacity-[0.06] sm:-right-12 sm:h-84 sm:w-84 lg:-right-14 lg:h-96 lg:w-96 xl:-right-17 xl:h-116 xl:w-116"
            />
          </div>
          <div className="mx-auto max-w-7xl px-6">
            <div className="space-y-28 md:space-y-36">
              <FadeIn>
                <CommandCenterShowcase
                  kicker={commandCenter.kicker}
                  title={commandCenter.title}
                  highlight={commandCenter.highlight}
                  points={commandCenter.points}
                  reverse
                />
              </FadeIn>

              {showcase.map((s, i) => (
                <FadeIn key={s.title}>
                  <ShowcaseItem
                    kicker={s.kicker}
                    title={s.title}
                    highlight={s.highlight}
                    points={s.points}
                    device={s.device}
                    reverse={i % 2 !== 0}
                    interactive={s.interactive}
                    bare={s.bare}
                    demoSteps={s.demoSteps}
                  />
                </FadeIn>
              ))}

              <FadeIn>
                <div className="text-center">
                  <p className="inline-block rounded-full bg-brand-dark px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-white">
                    {metrics.kicker}
                  </p>
                  <h2 className="mt-3 text-balance font-display text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-ink sm:text-6xl md:text-7xl">
                    {highlightWord(metrics.title, metrics.highlight)}
                  </h2>
                  <p className="mx-auto mt-4 max-w-2xl text-balance text-base leading-7 text-ink/60">
                    {metrics.subtitle}
                  </p>
                </div>

                <div className="mt-12 flex justify-center">
                  <MetricsSlides />
                </div>

                <ul className="mx-auto mt-12 grid max-w-5xl gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                  {metrics.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm text-ink/70">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {point}
                    </li>
                  ))}
                </ul>
              </FadeIn>
            </div>
          </div>
        </section>


        {/* Final CTA */}
        <section className="relative isolate px-6 py-24 md:py-32">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-x-clip">
            <BarChartMotif
              speed={0.22}
              className="absolute -left-6 bottom-[8%] h-44 w-44 opacity-[0.06] sm:-left-12 sm:h-84 sm:w-84 lg:-left-14 lg:h-96 lg:w-96 xl:-left-17 xl:h-116 xl:w-116"
            />
          </div>
          <FadeIn className="relative mx-auto max-w-7xl rounded-[2rem] border border-line bg-paper-alt px-8 py-14 text-center md:px-16 md:py-20">
            <h2 className="text-balance font-display text-5xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-6xl md:text-7xl">
              <span className="text-gradient-navy">Want to see it running on a real account?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-ink/60">
              30 minutes, no slides — we&apos;ll walk through scheduling, Job Management, and the entire flow live.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/demo"
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-105"
              >
                Book a demo
              </Link>
            </div>
          </FadeIn>
        </section>
      </main>

      <Footer />
    </div>
  );
}
