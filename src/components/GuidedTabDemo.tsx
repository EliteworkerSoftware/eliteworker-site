"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

type Point = { x: number; y: number };
type Step = {
  src: string;
  alt: string;
  tabTarget: Point;
  // A sweep path across the content area (at least 2 points) — the view zooms in
  // on the first point, then pans slowly through each remaining point in turn.
  contentPan: readonly Point[];
};

type Keyframe = {
  at: number;
  duration: number;
  imageIndex: number;
  scale: number;
  // Point (in % of the untransformed image) to center in the viewport.
  focus: Point;
  cursor: Point | null;
  pulse: boolean;
  ease: string;
};

const CENTER: Point = { x: 50, y: 50 };
const TAB_ZOOM = 4.5;
const CONTENT_ZOOM = 2.6;

const HOLD_MS = 900;
const MOVE_MS = 700;
const ZOOM_IN_MS = 1200;
const SETTLE_MS = 300;
const CLICK_MS = 400;
const SWAP_HOLD_MS = 400;
const CONTENT_ZOOM_IN_MS = 900;
const CONTENT_PAN_SEGMENT_MS = 6000;
const CONTENT_ZOOM_OUT_MS = 700;

const EASE_OUT = "cubic-bezier(0.16,1,0.3,1)";
const LINEAR = "linear";

function buildTimeline(steps: readonly Step[]): Keyframe[] {
  const kfs: Keyframe[] = [];
  let t = 0;
  const push = (kf: Omit<Keyframe, "at" | "ease"> & { ease?: string }, hold = 0) => {
    kfs.push({ ease: EASE_OUT, ...kf, at: t });
    t += kf.duration + hold;
  };

  push({ duration: 0, imageIndex: 0, scale: 1, focus: CENTER, cursor: null, pulse: false }, HOLD_MS);

  for (let i = 0; i < steps.length - 1; i++) {
    // Click sequence: move the cursor to the next tab, zoom in on it, click, swap.
    const tabTarget = steps[i + 1].tabTarget;
    push({ duration: MOVE_MS, imageIndex: i, scale: 1, focus: CENTER, cursor: tabTarget, pulse: false });
    push({ duration: ZOOM_IN_MS, imageIndex: i, scale: TAB_ZOOM, focus: tabTarget, cursor: tabTarget, pulse: false }, SETTLE_MS);
    push({ duration: 0, imageIndex: i, scale: TAB_ZOOM, focus: tabTarget, cursor: tabTarget, pulse: true }, CLICK_MS);
    push({ duration: 0, imageIndex: i + 1, scale: TAB_ZOOM, focus: tabTarget, cursor: tabTarget, pulse: false }, SWAP_HOLD_MS);

    // Flow straight from the click into panning the newly revealed content —
    // no zooming back out in between — left to right at a slow constant speed
    // (linear, not eased), and only zoom out once the pan across is done.
    const pan = steps[i + 1].contentPan;
    push({ duration: CONTENT_ZOOM_IN_MS, imageIndex: i + 1, scale: CONTENT_ZOOM, focus: pan[0], cursor: null, pulse: false }, 250);
    for (let p = 1; p < pan.length; p++) {
      const isLast = p === pan.length - 1;
      push(
        { duration: CONTENT_PAN_SEGMENT_MS, imageIndex: i + 1, scale: CONTENT_ZOOM, focus: pan[p], cursor: null, pulse: false, ease: LINEAR },
        isLast ? 450 : 150
      );
    }
    push({ duration: CONTENT_ZOOM_OUT_MS, imageIndex: i + 1, scale: 1, focus: CENTER, cursor: null, pulse: false }, HOLD_MS);
  }

  return kfs;
}

export function GuidedTabDemo({
  steps,
  width,
  height,
  className = "",
}: {
  steps: readonly Step[];
  width: number;
  height: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [runId, setRunId] = useState(0);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [frame, setFrame] = useState<Keyframe>(() => ({
    at: 0,
    duration: 0,
    imageIndex: 0,
    scale: 1,
    focus: CENTER,
    cursor: null,
    pulse: false,
    ease: EASE_OUT,
  }));

  const timeline = useMemo(() => buildTimeline(steps), [steps]);

  useEffect(() => {
    const el = ref.current;
    if (!el || runId > 0) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [runId]);

  useEffect(() => {
    if (!started) return;
    setDone(false);
    const timers = timeline.map((kf) => setTimeout(() => setFrame(kf), kf.at));
    const last = timeline[timeline.length - 1];
    timers.push(setTimeout(() => setDone(true), last.at + last.duration + 300));
    return () => timers.forEach(clearTimeout);
  }, [started, runId, timeline]);

  const current = steps[frame.imageIndex];
  const showCursor = frame.cursor !== null;
  const tx = 50 - frame.focus.x;
  const ty = 50 - frame.focus.y;

  return (
    <div ref={ref} className={`relative overflow-hidden rounded-2xl border border-line ${className}`}>
      <div
        className="transition-transform"
        style={{
          transform: `scale(${frame.scale}) translate(${tx}%, ${ty}%)`,
          transformOrigin: "50% 50%",
          transitionDuration: `${frame.duration}ms`,
          transitionTimingFunction: frame.ease,
        }}
      >
        <Image src={current.src} alt={current.alt} width={width} height={height} className="h-auto w-full" />

        {showCursor && frame.cursor && (
          <div
            className="pointer-events-none absolute z-10 transition-all"
            style={{
              left: `${frame.cursor.x}%`,
              top: `${frame.cursor.y}%`,
              // Counter-scale so the cursor stays a constant on-screen size while
              // still tracking the same point on the image as it zooms/pans.
              transform: `scale(${1 / frame.scale}) translate(-15%, -10%)`,
              transformOrigin: "0 0",
              transitionDuration: `${Math.max(frame.duration, 300)}ms`,
              transitionTimingFunction: frame.ease,
            }}
          >
            <svg viewBox="0 0 24 24" className={`h-7 w-7 transition-transform duration-150 ${frame.pulse ? "scale-90" : "scale-100"}`}>
              <path d="M4 2.5 18.5 9l-6 1.8L15 17l-2.7 1.3-2.5-6.2L5.5 16 4 2.5Z" fill="white" stroke="#0f172a" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
            {frame.pulse && <span className="absolute left-1 top-1 h-3 w-3 animate-ping rounded-full bg-brand/70" />}
          </div>
        )}
      </div>

      {done && (
        <button
          type="button"
          onClick={() => {
            setFrame({ at: 0, duration: 0, imageIndex: 0, scale: 1, focus: CENTER, cursor: null, pulse: false, ease: EASE_OUT });
            setDone(false);
            setRunId((n) => n + 1);
          }}
          className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 rounded-full border border-line bg-paper/95 px-3.5 py-2 text-xs font-semibold text-ink/80 shadow-sm transition hover:text-ink"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
            <path d="M3 12a9 9 0 1 1 2.6 6.36" />
            <path d="M3 20v-6h6" />
          </svg>
          Replay
        </button>
      )}
    </div>
  );
}
