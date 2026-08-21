import Image from "next/image";

export function ScreenCrop({
  src,
  alt,
  width,
  height,
  className = "",
  fit = "width",
  framed = true,
  priority,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fit?: "width" | "contain";
  framed?: boolean;
  priority?: boolean;
}) {
  return (
    <div className={`overflow-hidden ${framed ? "rounded-xl ring-1 ring-black/10" : ""} ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        quality={95}
        priority={priority}
        className={fit === "contain" ? "h-full w-full object-contain" : "h-auto w-full"}
      />
    </div>
  );
}
