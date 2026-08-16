import type { ReactNode, CSSProperties } from "react";

type FrameProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function Laptop({ children, className = "", style }: FrameProps) {
  return (
    <div className={className} style={style}>
      <div className="relative rounded-t-2xl border-[6px] border-b-0 border-[#232a36] bg-[#0a0e16] pt-2 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)]">
        <div className="absolute left-1/2 top-[3px] h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-black/70" />
        <div className="aspect-[16/10] overflow-hidden rounded-[4px] bg-ink-3">{children}</div>
      </div>
      <div className="relative mx-[-10px] h-[14px] rounded-b-2xl bg-gradient-to-b from-[#2a3140] to-[#141a24]">
        <div className="absolute left-1/2 top-0 h-[4px] w-[90px] -translate-x-1/2 rounded-b-md bg-black/40" />
      </div>
    </div>
  );
}

export function Tablet({
  children,
  className = "",
  style,
  orientation = "portrait",
}: FrameProps & { orientation?: "portrait" | "landscape" }) {
  return (
    <div
      className={`relative rounded-[1.9rem] border-[10px] bg-[#0a0e16] border-[#232a36] shadow-[0_40px_90px_-15px_rgba(0,0,0,0.65)] ${className}`}
      style={style}
    >
      <div
        className={`absolute z-10 h-[6px] w-[6px] rounded-full bg-black/70 ${
          orientation === "portrait" ? "left-1/2 top-1 -translate-x-1/2" : "right-1 top-1/2 -translate-y-1/2"
        }`}
      />
      <div
        className={`overflow-hidden rounded-[1.15rem] bg-ink-3 ${
          orientation === "portrait" ? "aspect-[3/4]" : "aspect-[4/3]"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export function Phone({ children, className = "", style }: FrameProps) {
  return (
    <div
      className={`relative rounded-[2.3rem] border-[7px] border-[#232a36] bg-[#0a0e16] shadow-[0_35px_80px_-15px_rgba(0,0,0,0.65)] ${className}`}
      style={style}
    >
      <div className="absolute left-1/2 top-[7px] z-10 h-[16px] w-[70px] -translate-x-1/2 rounded-full bg-black" />
      <div className="aspect-[9/19] overflow-hidden rounded-[1.75rem] bg-ink-3">{children}</div>
      <div className="absolute bottom-[6px] left-1/2 h-[3px] w-[70px] -translate-x-1/2 rounded-full bg-white/25" />
    </div>
  );
}
