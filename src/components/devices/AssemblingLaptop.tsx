"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const COLS = 6;
const ROWS = 4;
const FLY_DISTANCE = 260;
const TILE_DURATION_MS = 850;
const STAGGER_MS = 32;

export function AssemblingLaptop({
  blankSrc,
  screenSrc,
  alt,
  laptopWidth,
  laptopHeight,
  screenRect,
  className = "",
}: {
  blankSrc: string;
  screenSrc: string;
  alt: string;
  laptopWidth: number;
  laptopHeight: number;
  screenRect: { left: number; top: number; width: number; height: number };
  className?: string;
}) {
  const [triggered, setTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const tiles = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cx = (col + 0.5) / COLS - 0.5;
      const cy = (row + 0.5) / ROWS - 0.5;
      const len = Math.hypot(cx, cy) || 1;
      const dx = (cx / len) * FLY_DISTANCE;
      const dy = (cy / len) * FLY_DISTANCE;
      const delay = (row * COLS + col) * STAGGER_MS;
      tiles.push({ row, col, dx, dy, delay });
    }
  }

  return (
    <div ref={ref} className={`relative ${className}`} style={{ aspectRatio: `${laptopWidth} / ${laptopHeight}` }}>
      <Image src={blankSrc} alt={alt} fill priority quality={95} className="object-contain" />

      <div
        className="absolute overflow-hidden"
        style={{
          left: `${screenRect.left * 100}%`,
          top: `${screenRect.top * 100}%`,
          width: `${screenRect.width * 100}%`,
          height: `${screenRect.height * 100}%`,
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        }}
      >
        {tiles.map(({ row, col, dx, dy, delay }) => (
          <div
            key={`${row}-${col}`}
            style={{
              backgroundImage: `url(${screenSrc})`,
              backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
              backgroundPosition: `${(col / (COLS - 1)) * 100}% ${(row / (ROWS - 1)) * 100}%`,
              opacity: triggered ? 1 : 0,
              transform: triggered ? "translate(0, 0) scale(1)" : `translate(${dx}px, ${dy}px) scale(0.75)`,
              transition: `transform ${TILE_DURATION_MS}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, opacity ${TILE_DURATION_MS}ms ease ${delay}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
