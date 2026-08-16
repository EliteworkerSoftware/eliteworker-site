import Link from "next/link";
import Image from "next/image";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-wire-line/80 bg-graphite/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center">
          <Image src="/logo.svg" alt="EliteWorker" width={150} height={25} priority />
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-paper/70 md:flex">
          <Link href="/#features" className="transition hover:text-paper">Features</Link>
          <Link href="/#workflow" className="transition hover:text-paper">How it works</Link>
          <Link href="/#contact" className="transition hover:text-paper">Contact</Link>
        </nav>
        <Link
          href="/demo"
          className="rounded-md bg-signal-amber px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Book a demo
        </Link>
      </div>
    </header>
  );
}
