import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { createConfirmToken, createBookingActionToken } from "@/lib/demoConfirmToken";
import { sendDemoReminderEmail } from "@/lib/sendDemoReminderEmail";
import { generateBookingIcs } from "@/lib/bookingIcs";
import { createEvent as createGoogleEvent } from "@/lib/googleCalendar";
import { SITE_URL } from "@/emails/constants";

// Vercel Cron sends this header on every scheduled invocation when
// CRON_SECRET is set — that's what keeps this public route from being
// abused to spam reminder emails.
function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseAdmin();
  const now = Date.now();
  // A generous ~20-32h window (not an exact 24h) so a once-daily cron run
  // reliably catches every booking "about a day out" regardless of what
  // time of day the cron actually fires.
  const windowStart = new Date(now + 20 * 60 * 60 * 1000).toISOString();
  const windowEnd = new Date(now + 32 * 60 * 60 * 1000).toISOString();

  const { data: bookings, error } = await supabase
    .from("eliteworker_demo_bookings")
    .select("id, booking_uid, attendee_name, attendee_email, start_time, end_time, event_title, meeting_url")
    .eq("pipeline_status", "confirm_1")
    .neq("status", "cancelled")
    .is("reminder_sent_at", null)
    .gte("start_time", windowStart)
    .lte("start_time", windowEnd);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let sent = 0;
  for (const booking of bookings || []) {
    if (!booking.attendee_email) continue;
    try {
      const confirmUrl = `${SITE_URL}/api/demo-confirm?token=${createConfirmToken(booking.id)}`;
      const rescheduleUrl = `${SITE_URL}/booking/reschedule?token=${createBookingActionToken(booking.id, "reschedule")}`;
      const cancelUrl = `${SITE_URL}/api/booking/manage/cancel?token=${createBookingActionToken(booking.id, "cancel")}`;
      const when = booking.start_time
        ? new Date(booking.start_time).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })
        : "soon";
      const ics =
        booking.start_time && booking.end_time
          ? generateBookingIcs({
              uid: booking.booking_uid,
              title: booking.event_title || "EliteWorker Demo",
              description: "EliteWorker demo",
              start: new Date(booking.start_time),
              end: new Date(booking.end_time),
              organizerEmail: (process.env.CONTACT_TO_EMAIL || "contact@eliteworker.com").trim(),
              organizerName: "EliteWorker",
              attendeeEmail: booking.attendee_email,
              attendeeName: booking.attendee_name || "there",
              meetingUrl: booking.meeting_url,
              method: "REQUEST",
              sequence: 0,
            })
          : undefined;
      await sendDemoReminderEmail({
        to: booking.attendee_email,
        name: booking.attendee_name || "there",
        when,
        eventTitle: booking.event_title,
        confirmUrl,
        rescheduleUrl,
        cancelUrl,
        ics,
      });
      await supabase
        .from("eliteworker_demo_bookings")
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq("id", booking.id);
      sent++;
    } catch (err) {
      console.error("Demo reminder email error:", err);
    }
  }

  // Backfill: retry creating the Google Calendar event for any upcoming,
  // active booking that never got one (e.g. the API call failed at booking
  // time). Piggybacks on this existing daily cron rather than adding a
  // second vercel.json entry.
  const { data: missingEvents } = await supabase
    .from("eliteworker_demo_bookings")
    .select("id, attendee_name, attendee_email, attendee_phone, notes, start_time, end_time")
    .is("google_event_id", null)
    .neq("status", "cancelled")
    .gte("start_time", new Date().toISOString());

  let backfilled = 0;
  for (const booking of missingEvents || []) {
    if (!booking.start_time || !booking.end_time) continue;
    try {
      const result = await createGoogleEvent({
        summary: `EliteWorker Demo — ${booking.attendee_name || "Attendee"}`,
        description: `Attendee: ${booking.attendee_name || ""} (${booking.attendee_email || ""}${booking.attendee_phone ? `, ${booking.attendee_phone}` : ""})${booking.notes ? `\n\nNotes: ${booking.notes}` : ""}`,
        start: booking.start_time,
        end: booking.end_time,
      });
      await supabase
        .from("eliteworker_demo_bookings")
        .update({ google_event_id: result.eventId, meeting_url: result.meetingUrl })
        .eq("id", booking.id);
      backfilled++;
    } catch (err) {
      console.error("Google Calendar backfill error:", err);
    }
  }

  return NextResponse.json({ ok: true, checked: bookings?.length || 0, sent, backfilled });
}
