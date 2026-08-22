"use client";

import { useEffect, useRef } from "react";

// The exact "W" bar group from the logo mark (outer bars tall, middle
// shorter), scaled up and faded, drifting at its own rate as the page scrolls.
export function BarChartMotif({
  className = "",
  speed = 0.15,
}: {
  className?: string;
  speed?: number;
}) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    function update() {
      raf = 0;
      const el2 = ref.current;
      if (!el2) return;
      const rect = el2.getBoundingClientRect();
      const centerDelta = window.innerHeight / 2 - (rect.top + rect.height / 2);
      el2.style.transform = `translate3d(0, ${(centerDelta * speed).toFixed(1)}px, 0)`;
    }
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(update);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <svg ref={ref} viewBox="0 0 72.65 70.58" fill="none" className={className} style={{ willChange: "transform" }}>
      <rect x="0" y="0" width="18.68" height="70.58" rx="3.11" fill="var(--brand-dark)" />
      <rect x="26.99" y="25.95" width="18.68" height="44.63" rx="3.11" fill="var(--brand)" />
      <rect x="53.97" y="0" width="18.68" height="70.58" rx="3.11" fill="var(--brand-light)" />
    </svg>
  );
}
