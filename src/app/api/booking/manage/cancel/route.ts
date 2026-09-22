import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { verifyBookingActionToken } from "@/lib/demoConfirmToken";
import { htmlResponsePage } from "@/lib/htmlResponsePage";
import { deleteEvent } from "@/lib/googleCalendar";
import { generateBookingIcs } from "@/lib/bookingIcs";
import { sendDemoCancelledEmail } from "@/lib/sendDemoCancelledEmail";
import { BUSINESS_TIMEZONE } from "@/lib/bookingAvailability";

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short", timeZone: BUSINESS_TIMEZONE });
}

function expiredPage() {
  return htmlResponsePage(
    "Link expired or invalid",
    `<p>This cancellation link isn&rsquo;t valid. If you still need to cancel, just reply to one of our emails and we&rsquo;ll take care of it.</p>`
  );
}

// A human clicks this from an email — GET shows a confirm step (no
// client-side JS required, just a plain <form method="POST">), POST performs
// the actual cancellation. Both render standalone HTML, not JSON.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") || "";
  const bookingId = verifyBookingActionToken(token, "cancel");
  if (!bookingId) return expiredPage();

  const supabase = getSupabaseAdmin();
  const { data: booking } = await supabase
    .from("eliteworker_demo_bookings")
    .select("status, start_time")
    .eq("id", bookingId)
    .single();

  if (!booking) return expiredPage();
  if (booking.status === "cancelled") {
    return htmlResponsePage("Already cancelled", `<p>This demo has already been cancelled — nothing else to do here.</p>`);
  }

  const when = booking.start_time ? formatWhen(booking.start_time) : "your scheduled time";
  return htmlResponsePage(
    "Cancel your demo?",
    `<p>You&rsquo;re about to cancel your EliteWorker demo scheduled for ${when}.</p>` +
      `<form method="POST" action="/api/booking/manage/cancel?token=${encodeURIComponent(token)}">` +
      `<textarea name="reason" rows="3" placeholder="Reason (optional)"></textarea>` +
      `<button type="submit">Cancel my demo</button>` +
      `</form>`
  );
}

export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") || "";
  const bookingId = verifyBookingActionToken(token, "cancel");
  if (!bookingId) return expiredPage();

  const form = await req.formData().catch(() => null);
  const reason = typeof form?.get("reason") === "string" ? (form!.get("reason") as string).slice(0, 1000) : null;

  const supabase = getSupabaseAdmin();
  const { data: booking } = await supabase
    .from("eliteworker_demo_bookings")
    .select("status, start_time, google_event_id, attendee_email, attendee_name, booking_uid, reschedule_count")
    .eq("id", bookingId)
    .single();

  if (!booking) return expiredPage();
  if (booking.status === "cancelled") {
    return htmlResponsePage("Already cancelled", `<p>This demo has already been cancelled — nothing else to do here.</p>`);
  }

  if (booking.google_event_id) {
    try {
      await deleteEvent(booking.google_event_id);
    } catch (err) {
      console.error("Failed to delete Google Calendar event on cancel:", err);
    }
  }

  const { error } = await supabase
    .from("eliteworker_demo_bookings")
    .update({ status: "cancelled", cancelled_at: new Date().toISOString(), cancel_reason: reason || null })
    .eq("id", bookingId);

  if (error) {
    console.error("Booking cancel update error:", error);
    return htmlResponsePage("Something went wrong", `<p>We couldn&rsquo;t process your cancellation. Please reply to one of our emails and we&rsquo;ll cancel it manually.</p>`);
  }

  const when = booking.start_time ? formatWhen(booking.start_time) : "your scheduled time";
  if (booking.attendee_email && booking.start_time) {
    try {
      const ics = generateBookingIcs({
        uid: booking.booking_uid,
        title: "EliteWorker Demo",
        description: "Cancelled",
        start: new Date(booking.start_time),
        end: new Date(booking.start_time),
        organizerEmail: (process.env.CONTACT_TO_EMAIL || "contact@eliteworker.com").trim(),
        organizerName: "EliteWorker",
        attendeeEmail: booking.attendee_email,
        attendeeName: booking.attendee_name || "there",
        method: "CANCEL",
        sequence: (booking.reschedule_count || 0) + 1,
      });
      await sendDemoCancelledEmail({ to: booking.attendee_email, attendeeName: booking.attendee_name || "there", when, ics });
    } catch (err) {
      console.error("Cancellation email error:", err);
    }
  }

  return htmlResponsePage("You're cancelled", `<p>Your demo has been cancelled. Hope to see you another time — you can book a new slot anytime from our site.</p>`);
}
