import type { MetadataRoute } from "next";

const siteUrl = "https://eliteworker.io"; // TODO: swap for the real domain

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, lastModified: new Date(), priority: 1 },
    { url: `${siteUrl}/demo`, lastModified: new Date(), priority: 0.8 },
  ];
}
