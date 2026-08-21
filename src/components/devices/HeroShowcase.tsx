"use client";

import { useState } from "react";
import { AssemblingLaptop } from "./AssemblingLaptop";

type Capability = {
  label: string;
  screenSrc: string;
  alt: string;
};

export function HeroShowcase({
  blankSrc,
  defaultScreenSrc,
  defaultAlt,
  capabilities,
  screenRect,
}: {
  blankSrc: string;
  defaultScreenSrc: string;
  defaultAlt: string;
  capabilities: Capability[];
  screenRect: { left: number; top: number; width: number; height: number };
}) {
  const [active, setActive] = useState<Capability | null>(null);
  const current = active ?? { label: "Dashboard", screenSrc: defaultScreenSrc, alt: defaultAlt };

  return (
    <div>
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {capabilities.map((c) => (
          <button
            key={c.label}
            type="button"
            onClick={() => setActive(active?.label === c.label ? null : c)}
            className={`rounded-full border px-3 py-1.5 text-[11px] font-medium transition ${
              current.label === c.label
                ? "border-brand bg-brand text-white"
                : "border-line bg-paper-alt text-ink/60 hover:border-brand-light/50 hover:text-ink"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="relative mx-auto mt-10 w-full max-w-5xl px-4 md:mt-12 md:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-1/4 -z-10 mx-auto h-125 max-w-4xl bg-[radial-gradient(ellipse,rgba(96,165,250,0.18),transparent_65%)] blur-3xl" />
        <AssemblingLaptop
          key={current.label}
          blankSrc={blankSrc}
          screenSrc={current.screenSrc}
          alt={current.alt}
          laptopWidth={1996}
          laptopHeight={1148}
          screenRect={screenRect}
          className="mx-auto w-full drop-shadow-[0_45px_80px_rgba(0,0,0,0.3)]"
        />
      </div>
    </div>
  );
}
