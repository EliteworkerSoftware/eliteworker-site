import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";
import FadeIn from "@/components/FadeIn";
import { LaptopMockup, IpadMockup, IphoneMockup } from "@/components/devices/DeviceMockups";

export const metadata: Metadata = {
  title: "Platform",
  description:
    "See EliteWorker's dispatch board, field PM tablet workflow, and technician mobile app across desktop, iPad, and iPhone.",
};

const showcase = [
  {
    kicker: "Desktop command center",
    title: "Dispatch and scheduling, at a glance",
    body: "See every crew's week laid out by day, drag jobs between technicians, and spot delays before they become callbacks. Built for the office chair, not a spreadsheet.",
    points: ["Drag-and-drop crew scheduling", "Live job board across every stage", "KPIs that update as work happens"],
    device: "laptop",
  },
  {
    kicker: "iPad · field & PM view",
    title: "Every job, staged and tracked",
    body: "Project managers walk a site with the full job history in hand — checklists, photos, and stage sign-off, synced the moment they tap complete.",
    points: ["Stage-by-stage checklists", "Photo documentation per job", "One tap to advance a job's stage"],
    device: "tablet",
  },
  {
    kicker: "iPhone · technician app",
    title: "Your crew's whole day, in their pocket",
    body: "Clock in, see today's job, log parts, and drop a pin — techs get exactly what they need on site without calling the office for an update.",
    points: ["GPS-verified clock in/out", "Parts logged against the job", "Push alerts the moment plans change"],
    device: "phone",
  },
] as const;

const stats = [
  { value: "4", label: "job stages tracked automatically" },
  { value: "1", label: "platform for office, PM, and crew" },
  { value: "3", label: "device views — desktop, tablet, phone" },
  { value: "0", label: "spreadsheets required" },
];

export default function PlatformPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <NavBar />

      <main>
        <PageIntro
          kicker="The platform"
          title="One system, live on every screen your team touches."
          subtitle="EliteWorker keeps the office, your project managers, and every crew on the same version of the job — no re-keying, no status calls, no surprises."
        />

        <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="space-y-28 md:space-y-36">
            {showcase.map((s, i) => (
              <FadeIn key={s.title} className="grid items-center gap-14 lg:grid-cols-2">
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">{s.kicker}</p>
                  <h2 className="mt-3 text-balance text-2xl font-semibold tracking-[-0.02em] text-ink md:text-3xl">
                    {s.title}
                  </h2>
                  <p className="mt-4 max-w-md text-sm leading-7 text-ink/60 md:text-base">{s.body}</p>
                  <ul className="mt-6 space-y-2.5">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-sm text-ink/75">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`flex justify-center ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-0 -z-10 rounded-[3rem] bg-[radial-gradient(circle,_rgba(59,130,246,0.14),_transparent_65%)] blur-3xl" />
                    {s.device === "laptop" && (
                      <LaptopMockup
                        src="/Laptop%20Mockups/Screenshot%202026-08-20%20191552-front.png"
                        alt="EliteWorker scheduling calendar on laptop"
                        className="w-full max-w-140 drop-shadow-[0_35px_60px_rgba(0,0,0,0.3)]"
                      />
                    )}
                    {s.device === "tablet" && (
                      <IpadMockup
                        src="/Ipad%20Mockups/IMG_0528-landscape.png"
                        alt="EliteWorker job stage checklists on iPad"
                        className="w-105 drop-shadow-[0_35px_60px_rgba(0,0,0,0.3)]"
                      />
                    )}
                    {s.device === "phone" && (
                      <IphoneMockup
                        src="/Iphone%20Mockups/IMG_8655-portrait.png"
                        alt="EliteWorker technician clock-in on iPhone"
                        className="w-55 drop-shadow-[0_35px_60px_rgba(0,0,0,0.3)]"
                      />
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

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
