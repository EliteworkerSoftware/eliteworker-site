"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

// `text-balance` paragraphs keep their box at the full max-width even when the
// wrapped lines render narrower than that — so centering a sibling on the
// paragraph's box centers it on empty space, not the visible text. This
// measures the actual widest rendered line and sizes the wrapper to match.
export function CenterUnderText({
  text,
  textClassName,
  children,
}: {
  text: string;
  textClassName: string;
  children: ReactNode;
}) {
  const pRef = useRef<HTMLParagraphElement>(null);
  const [width, setWidth] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = pRef.current;
    if (!el) return;

    function measure() {
      const range = document.createRange();
      range.selectNodeContents(el!);
      const rects = Array.from(range.getClientRects());
      const max = rects.reduce((m, r) => Math.max(m, r.width), 0);
      if (max > 0) setWidth(max);
    }

    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <>
      <p ref={pRef} className={textClassName}>
        {text}
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4" style={width ? { width } : undefined}>
        {children}
      </div>
    </>
  );
}
