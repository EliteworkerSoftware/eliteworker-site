type IconProps = { className?: string };

export function SaleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12.5 3.5h5a2 2 0 0 1 2 2v5a2 2 0 0 1-.586 1.414l-8 8a2 2 0 0 1-2.828 0l-5-5a2 2 0 0 1 0-2.828l8-8A2 2 0 0 1 12.5 3.5Z" />
      <circle cx="16" cy="8" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function OrderIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 3h12v18l-2.5-1.5L13 21l-1-1.5L10 21l-2.5-1.5L6 21V3Z" />
      <path d="M9 8h6M9 11h6M9 14h4" />
    </svg>
  );
}

export function ScheduleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
      <path d="M8.5 14h1M12 14h1M15.5 14h1" strokeWidth={2.2} />
    </svg>
  );
}

export function WiringIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="1.8" y="2.3" width="8.6" height="6.2" rx="2.8" />
      <rect x="2.6" y="4.1" width="2.6" height="2.6" rx="1" />
      <rect x="13.6" y="15.5" width="8.6" height="6.2" rx="2.8" />
      <rect x="18.4" y="17.3" width="2.6" height="2.6" rx="1" />
      <path d="M10.4 5.4C16 8 8 16 13.6 18.6" strokeWidth={1.6} />
    </svg>
  );
}

export function InstallationIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2.5" y="7.5" width="10" height="5.5" rx="1.5" />
      <path d="M5.5 13v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-5" />
      <path d="M8 13v2.2" />
      <path d="M12.5 8.7h2.4v3.6h-2.4Z" fill="currentColor" stroke="none" />
      <path d="M16.7 10.5h5.3" strokeWidth={1.75} />
    </svg>
  );
}

export function ProgrammingIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 8 4.5 12 9 16" />
      <path d="M15 8l4.5 4-4.5 4" />
      <path d="M13 5 11 19" />
    </svg>
  );
}

export function QualityCheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <path d="M8 12.5l2.5 2.5 5.5-6" strokeWidth={2} />
    </svg>
  );
}

export function TutorialIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 7.5v9l7.5-4.5L9 7.5Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function BillingIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18" />
      <path d="M6.5 14.5h4" />
    </svg>
  );
}
