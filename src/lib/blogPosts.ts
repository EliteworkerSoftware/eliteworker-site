// Single source of truth for blog post metadata — the /blog index, the
// sitemap, and each post's own JSON-LD all read from this instead of each
// hardcoding the same title/date/slug separately.
export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  publishedAt: string; // ISO date
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "field-service-scheduling-software-for-smart-home-integrators",
    title: "Field Service Scheduling Software for Smart Home Integrators",
    description:
      "Why general field service tools break down on multi-week smart home installs, and what integrators should actually look for in scheduling software.",
    excerpt:
      "General field service tools are built for single-visit jobs. Smart home installs run for weeks across prewire, trim, and commissioning — here's what actually needs to work differently.",
    publishedAt: "2026-08-29",
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
