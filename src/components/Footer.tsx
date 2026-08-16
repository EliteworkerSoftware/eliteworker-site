import Link from "next/link";

const productLinks = [
  { href: "/platform", label: "Platform" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/demo", label: "Book a demo" },
];

const companyLinks = [{ href: "/contact", label: "Contact" }];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper-alt">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-lg font-semibold tracking-[-0.02em] text-ink">EliteWorker</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-ink/55">
            The operations platform built for smart home integrators — scheduling, dispatch, and job tracking
            from prewire to final walkthrough.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/40">Product</p>
          <ul className="mt-4 space-y-2.5 text-sm text-ink/65">
            {productLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/40">Company</p>
          <ul className="mt-4 space-y-2.5 text-sm text-ink/65">
            {companyLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line px-6 py-6 text-center text-xs text-ink/40">
        © {new Date().getFullYear()} EliteWorker. Built by Elite Smart Home, LLC.
      </div>
    </footer>
  );
}
