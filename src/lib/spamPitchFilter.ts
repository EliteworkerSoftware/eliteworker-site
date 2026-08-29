// Turnstile only stops bots — it does nothing against a real person manually
// filling out the form to cold-pitch web design/SEO/marketing services. This
// is a lightweight heuristic for that specific pattern: score a few common
// pitch phrases plus the presence of a link (most pitches point to the
// sender's own portfolio/site), and treat anything crossing the threshold as
// spam. It's intentionally forgiving of a single loose match (real leads say
// "our website" too) — only multiple signals, or one signal plus a link, trip it.
const PITCH_SIGNALS: RegExp[] = [
  /\bseo\b/i,
  /search engine optimi[sz]ation/i,
  /\bbacklinks?\b/i,
  /web design(er)?\s+(services?|agency|company)/i,
  /redesign(ing)?\s+your\s+website/i,
  /improve\s+your\s+(website|ranking|search\s+ranking)/i,
  /boost\s+your\s+(ranking|traffic|sales)/i,
  /digital\s+marketing/i,
  /social\s+media\s+marketing/i,
  /website\s+audit/i,
  /free\s+(consultation|quote|proposal|audit)/i,
  /grow\s+your\s+(business|traffic|sales)/i,
  /increase\s+(your\s+)?(website\s+)?traffic/i,
  /(mobile[- ]friendly|responsive)\s+(website|design)/i,
  /website\s+(is\s+)?(outdated|loading\s+(speed|slow)|slow)/i,
  /i\s+(noticed|came across|found)\s+your\s+website/i,
  /we\s+(can|could)\s+(help|fix|improve|redesign|build|rank)/i,
  /rank\s+(higher|#?1)\s+on\s+google/i,
];

const URL_PATTERN = /(https?:\/\/|www\.)\S+/i;

export function isLikelySpamPitch(message: string): boolean {
  const hits = PITCH_SIGNALS.filter((re) => re.test(message)).length;
  const hasUrl = URL_PATTERN.test(message);
  return hits >= 2 || (hits >= 1 && hasUrl);
}
