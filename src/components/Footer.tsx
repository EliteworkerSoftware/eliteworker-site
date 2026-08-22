import Link from "next/link";
import Image from "next/image";

const productLinks = [
  { href: "/beta", label: "Join the Beta" },
  { href: "/demo", label: "Book a demo" },
];

const companyLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-line bg-paper-alt">
      <div className="h-px w-full bg-linear-to-r from-transparent via-brand/40 to-transparent" />

      <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 md:grid-cols-[1.4fr_1fr_1fr] md:py-24">
        <div className="text-center md:text-left">
          <Image
            src="/Eliteworker%20Footer%20Logo.svg"
            alt="EliteWorker"
            width={660}
            height={101}
            className="mx-auto h-7 w-auto md:mx-0"
          />
          <p className="mx-auto mt-4 max-w-sm text-base leading-7 text-ink/55 md:mx-0">
            The operations platform built for smart home integrators
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/40">Product</p>
          <ul className="mt-5 space-y-3 text-base text-ink/65">
            {productLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-brand">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/40">Company</p>
          <ul className="mt-5 space-y-3 text-base text-ink/65">
            {companyLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-brand">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line px-6 py-7 text-center text-sm text-ink/40">
        © {new Date().getFullYear()} EliteWorker. All rights reserved.
      </div>
    </footer>
  );
}
