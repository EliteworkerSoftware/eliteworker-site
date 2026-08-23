import { Button } from "@react-email/components";
import { COLORS } from "../constants";

// Matches the site's rounded pill CTA (bg-accent, rounded-full). "secondary"
// is for a lower-emphasis action placed alongside a primary one (e.g.
// reschedule next to confirm) — outlined instead of filled.
export function PillButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: string;
  variant?: "primary" | "secondary";
}) {
  const style =
    variant === "primary"
      ? { backgroundColor: COLORS.accent, color: "#ffffff", border: "1px solid transparent" }
      : { backgroundColor: "transparent", color: COLORS.ink, border: `1px solid ${COLORS.line}` };

  return (
    <Button
      href={href}
      style={{
        ...style,
        fontSize: 14,
        fontWeight: 600,
        textDecoration: "none",
        padding: "12px 28px",
        borderRadius: 999,
        display: "inline-block",
        // Without this, a narrow mobile viewport can force the button's own
        // label to wrap mid-word (e.g. "Reschedul" / "e" on two lines) —
        // the button should shrink the available space, never the text.
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </Button>
  );
}
