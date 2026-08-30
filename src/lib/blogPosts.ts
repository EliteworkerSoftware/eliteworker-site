import type { ComponentType } from "react";
import { ScheduleIcon } from "@/components/SolutionIcons";

// Single source of truth for blog post metadata — the /blog index, the
// sitemap, and each post's own JSON-LD all read from this instead of each
// hardcoding the same title/date/slug separately.
export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  publishedAt: string; // ISO date
  // Topic icon shown on the blog index card, pulled from the same icon set
  // used for the homepage's customer-lifecycle journey (Sale, Billing,
  // Order, Schedule, Prewire, Installation, Programming, Quality Check,
  // Tutorial) — pick whichever stage the post is actually about, so each
  // card reads as distinct at a glance instead of every card looking the
  // same regardless of topic.
  icon: ComponentType<{ className?: string }>;
  // A single short word/phrase for the card's colored header band — not the
  // full title (too long to sit cleanly on a gradient background), just the
  // topic at a glance, e.g. "Scheduling".
  category: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "field-service-scheduling-software-for-smart-home-integrators",
    title: "Field Service Scheduling Software for Smart Home Integrators",
    description:
      "Why general field service tools break down on smart home installs that run weeks or months, and what integrators should actually look for in scheduling software.",
    excerpt:
      "General field service tools are built for single-visit jobs. Smart home installs run for weeks — or months, on new construction — across Prewire, Installation, Programming, Quality Check, and Tutorial. Here's what actually needs to work differently.",
    publishedAt: "2026-08-29",
    icon: ScheduleIcon,
    category: "Scheduling",
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
