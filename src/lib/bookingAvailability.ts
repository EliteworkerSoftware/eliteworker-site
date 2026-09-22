import { getSupabaseAdmin } from "@/lib/supabase";
import { getFreeBusy } from "@/lib/googleCalendar";
import {
  BUSINESS_TIMEZONE,
  WORKING_DAYS,
  WORKING_HOURS,
  SLOT_LENGTH_MINUTES,
  BUFFER_MINUTES,
  MIN_NOTICE_HOURS,
  MAX_ADVANCE_DAYS,
} from "@/lib/bookingConfig";

// Re-exported so existing imports of these from this file keep working —
// the values themselves live in bookingConfig.ts (client-safe, no
// Supabase/Google imports) so the booking widget can import BUSINESS_TIMEZONE
// without pulling server-only modules into the client bundle.
export { BUSINESS_TIMEZONE, WORKING_DAYS, WORKING_HOURS, SLOT_LENGTH_MINUTES, BUFFER_MINUTES, MIN_NOTICE_HOURS, MAX_ADVANCE_DAYS };

type Interval = { start: number; end: number };
export type Slot = { start: string; end: string };
export type DaySlots = { date: string; times: Slot[] };

// Date objects are UTC-only internally, so "9am in America/New_York" can't be
// built directly — it has to be derived per calendar date (DST shifts the
// offset through the year). This resolves a "YYYY-MM-DD" + "HH:MM" wall-clock
// time in `timeZone` to the UTC instant it represents, by making a guess,
// checking what that guess actually displays as in the target zone, and
// correcting the difference once. Safe here because business hours (9am/5pm)
// never fall inside the 2am US DST transition window.
function zonedWallTimeToUtc(dateStr: string, hhmm: string, timeZone: string): Date {
  const guess = new Date(`${dateStr}T${hhmm}:00Z`);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(guess);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  const displayedAsUtc = Date.UTC(
    Number(get("year")),
    Number(get("month")) - 1,
    Number(get("day")),
    Number(get("hour")),
    Number(get("minute")),
    Number(get("second"))
  );
  const offsetMs = guess.getTime() - displayedAsUtc;
  return new Date(guess.getTime() + offsetMs);
}

function toDateStr(d: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

function weekdayInZone(d: Date, timeZone: string): number {
  const label = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short" }).format(d);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(label);
}

function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && aEnd > bStart;
}

// Fetches busy intervals from both the booking table and the host's real
// Google Calendar, so a manually-added personal event blocks a slot too.
async function getBusyIntervals(rangeStart: Date, rangeEnd: Date, excludeBookingId?: string): Promise<Interval[]> {
  const supabase = getSupabaseAdmin();
  let query = supabase
    .from("eliteworker_demo_bookings")
    .select("id, start_time, end_time")
    .neq("status", "cancelled")
    .lt("start_time", rangeEnd.toISOString())
    .gt("end_time", rangeStart.toISOString());
  if (excludeBookingId) query = query.neq("id", excludeBookingId);

  const [{ data: bookings, error }, googleBusy] = await Promise.all([
    query,
    getFreeBusy(rangeStart.toISOString(), rangeEnd.toISOString()).catch((err) => {
      console.error("Google freebusy lookup failed — falling back to Supabase-only availability:", err);
      return [] as Interval[];
    }),
  ]);
  if (error) throw new Error(error.message);

  const bufferMs = BUFFER_MINUTES * 60 * 1000;
  const supabaseIntervals: Interval[] = (bookings || [])
    .filter((b) => b.start_time && b.end_time)
    .map((b) => ({ start: new Date(b.start_time).getTime() - bufferMs, end: new Date(b.end_time).getTime() + bufferMs }));
  const googleIntervals: Interval[] = googleBusy.map((b) => ({
    start: new Date(b.start).getTime() - bufferMs,
    end: new Date(b.end).getTime() + bufferMs,
  }));

  return [...supabaseIntervals, ...googleIntervals];
}

// Returns open slots for the next `days` days starting at `from`, grouped by
// calendar date (in BUSINESS_TIMEZONE). `excludeBookingId` lets a reschedule
// treat a booking's own current slot as not-busy against itself.
export async function getOpenSlots({
  from = new Date(),
  days = 14,
  excludeBookingId,
}: {
  from?: Date;
  days?: number;
  excludeBookingId?: string;
}): Promise<DaySlots[]> {
  const now = Date.now();
  const earliestStart = now + MIN_NOTICE_HOURS * 60 * 60 * 1000;
  const latestStart = now + MAX_ADVANCE_DAYS * 24 * 60 * 60 * 1000;

  const rangeStart = new Date(Math.max(from.getTime(), now));
  const rangeEndCandidate = new Date(rangeStart.getTime() + days * 24 * 60 * 60 * 1000);
  const rangeEnd = new Date(Math.min(rangeEndCandidate.getTime(), latestStart));
  if (rangeEnd.getTime() <= rangeStart.getTime()) return [];

  const busy = await getBusyIntervals(rangeStart, rangeEnd, excludeBookingId);
  const slotMs = SLOT_LENGTH_MINUTES * 60 * 1000;

  const results: DaySlots[] = [];
  const cursor = new Date(rangeStart);
  while (cursor.getTime() < rangeEnd.getTime()) {
    const dateStr = toDateStr(cursor, BUSINESS_TIMEZONE);
    const dayStart = zonedWallTimeToUtc(dateStr, WORKING_HOURS.start, BUSINESS_TIMEZONE);
    const dayEnd = zonedWallTimeToUtc(dateStr, WORKING_HOURS.end, BUSINESS_TIMEZONE);

    if ((WORKING_DAYS as readonly number[]).includes(weekdayInZone(dayStart, BUSINESS_TIMEZONE))) {
      const times: Slot[] = [];
      for (let t = dayStart.getTime(); t + slotMs <= dayEnd.getTime(); t += slotMs) {
        if (t < earliestStart || t > latestStart) continue;
        if (t < rangeStart.getTime() || t >= rangeEnd.getTime()) continue;
        const slotEnd = t + slotMs;
        if (busy.some((b) => overlaps(t, slotEnd, b.start, b.end))) continue;
        times.push({ start: new Date(t).toISOString(), end: new Date(slotEnd).toISOString() });
      }
      if (times.length > 0) results.push({ date: dateStr, times });
    }

    // Advance one calendar day at a time in the business timezone, not a
    // fixed 24h — matters on the two days a year with a DST transition.
    cursor.setTime(cursor.getTime() + 24 * 60 * 60 * 1000);
  }

  return results;
}

// True if `start`/`end` (ISO strings) is currently an open slot — used to
// re-validate server-side right before writing a booking, closing most of
// the gap between "the client fetched availability" and "the client submits."
export async function isSlotOpen(start: string, end: string, excludeBookingId?: string): Promise<boolean> {
  const startMs = new Date(start).getTime();
  const endMs = new Date(end).getTime();
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs <= startMs) return false;
  if (startMs < Date.now() + MIN_NOTICE_HOURS * 60 * 60 * 1000) return false;

  const busy = await getBusyIntervals(new Date(startMs), new Date(endMs), excludeBookingId);
  return !busy.some((b) => overlaps(startMs, endMs, b.start, b.end));
}
