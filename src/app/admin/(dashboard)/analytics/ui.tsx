"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown, Info } from "lucide-react";

// Shared building blocks for the Analytics page's sections.

export function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setOpen(false)}
        aria-label="More info"
        className="flex items-center justify-center text-ink/30 hover:text-ink/60"
      >
        <Info size={14} />
      </button>
      {open && (
        <span className="absolute left-1/2 top-full z-20 mt-2 w-64 -translate-x-1/2 rounded-lg bg-ink px-3 py-2 text-xs leading-snug font-normal text-white shadow-lg">
          {text}
        </span>
      )}
    </span>
  );
}

const SECTION_STORAGE_PREFIX = "ew-analytics-open:";
export const TOGGLE_ALL_EVENT = "ew-analytics-toggle-all";

// A collapsible section. Remembers open/closed per browser and follows the
// page's Collapse all / Expand all.
export function Section({
  storageKey,
  title,
  tooltip,
  meta,
  defaultOpen = true,
  className = "",
  children,
}: {
  storageKey: string;
  title: string;
  tooltip?: string;
  meta?: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    try {
      const saved = localStorage.getItem(SECTION_STORAGE_PREFIX + storageKey);
      if (saved !== null) el.open = saved === "1";
    } catch {
      // storage unavailable — keep the default
    }
    const onToggleAll = (e: Event) => {
      el.open = (e as CustomEvent<boolean>).detail;
    };
    window.addEventListener(TOGGLE_ALL_EVENT, onToggleAll);
    return () => window.removeEventListener(TOGGLE_ALL_EVENT, onToggleAll);
  }, [storageKey]);

  return (
    <details
      ref={ref}
      open={defaultOpen}
      onToggle={(e) => {
        try {
          localStorage.setItem(SECTION_STORAGE_PREFIX + storageKey, e.currentTarget.open ? "1" : "0");
        } catch {
          // storage unavailable — state just won't persist
        }
      }}
      className={`group self-start border-t border-line pt-5 ${className}`}
    >
      <summary
        // Clicking the (i) button shouldn't also collapse the section.
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("button")) e.preventDefault();
        }}
        className="flex cursor-pointer list-none items-center gap-2 [&::-webkit-details-marker]:hidden"
      >
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        {meta}
        {tooltip && <InfoTooltip text={tooltip} />}
        <ChevronDown size={16} className="ml-auto shrink-0 text-ink/30 transition-transform group-open:rotate-180" />
      </summary>
      <div className="pb-2">{children}</div>
    </details>
  );
}
