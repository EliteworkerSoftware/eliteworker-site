"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  { href: "/platform", label: "Platform" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/contact", label: "Contact" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-nav-line bg-nav">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center">
          <Image
            src="/Eliteworker%20Header%20Logo.svg"
            alt="EliteWorker"
            width={660}
            height={101}
            className="h-7 w-auto"
            priority
          />
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-white/65 md:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition hover:text-white ${active ? "text-white" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/demo"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-nav shadow-[0_10px_25px_rgba(245,158,11,0.3)] transition hover:-translate-y-0.5 hover:brightness-105"
        >
          Book a demo
        </Link>
      </div>
    </header>
  );
}
