"use client";

import { useState } from "react";
import { LaptopMockup, IpadMockup, IphoneMockup } from "@/components/devices/DeviceMockups";

type Point = { label: string; image: string; alt: string };

export function ShowcaseItem({
  kicker,
  title,
  body,
  points,
  device,
  reverse,
}: {
  kicker: string;
  title: string;
  body: string;
  points: readonly Point[];
  device: "laptop" | "tablet" | "phone";
  reverse: boolean;
}) {
  const [active, setActive] = useState(0);
  const current = points[active] ?? points[0];

  return (
    <div className="grid items-center gap-14 lg:grid-cols-2">
      <div className={reverse ? "lg:order-2" : ""}>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">{kicker}</p>
        <h2 className="mt-3 text-balance text-2xl font-semibold tracking-[-0.02em] text-ink md:text-3xl">{title}</h2>
        <p className="mt-4 max-w-md text-sm leading-7 text-ink/60 md:text-base">{body}</p>
        <ul className="mt-6 space-y-1">
          {points.map((p, i) => (
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
          ))}
        </ul>
      </div>

      <div className={`flex justify-center ${reverse ? "lg:order-1" : ""}`}>
        <div className="relative">
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
        </div>
      </div>
    </div>
  );
}
