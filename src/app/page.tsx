import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import { ParallaxBlob } from "@/components/ParallaxBlob";
import { LaptopMockup, IpadMockup, IphoneMockup } from "@/components/devices/DeviceMockups";
import { ShowcaseItem } from "@/components/ShowcaseItem";
import { CommandCenterShowcase } from "@/components/CommandCenterShowcase";

const commandCenter = {
  kicker: "COMMAND CENTER",
  title: "Your entire company, at a glance.",
  body: "No Spreadsheets, No Sticky notes, No Text messages. One centralized system managing everything from anywhere on any device.",
  points: [
    {
      label: "Estimating",
      images: {
        laptop: {
          src: "/Laptop%20Mockups/Screenshot%202026-08-20%20191645-front.png",
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
          src: "/Laptop%20Mockups/Screenshot%202026-08-20%20191552-front.png",
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
          src: "/Laptop%20Mockups/Screenshot%202026-08-20%20191614-front.png",
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
          src: "/Laptop%20Mockups/Screenshot%202026-08-20%20191740-front.png",
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
          src: "/Laptop%20Mockups/Screenshot%202026-08-20%20191705-front.png",
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
          src: "/Laptop%20Mockups/Screenshot%202026-08-20%20191538-front.png",
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
          src: "/Laptop%20Mockups/Screenshot%202026-08-20%20191714-front.png",
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
          src: "/Laptop%20Mockups/Screenshot%202026-08-20%20191755-front.png",
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
          src: "/Laptop%20Mockups/Screenshot%202026-08-20%20191808-front.png",
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
          src: "/Laptop%20Mockups/Screenshot%202026-08-20%20191507-front.png",
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
          src: "/Laptop%20Mockups/Screenshot%202026-08-20%20191645-front.png",
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
          src: "/Laptop%20Mockups/Screenshot%202026-08-20%20191614-front.png",
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

const showcase = [
  {
    kicker: "Customer and Partner Portal",
    title: "Every job, staged and tracked",
    body: "Project managers walk a site with the full job history in hand — checklists, photos, and stage sign-off, synced the moment they tap complete.",
    points: [
      {
        label: "Stage-by-stage checklists",
        image: "/Ipad%20Mockups/IMG_0528-landscape.png",
        alt: "EliteWorker job stage checklists on iPad",
      },
      {
        label: "Photo documentation per job",
        image: "/Ipad%20Mockups/IMG_0525-landscape.png",
        alt: "EliteWorker job documentation on iPad",
      },
      {
        label: "One tap to advance a job's stage",
        image: "/Ipad%20Mockups/IMG_0521-landscape.png",
        alt: "EliteWorker dashboard on iPad",
      },
    ],
    device: "tablet" as const,
  },
  {
    kicker: "iPhone · technician app",
    title: "Your crew's whole day, in their pocket",
    body: "Clock in, see today's job, log parts, and drop a pin — techs get exactly what they need on site without calling the office for an update.",
    points: [
      {
        label: "GPS-verified clock in/out",
        image: "/Iphone%20Mockups/IMG_8657-portrait.png",
        alt: "EliteWorker technician schedule on iPhone",
      },
      {
        label: "Parts logged against the job",
        image: "/Iphone%20Mockups/IMG_8653-portrait.png",
        alt: "EliteWorker parts and tasks on iPhone",
      },
      {
        label: "Push alerts the moment plans change",
        image: "/Iphone%20Mockups/IMG_8650-portrait.png",
        alt: "EliteWorker dashboard on iPhone",
      },
    ],
    device: "phone" as const,
  },
] as const;

const stats = [
  { value: "4", label: "job stages tracked automatically" },
  { value: "1", label: "platform for office, PM, and crew" },
  { value: "3", label: "device views — desktop, tablet, phone" },
  { value: "0", label: "spreadsheets required" },
];

const sectionPadding = "py-24 md:py-32";

export default function Home() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <NavBar />

      <main>
        {/* Hero */}
        <section className={`relative overflow-hidden ${sectionPadding}`}>
          <ParallaxBlob
            speed={0.12}
            className="pointer-events-none absolute -left-24 top-[-10%] -z-10 h-104 w-104 rounded-full bg-brand/10 blur-3xl"
          />
          <ParallaxBlob
            speed={-0.08}
            className="pointer-events-none absolute -right-32 top-[40%] -z-10 h-88 w-88 rounded-full bg-accent/10 blur-3xl"
          />
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              <FadeIn>
                <h1 className="font-display text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-ink whitespace-nowrap sm:text-6xl md:text-7xl">
                  <span className="block">Your business,</span>
                  <span className="block">running itself.</span>
                </h1>
                <p className="mt-7 max-w-lg text-balance text-lg leading-8 text-ink/60 md:text-xl">
                  Built in workflows that have been battle tested to scale your service business.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link
                    href="/demo"
                    className="rounded-xl bg-accent px-7 py-4 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:brightness-105 md:text-base"
                  >
                    Book a Demo
                  </Link>
                  <Link
                    href="/beta"
                    className="rounded-xl border border-line px-7 py-4 text-sm font-semibold text-ink/80 transition hover:border-ink/25 hover:text-ink md:text-base"
                  >
                    Join the Beta
                  </Link>
                </div>
              </FadeIn>

              <div className="relative mx-auto w-full max-w-lg">
                <div className="pointer-events-none absolute inset-0 -z-10 rounded-[3rem] bg-[radial-gradient(circle,rgba(96,165,250,0.16),transparent_62%)] blur-3xl" />

                <FadeIn delay={140} className="relative z-10">
                  <LaptopMockup
                    src="/Laptop%20Mockups/Screenshot%202026-08-20%20191526-front.png"
                    alt="EliteWorker dashboard on laptop"
                    priority
                    className="mx-auto w-[92%] drop-shadow-[0_35px_60px_rgba(0,0,0,0.2)]"
                  />
                </FadeIn>

                <FadeIn delay={220} className="absolute -right-2 top-2 z-20 hidden w-[44%] sm:block">
                  <IpadMockup
                    src="/Ipad%20Mockups/IMG_0528-landscape.png"
                    alt="EliteWorker job stage checklists on iPad"
                    priority
                    className="w-full drop-shadow-[0_25px_45px_rgba(0,0,0,0.22)]"
                  />
                </FadeIn>

                <FadeIn delay={300} className="absolute -bottom-10 -left-2 z-20 w-[27%]">
                  <IphoneMockup
                    src="/Iphone%20Mockups/IMG_8657-portrait.png"
                    alt="EliteWorker technician schedule on iPhone"
                    priority
                    className="w-full drop-shadow-[0_25px_45px_rgba(0,0,0,0.22)]"
                  />
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {/* Platform showcase */}
        <section className={`border-t border-line ${sectionPadding}`}>
          <div className="mx-auto max-w-7xl px-6">
            <div className="space-y-28 md:space-y-36">
              <FadeIn>
                <CommandCenterShowcase
                  kicker={commandCenter.kicker}
                  title={commandCenter.title}
                  body={commandCenter.body}
                  points={commandCenter.points}
                />
              </FadeIn>

              {showcase.map((s, i) => (
                <FadeIn key={s.title}>
                  <ShowcaseItem
                    kicker={s.kicker}
                    title={s.title}
                    body={s.body}
                    points={s.points}
                    device={s.device}
                    reverse={i % 2 === 0}
                  />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-line bg-paper-alt">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-16 md:grid-cols-4">
            {stats.map((stat) => (
              <FadeIn key={stat.label} className="text-center md:text-left">
                <p className="font-display text-4xl font-semibold text-ink md:text-5xl">{stat.value}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.16em] text-ink/50">{stat.label}</p>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <FadeIn className="rounded-[2rem] border border-line bg-paper-alt px-8 py-14 text-center md:px-16 md:py-20">
            <h2 className="text-balance font-display text-3xl font-semibold tracking-[-0.03em] text-ink md:text-5xl">
              Want to see it running on a real account?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-ink/60">
              30 minutes, no slides — we&apos;ll walk through scheduling, dispatch, and job tracking live.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/demo"
                className="rounded-xl bg-accent px-7 py-3.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:brightness-105"
              >
                Book a demo
              </Link>
              <Link
                href="/how-it-works"
                className="rounded-xl border border-line bg-paper px-7 py-3.5 text-sm font-semibold text-ink/80 transition hover:border-ink/25 hover:text-ink"
              >
                See how it works
              </Link>
            </div>
          </FadeIn>
        </section>
      </main>

      <Footer />
    </div>
  );
}
