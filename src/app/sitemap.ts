import type { MetadataRoute } from "next";

const siteUrl = "https://eliteworker.io"; // TODO: swap for the real domain

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: siteUrl, lastModified, priority: 1 },
    { url: `${siteUrl}/platform`, lastModified, priority: 0.9 },
    { url: `${siteUrl}/how-it-works`, lastModified, priority: 0.8 },
    { url: `${siteUrl}/contact`, lastModified, priority: 0.7 },
    { url: `${siteUrl}/demo`, lastModified, priority: 0.8 },
  ];
}
