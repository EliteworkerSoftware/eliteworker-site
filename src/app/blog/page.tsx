import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";
import FadeIn from "@/components/FadeIn";
import { BLOG_POSTS } from "@/lib/blogPosts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Resources covering everything from the first customer interaction and sale, through complete job management, to after-sale care — for smart home and low-voltage integrators.",
};

function formatDate(value: string) {
  // A bare "YYYY-MM-DD" parses as UTC midnight, which toLocaleDateString
  // then renders in the server/browser's local zone — shifting the date
  // back a day anywhere west of UTC. Appending a local-midnight time avoids
  // that misinterpretation entirely.
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogIndexPage() {
  const posts = [...BLOG_POSTS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return (
    <div className="min-h-screen bg-paper text-ink">
      <NavBar />

      <main>
        <PageIntro
          kicker="Resources"
          title="Field operations advice for integrators."
          subtitle="Resources covering everything from the first customer interaction and sale, through complete job management, to after-sale care — for smart home and low-voltage integrators, from the team building EliteWorker."
          compactBottom
        />

        <section className="mx-auto max-w-3xl px-6 pt-10 pb-24 md:pt-14 md:pb-32">
          <div className="space-y-6">
            {posts.map((post, i) => (
              <FadeIn key={post.slug} delay={i * 60}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="block rounded-2xl border border-line bg-paper p-7 shadow-[0_2px_10px_rgba(15,23,42,0.03)] transition hover:border-brand-light"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/40">
                    {formatDate(post.publishedAt)}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-ink md:text-2xl">{post.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-ink/60">{post.excerpt}</p>
                  <p className="mt-4 text-sm font-semibold text-brand">Read more →</p>
                </Link>
              </FadeIn>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
