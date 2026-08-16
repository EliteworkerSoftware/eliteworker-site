import type { MetadataRoute } from "next";

const siteUrl = "https://eliteworker.io"; // TODO: swap for the real domain

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
