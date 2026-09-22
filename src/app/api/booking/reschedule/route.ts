import { NextRequest, NextResponse, after } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { verifyBookingActionToken, createBookingActionToken } from "@/lib/demoConfirmToken";
import { isSlotOpen, BUSINESS_TIMEZONE } from "@/lib/bookingAvailability";
import { updateEvent } from "@/lib/googleCalendar";
import { generateBookingIcs } from "@/lib/bookingIcs";
import { sendDemoConfirmationEmail } from "@/lib/sendDemoConfirmationEmail";
import { SITE_URL } from "@/emails/constants";

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short", timeZone: BUSINESS_TIMEZONE });
}

export async function POST(req: NextRequest) {
  try {
    const { token, start, end } = await req.json();
    const bookingId = typeof token === "string" ? verifyBookingActionToken(token, "reschedule") : null;
    if (!bookingId) {
      return NextResponse.json({ error: "This link isn't valid — request a new one from your confirmation email." }, { status: 400 });
    }

    const startDate = typeof start === "string" ? new Date(start) : null;
    const endDate = typeof end === "string" ? new Date(end) : null;
    if (!startDate || !endDate || Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || endDate <= startDate) {
      return NextResponse.json({ error: "Invalid time slot" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: booking, error: fetchError } = await supabase
      .from("eliteworker_demo_bookings")
      .select("id, status, start_time, end_time, google_event_id, attendee_email, attendee_name, event_title, booking_uid, reschedule_count, original_start_time, meeting_url")
      .eq("id", bookingId)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    if (booking.status === "cancelled") {
      return NextResponse.json({ error: "This booking has already been cancelled." }, { status: 409 });
    }

    // Idempotent: resubmitting the same time it's already at (e.g. a
    // double-click) is a no-op, not a second reschedule.
    if (booking.start_time === start && booking.end_time === end) {
      return NextResponse.json({ ok: true });
    }

    const open = await isSlotOpen(start, end, bookingId);
    if (!open) {
      return NextResponse.json({ error: "That time was just taken — pick another." }, { status: 409 });
    }

    const nextRescheduleCount = (booking.reschedule_count || 0) + 1;
    const { error: updateError } = await supabase
      .from("eliteworker_demo_bookings")
      .update({
        start_time: start,
        end_time: end,
        original_start_time: booking.original_start_time || booking.start_time,
        rescheduled_at: new Date().toISOString(),
        reschedule_count: nextRescheduleCount,
        status: "confirmed",
        pipeline_status: "confirm_1",
        reminder_sent_at: null,
      })
      .eq("id", bookingId);

    if (updateError) {
      if (updateError.code === "23505") {
        return NextResponse.json({ error: "That time was just taken — pick another." }, { status: 409 });
      }
      console.error("Reschedule update error:", updateError);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }

    const when = formatWhen(start);

    after(async () => {
      if (booking.google_event_id) {
        try {
          await updateEvent(booking.google_event_id, { start, end });
        } catch (err) {
          console.error("Google Calendar reschedule update failed:", err);
        }
      }

      if (booking.attendee_email) {
        try {
          const ics = generateBookingIcs({
            uid: booking.booking_uid,
            title: booking.event_title || "EliteWorker Demo",
            description: "Rescheduled",
            start: startDate,
            end: endDate,
            organizerEmail: (process.env.CONTACT_TO_EMAIL || "contact@eliteworker.com").trim(),
            organizerName: "EliteWorker",
            attendeeEmail: booking.attendee_email,
            attendeeName: booking.attendee_name || "there",
            meetingUrl: booking.meeting_url,
            method: "REQUEST",
            sequence: nextRescheduleCount,
          });
          const cancelUrl = `${SITE_URL}/api/booking/manage/cancel?token=${createBookingActionToken(bookingId, "cancel")}`;
          const rescheduleUrl = `${SITE_URL}/booking/reschedule?token=${createBookingActionToken(bookingId, "reschedule")}`;
          await sendDemoConfirmationEmail({
            to: booking.attendee_email,
            attendeeName: booking.attendee_name || "there",
            when,
            eventTitle: booking.event_title,
            meetingUrl: booking.meeting_url,
            cancelUrl,
            rescheduleUrl,
            ics,
          });
        } catch (err) {
          console.error("Reschedule confirmation email error:", err);
        }
      }
    });

    return NextResponse.json({ ok: true, when });
  } catch (err) {
    console.error("Reschedule error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
