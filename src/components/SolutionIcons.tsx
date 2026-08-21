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
      <path d="M6 3v4a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V3" />
      <path d="M12 10v4" />
      <path d="M12 14a4 4 0 0 0-4 4v3" />
      <path d="M8 21h8" />
      <path d="M6 3h0M18 3h0" />
    </svg>
  );
}

export function InstallationIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14.7 6.3a3 3 0 0 0 4 4L21 8l-4-4-2.3 2.3Z" />
      <path d="M14.5 9.5 5 19l-2 2 2-2 9.5-9.5" />
      <path d="M9 5 5 9" />
      <path d="M3 21l3-1 1-3" />
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
      <path d="M12 3.5 18.5 6v5.2c0 4.3-2.8 7.7-6.5 9.3-3.7-1.6-6.5-5-6.5-9.3V6L12 3.5Z" />
      <path d="M9 12.3l2.2 2.2 4-4.3" />
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
