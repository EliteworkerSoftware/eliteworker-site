"use client";

import { useState } from "react";
import { LaptopMockup, IpadMockup, IphoneMockup } from "@/components/devices/DeviceMockups";
import { GuidedTabDemo } from "@/components/GuidedTabDemo";
import { highlightWord } from "@/lib/highlightWord";

type Point = { label: string; image: string; alt: string };
type Coord = { x: number; y: number };
type DemoStep = { src: string; alt: string; tabTarget: Coord; contentPan: readonly Coord[] };

export function ShowcaseItem({
  kicker,
  title,
  highlight,
  points,
  device,
  reverse,
  interactive = true,
  bare = false,
  demoSteps,
}: {
  kicker: string;
  title: string;
  highlight: string;
  points: readonly Point[];
  device: "laptop" | "tablet" | "phone";
  reverse: boolean;
  interactive?: boolean;
  bare?: boolean;
  demoSteps?: readonly DemoStep[];
}) {
  const [active, setActive] = useState(0);
  const current = points[active] ?? points[0];

  return (
    <div className="grid items-center gap-14 lg:grid-cols-2">
      <div className={reverse ? "lg:order-2" : ""}>
        <p className="inline-block rounded-full bg-brand-dark px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-white">{kicker}</p>
        <h2 className="mt-3 text-balance font-display text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-ink sm:text-6xl md:text-7xl">
          {highlightWord(title, highlight)}
        </h2>
        <ul className="mt-6 space-y-1">
          {points.map((p, i) =>
            interactive ? (
              <li key={p.label}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  className={`flex w-full items-start gap-2.5 rounded-lg py-1.5 text-left text-sm transition ${
                    active === i ? "text-ink" : "text-ink/60 hover:text-ink/80"
                  }`}
                >
                  <span
                    className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full transition ${
                      active === i ? "bg-accent" : "bg-line"
                    }`}
                  />
                  {p.label}
                </button>
              </li>
            ) : (
              <li key={p.label} className="flex items-start gap-2.5 py-1.5 text-sm text-ink/70">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {p.label}
              </li>
            )
          )}
        </ul>
      </div>

      <div className={`flex justify-center ${reverse ? "lg:order-1" : ""}`}>
        <div className="relative">
          {bare && demoSteps ? (
            <GuidedTabDemo steps={demoSteps} width={1919} height={1079} className="w-full max-w-3xl" />
          ) : (
            <>
              {device === "laptop" && (
                <LaptopMockup
                  src={current.image}
                  alt={current.alt}
                  className="w-full max-w-140"
                />
              )}
              {device === "tablet" && (
                <IpadMockup src={current.image} alt={current.alt} className="w-105" />
              )}
              {device === "phone" && (
                <IphoneMockup src={current.image} alt={current.alt} className="w-55" />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
