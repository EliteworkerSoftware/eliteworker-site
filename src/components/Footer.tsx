import Link from "next/link";

const productLinks = [
  { href: "/", label: "Platform" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/demo", label: "Book a demo" },
];

const companyLinks = [{ href: "/contact", label: "Contact" }];

export default function Footer() {
  return (
    <footer className="relative border-t border-line bg-paper-alt">
      <div className="h-px w-full bg-linear-to-r from-transparent via-brand/40 to-transparent" />

      <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 md:grid-cols-[1.4fr_1fr_1fr] md:py-24">
        <div>
          <p className="font-display text-2xl font-semibold tracking-[-0.02em] text-ink">EliteWorker</p>
          <p className="mt-4 max-w-sm text-base leading-7 text-ink/55">
            The operations platform built for smart home integrators — scheduling, dispatch, and job tracking
            from prewire to final walkthrough.
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
        © {new Date().getFullYear()} EliteWorker. Built by Elite Smart Home, LLC.
      </div>
    </footer>
  );
}
