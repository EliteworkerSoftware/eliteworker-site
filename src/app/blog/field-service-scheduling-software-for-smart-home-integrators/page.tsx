import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";
import FadeIn from "@/components/FadeIn";
import { PillButton } from "@/components/PillButton";
import { StageTimeline } from "@/components/StageTimeline";
import { getBlogPost } from "@/lib/blogPosts";

const post = getBlogPost("field-service-scheduling-software-for-smart-home-integrators")!;
const siteUrl = "https://eliteworker.com";

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
};

const faqs = [
  {
    question: "What is field service scheduling software?",
    answer:
      "Field service scheduling software plans and tracks who's doing what job, where, and when for a business that sends technicians or crews out to work at customer locations rather than a fixed shop. Most of it was built for trades that finish a job in a single visit — an HVAC repair, a plumbing call, a delivery.",
  },
  {
    question: "Why doesn't general field service software work well for smart home integrators?",
    answer:
      "Smart home and low-voltage installs aren't single-visit jobs. A project runs through Prewire, Installation, Programming, Quality Check, and Tutorial — often over weeks, and on new-construction projects, over months — with different crew members on-site at different stages and the whole thing stalled if a rack or a run of cable hasn't shown up yet. Software built around \"one technician, one visit, one ticket\" has no real concept of a job with stages, dependencies, and a crew that rotates through it over time — so integrators end up bolting a spreadsheet or a shared group chat onto whatever tool they bought to cover the gap.",
  },
  {
    question: "What should a smart home integration company actually look for in scheduling software?",
    answer:
      "Five things, in order of how often they get overlooked: job-stage tracking (Prewire, Installation, Programming, Quality Check, Tutorial — not just \"open\" or \"closed\"), the ability to assign and reassign crew across a job that spans days, weeks, or months, visibility into what a stage is waiting on (materials, equipment, a subcontractor) before it can start, client communication that's tied to the actual job stage instead of a generic status update, and reporting that shows crew utilization across concurrent projects — not just per-ticket time.",
  },
  {
    question: "Is EliteWorker available now?",
    answer:
      "EliteWorker is currently in a beta rollout for integrators. You can apply for early access or book a live walkthrough to see it running on a real account.",
  },
];

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: post.title,
  description: post.description,
  datePublished: post.publishedAt,
  dateModified: post.publishedAt,
  author: { "@type": "Organization", name: "EliteWorker", url: siteUrl },
  publisher: { "@type": "Organization", name: "EliteWorker", url: siteUrl },
  mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function BlogPostPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <NavBar />

      <main>
        <PageIntro kicker="Resources" title={post.title} subtitle={post.excerpt} compactBottom />

        <div className="mx-auto max-w-2xl px-6 pt-10 md:pt-14">
          <FadeIn>
            <StageTimeline />
          </FadeIn>
        </div>

        <article className="mx-auto max-w-3xl px-6 pt-10 pb-16 md:pt-14">
          <FadeIn className="space-y-6 text-base leading-8 text-ink/75">
            <p>
              Most field service software was built for jobs that finish in one visit — a technician shows up,
              fixes the thing, closes the ticket. That model works fine for an HVAC repair call. It breaks down
              almost immediately for a smart home install, where a single project moves through Prewire,
              Installation, Programming, Quality Check, and Tutorial — often weeks apart, and months apart on
              new-construction projects, with different people on-site at each stage.
            </p>

            <h2 className="pt-4 text-2xl font-semibold text-ink">Why generic tools fall short here</h2>
            <p>
              Ask most field service platforms what stage a job is in and the honest answer is: they don&rsquo;t
              really know. They track &ldquo;open&rdquo; and &ldquo;closed,&rdquo; not Prewire versus Installation
              versus Quality Check. They assume one technician per ticket, not a crew that rotates through a project over
              several weeks. And they have no concept of a job being blocked — waiting on a rack to arrive, waiting
              on a run of cable, waiting on a subcontractor — because single-visit trades rarely run into that.
              Integrators end up running the actual job in a group text and a spreadsheet, with the software just
              tracking the invoice.
            </p>

            <h2 className="pt-4 text-2xl font-semibold text-ink">
              What to actually look for in scheduling software for integrators
            </h2>
            <ul className="list-disc space-y-3 pl-6">
              <li>
                <span className="font-semibold text-ink">Job-stage tracking</span> — Prewire, Installation,
                Programming, Quality Check, and Tutorial as real stages, not a single &ldquo;in progress&rdquo;
                status covering a six-week project.
              </li>
              <li>
                <span className="font-semibold text-ink">Crew assignment across time</span> — the ability to put
                different people on a job at different stages, not just one technician locked to one ticket.
              </li>
              <li>
                <span className="font-semibold text-ink">Dependency visibility</span> — knowing a stage can&rsquo;t
                start yet because equipment, materials, or a sub hasn&rsquo;t shown up, instead of finding out on
                the job site.
              </li>
              <li>
                <span className="font-semibold text-ink">Stage-aware client communication</span> — updates tied to
                where the job actually is, not a generic &ldquo;your technician is on the way&rdquo; text.
              </li>
              <li>
                <span className="font-semibold text-ink">Crew utilization reporting</span> — visibility across every
                concurrent project, not just time logged per ticket.
              </li>
            </ul>

            <h2 className="pt-4 text-2xl font-semibold text-ink">Built by an integrator, not for one</h2>
            <p>
              EliteWorker exists because none of the above fit how a smart home integration business actually runs.
              It was built inside a real integration company, by a 30-year owner-operator who needed exactly this —
              job-stage tracking, crew scheduling across installs that run weeks or months, and visibility into what&rsquo;s blocking
              a job before it turns into a Friday-night phone call to a client. You can read more about{" "}
              <Link href="/about" className="font-semibold text-brand hover:underline">
                how it started
              </Link>
              , or see it running on a real account.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <PillButton href="/demo" size="md">
                Book a demo
              </PillButton>
              <PillButton href="/beta" size="md" variant="secondary">
                Join the Beta
              </PillButton>
            </div>
          </FadeIn>

          <FadeIn delay={100} className="mt-16 border-t border-line pt-12">
            <h2 className="text-2xl font-semibold text-ink">Frequently asked questions</h2>
            <div className="mt-6 space-y-8">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <h3 className="text-base font-semibold text-ink">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-7 text-ink/65">{faq.answer}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </article>
      </main>

      <Footer />
    </div>
  );
}
