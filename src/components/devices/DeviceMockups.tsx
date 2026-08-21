import Image from "next/image";
import type { CSSProperties } from "react";

type MockupProps = {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
};

export function IpadMockup({ src, alt, className = "", style, priority }: MockupProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={2640}
      height={1920}
      className={`h-auto ${className}`}
      style={style}
      priority={priority}
      quality={95}
    />
  );
}

export function IphoneMockup({ src, alt, className = "", style, priority }: MockupProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={1419}
      height={2796}
      className={`h-auto ${className}`}
      style={style}
      priority={priority}
      quality={95}
    />
  );
}

export function LaptopMockup({ src, alt, className = "", style, priority }: MockupProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={2000}
      height={2000}
      className={`h-auto ${className}`}
      style={style}
      priority={priority}
      quality={95}
    />
  );
}
