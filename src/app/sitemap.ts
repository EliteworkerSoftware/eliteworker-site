import type { MetadataRoute } from "next";

const siteUrl = "https://eliteworker.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: siteUrl, lastModified, priority: 1 },
    { url: `${siteUrl}/about`, lastModified, priority: 0.6 },
    { url: `${siteUrl}/contact`, lastModified, priority: 0.7 },
    { url: `${siteUrl}/beta`, lastModified, priority: 0.7 },
    { url: `${siteUrl}/demo`, lastModified, priority: 0.8 },
  ];
}
