"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/contact", label: "Contact" },
];

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-nav-line bg-nav">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
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
        <div className="flex items-center gap-2">
          <Link
            href="/demo"
            className="whitespace-nowrap rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-nav transition hover:-translate-y-0.5 hover:brightness-105 sm:px-4 sm:text-sm"
          >
            Book a demo
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/10 md:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-5 w-5">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-nav-line px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-4 text-sm font-medium text-white/65">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`transition hover:text-white ${active ? "text-white" : ""}`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
