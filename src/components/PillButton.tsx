import Link from "next/link";
import type { ReactNode } from "react";

// One padding/type recipe, scaled by size — so every CTA pill on the site
// (Book a Demo, Join the Beta, etc.) stays proportionally identical no matter
// where it appears. Only pick a bigger/smaller size; never hand-roll padding.
const sizeClasses = {
  sm: "px-3 py-1.5 text-xs sm:px-4 sm:text-sm",
  md: "px-6 py-2 text-base",
  lg: "px-8 py-3 text-lg",
} as const;

const variantClasses = {
  primary: "bg-accent text-white hover:brightness-105",
  secondary: "border-2 border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white",
} as const;

export function PillButton({
  href,
  size = "md",
  variant = "primary",
  className = "",
  children,
}: {
  href: string;
  size?: keyof typeof sizeClasses;
  variant?: keyof typeof variantClasses;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`whitespace-nowrap rounded-full font-semibold transition hover:-translate-y-0.5 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
