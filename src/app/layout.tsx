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
    "EliteWorker is the operations platform built for smart home integrators — job scheduling, technician dispatch, and project tracking from prewire to final walkthrough.",
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
      "Run your smart home integration business end to end: scheduling, dispatch, job tracking, and reporting in one platform.",
    url: siteUrl,
    siteName: "EliteWorker",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EliteWorker — Field Operations Software for Smart Home Integrators",
    description:
      "Run your smart home integration business end to end: scheduling, dispatch, job tracking, and reporting in one platform.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
