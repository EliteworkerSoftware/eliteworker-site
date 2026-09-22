// Pure business-hours config, safe to import from client components (no
// Supabase/Google Calendar imports here — those pull in server-only env
// vars that must never reach the browser bundle).
export const BUSINESS_TIMEZONE = "America/New_York";
export const WORKING_DAYS = [1, 2, 3, 4, 5] as const; // Mon-Fri (0=Sun..6=Sat)
export const WORKING_HOURS = { start: "09:00", end: "17:00" } as const;
export const SLOT_LENGTH_MINUTES = 30;
export const BUFFER_MINUTES = 15;
export const MIN_NOTICE_HOURS = 24;
export const MAX_ADVANCE_DAYS = 30;
