import { createEvent, type DateArray } from "ics";
import { SITE_URL } from "@/emails/constants";

function toUtcArray(date: Date): DateArray {
  return [date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes()];
}

// Generates the .ics attachment used across confirmation/reminder/cancel
// emails. `uid` should always be the booking's booking_uid — reusing the same
// uid across a reschedule (with an incremented `sequence`) is what tells
// calendar apps to update the existing event instead of adding a duplicate.
export function generateBookingIcs(input: {
  uid: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  organizerEmail: string;
  organizerName: string;
  attendeeEmail: string;
  attendeeName: string;
  meetingUrl?: string | null;
  method: "REQUEST" | "CANCEL";
  sequence: number;
}): { filename: string; content: string } {
  const { error, value } = createEvent({
    uid: input.uid,
    title: input.title,
    description: input.meetingUrl ? `${input.description}\n\nJoin: ${input.meetingUrl}` : input.description,
    location: input.meetingUrl || undefined,
    url: `${SITE_URL}/demo`,
    start: toUtcArray(input.start),
    end: toUtcArray(input.end),
    startInputType: "utc",
    endInputType: "utc",
    status: input.method === "CANCEL" ? "CANCELLED" : "CONFIRMED",
    method: input.method,
    sequence: input.sequence,
    organizer: { name: input.organizerName, email: input.organizerEmail },
    attendees: [{ name: input.attendeeName, email: input.attendeeEmail, rsvp: true }],
    productId: "eliteworker/booking",
  });

  if (error || !value) {
    throw new Error(`ics generation failed: ${error?.message || "no value returned"}`);
  }

  return { filename: input.method === "CANCEL" ? "cancelled.ics" : "demo.ics", content: value };
}
