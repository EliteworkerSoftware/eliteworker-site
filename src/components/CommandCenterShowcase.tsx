"use client";

import { useState } from "react";
import { LaptopMockup, IpadMockup, IphoneMockup } from "@/components/devices/DeviceMockups";
import { highlightWord } from "@/lib/highlightWord";

type DeviceKey = "laptop" | "tablet" | "phone";
type Variant = { src: string; alt: string };
type Point = { label: string; images: Record<DeviceKey, Variant> };

const deviceOrder: DeviceKey[] = ["laptop", "tablet", "phone"];
const deviceLabels: Record<DeviceKey, string> = { laptop: "Desktop", tablet: "Tablet", phone: "Phone" };
// Rendered content height (px) of each device mockup at its fixed display width, used to
// pin the device-switcher buttons directly under whichever picture is showing.
const deviceContentHeight: Record<DeviceKey, number> = { laptop: 322, tablet: 306, phone: 434 };

export function CommandCenterShowcase({
  kicker,
  title,
  highlight,
  points,
  reverse,
}: {
  kicker: string;
  title: string;
  highlight: string;
  points: readonly Point[];
  reverse?: boolean;
}) {
  const [device, setDevice] = useState<DeviceKey>("laptop");
  const [active, setActive] = useState(0);
  const current = (points[active] ?? points[0]).images[device];

  return (
    <div className="grid items-start gap-14 lg:grid-cols-2">
      <div className={reverse ? "lg:order-2" : ""}>
        <p className="inline-block rounded-full bg-brand-dark px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-white">{kicker}</p>
        <h2 className="mt-3 text-balance font-display text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-ink sm:text-6xl md:text-7xl">
          {highlightWord(title, highlight)}
        </h2>

        <ul className="mt-6 grid grid-cols-3 gap-x-4 gap-y-1">
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
        <div className="relative h-120 w-full max-w-140">
          <div className="absolute inset-x-0 top-0 flex justify-center">
            {device === "laptop" && (
              <div className="w-full max-w-140">
                <div className="aspect-2000/1151 w-full overflow-hidden">
                  <LaptopMockup src={current.src} alt={current.alt} className="w-full translate-y-[-21.2%]" />
                </div>
              </div>
            )}
            {device === "tablet" && (
              <IpadMockup src={current.src} alt={current.alt} className="w-105" />
            )}
            {device === "phone" && (
              <IphoneMockup src={current.src} alt={current.alt} className="w-55" />
            )}
          </div>

          <div
            className="absolute inset-x-0 flex justify-center gap-2"
            style={{ top: deviceContentHeight[device] + 8 }}
          >
            {deviceOrder.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDevice(d)}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition ${
                  device === d
                    ? "border-brand bg-brand text-white"
                    : "border-line text-ink/60 hover:border-brand-light/50 hover:text-ink"
                }`}
              >
                {deviceLabels[d]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
