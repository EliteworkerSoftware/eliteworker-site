import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blogPosts";

const siteUrl = "https://eliteworker.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: siteUrl, lastModified, priority: 1 },
    { url: `${siteUrl}/about`, lastModified, priority: 0.6 },
    { url: `${siteUrl}/contact`, lastModified, priority: 0.7 },
    { url: `${siteUrl}/beta`, lastModified, priority: 0.7 },
    { url: `${siteUrl}/demo`, lastModified, priority: 0.8 },
    { url: `${siteUrl}/blog`, lastModified, priority: 0.6 },
    ...BLOG_POSTS.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      priority: 0.5,
    })),
  ];
}
