// Email images must be absolute URLs — email clients have no concept of a
// relative "current page" to resolve against.
export const SITE_URL = "https://www.eliteworker.com";
export const LOGO_WHITE_URL = `${SITE_URL}/email-logo-white.png`;
export const LOGO_DARK_URL = `${SITE_URL}/email-logo.png`;

export const COLORS = {
  brand: "#3b82f6",
  brandDark: "#1e40af",
  brandLight: "#60a5fa",
  accent: "#f59e0b",
  accentLight: "#fbbf24",
  ink: "#0f172a",
  inkMuted: "#5b6472",
  nav: "#05080e",
  paper: "#ffffff",
  paperAlt: "#f7f9fc",
  line: "#e3e8f0",
} as const;
