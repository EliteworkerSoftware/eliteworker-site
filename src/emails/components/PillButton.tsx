import { Button } from "@react-email/components";
import { COLORS } from "../constants";

// Matches the site's rounded pill CTA (bg-accent, rounded-full).
export function PillButton({ href, children }: { href: string; children: string }) {
  return (
    <Button
      href={href}
      style={{
        backgroundColor: COLORS.accent,
        color: "#ffffff",
        fontSize: 14,
        fontWeight: 600,
        textDecoration: "none",
        padding: "12px 28px",
        borderRadius: 999,
        display: "inline-block",
      }}
    >
      {children}
    </Button>
  );
}
