"use client";

import { useEffect, useRef } from "react";

export function ParallaxBlob({
  className = "",
  speed = 0.15,
}: {
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

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

  return <div ref={ref} className={className} style={{ willChange: "transform" }} />;
}
