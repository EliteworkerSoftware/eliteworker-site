import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const siteUrl = "https://eliteworker.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "EliteWorker — Field Operations Software for Smart Home Integrators",
    template: "%s | EliteWorker",
  },
  description:
    "EliteWorker is the operations platform built for smart home integrators — job scheduling and project tracking from Prewire to Tutorial.",
  keywords: [
    "smart home integrator software",
    "AV company ERP",
    "field service scheduling software",
    "low voltage contractor software",
    "home automation business software",
  ],
  openGraph: {
    title: "EliteWorker — Field Operations Software for Smart Home Integrators",
    description:
      "Run your smart home integration business end to end: scheduling, job tracking, and reporting in one platform.",
    url: siteUrl,
    siteName: "EliteWorker",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EliteWorker — Field Operations Software for Smart Home Integrators",
    description:
      "Run your smart home integration business end to end: scheduling, job tracking, and reporting in one platform.",
  },
  robots: { index: true, follow: true },
};

// Structured data for search engines and AI answer engines (ChatGPT,
// Perplexity, etc.) to reliably identify who EliteWorker is and what it
// does, instead of inferring it from rendered page text. Deliberately omits
// "offers"/pricing and any rating — the product is still in beta with no
// public price, and fabricating either would be inaccurate schema.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "EliteWorker",
  url: siteUrl,
  logo: `${siteUrl}/Eliteworker%20Header%20Logo.svg`,
  description:
    "EliteWorker is the operations platform built for smart home integrators — job scheduling and project tracking from Prewire to Tutorial.",
  address: {
    "@type": "PostalAddress",
    postOfficeBoxNumber: "1025",
    addressLocality: "Marlton",
    addressRegion: "NJ",
    postalCode: "08053",
    addressCountry: "US",
  },
};

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "EliteWorker",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: siteUrl,
  description:
    "Field operations software for smart home and low-voltage integrators: job scheduling and project tracking from Prewire to Tutorial.",
  publisher: { "@type": "Organization", name: "EliteWorker", url: siteUrl },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
