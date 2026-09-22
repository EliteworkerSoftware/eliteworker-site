import { NextRequest, NextResponse, after } from "next/server";
import Mailgun from "mailgun.js";
import formData from "form-data";
import { render } from "@react-email/render";
import { getSupabaseAdmin } from "@/lib/supabase";
import { verifyTurnstile } from "@/lib/turnstile";
import { isValidEmail } from "@/lib/email";
import { isSlotOpen, BUSINESS_TIMEZONE } from "@/lib/bookingAvailability";
import { createEvent as createGoogleEvent } from "@/lib/googleCalendar";
import { generateBookingIcs } from "@/lib/bookingIcs";
import { sendDemoConfirmationEmail } from "@/lib/sendDemoConfirmationEmail";
import { createBookingActionToken } from "@/lib/demoConfirmToken";
import { sendAlertSms } from "@/lib/sms";
import { DemoBookedEmail } from "@/emails/DemoBookedEmail";
import { SITE_URL } from "@/emails/constants";

const NAME_LIMIT = 200;
const NOTES_LIMIT = 2000;
const PHONE_RE = /^[0-9+()\-.\s]{7,20}$/;
const EVENT_TITLE = "EliteWorker Demo";

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short", timeZone: BUSINESS_TIMEZONE });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, notes, start, end, turnstileToken } = body;

    if (typeof name !== "string" || !name.trim() || name.length > NAME_LIMIT) {
      return NextResponse.json({ error: "Missing or invalid required fields" }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
    }
    if (typeof phone !== "string" || !PHONE_RE.test(phone.trim())) {
      return NextResponse.json({ error: "Enter a valid phone number" }, { status: 400 });
    }
    if (notes != null && (typeof notes !== "string" || notes.length > NOTES_LIMIT)) {
      return NextResponse.json({ error: "Missing or invalid required fields" }, { status: 400 });
    }
    const startDate = typeof start === "string" ? new Date(start) : null;
    const endDate = typeof end === "string" ? new Date(end) : null;
    if (!startDate || !endDate || Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || endDate <= startDate) {
      return NextResponse.json({ error: "Invalid time slot" }, { status: 400 });
    }

    const remoteIp = req.headers.get("x-forwarded-for");
    const isHuman = await verifyTurnstile(turnstileToken, remoteIp);
    if (!isHuman) {
      return NextResponse.json({ error: "Verification failed — please try again" }, { status: 400 });
    }

    // Re-check the slot server-side — the client's availability fetch and
    // this submit aren't atomic, so someone else may have taken it since.
    const open = await isSlotOpen(start, end);
    if (!open) {
      return NextResponse.json({ error: "That time was just taken — pick another." }, { status: 409 });
    }

    const supabase = getSupabaseAdmin();
    const bookingUid = crypto.randomUUID();
    const { data: booking, error: dbError } = await supabase
      .from("eliteworker_demo_bookings")
      .insert({
        booking_uid: bookingUid,
        attendee_name: name,
        attendee_email: email,
        attendee_phone: phone,
        start_time: start,
        end_time: end,
        event_title: EVENT_TITLE,
        status: "confirmed",
        pipeline_status: "confirm_1",
        notes: notes || null,
      })
      .select()
      .single();

    if (dbError) {
      // A concurrent request won the same slot between the check above and
      // this insert — the partial unique index on active start_time catches
      // it (Postgres code 23505).
      if (dbError.code === "23505") {
        return NextResponse.json({ error: "That time was just taken — pick another." }, { status: 409 });
      }
      console.error("Booking insert error:", dbError);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }

    const when = formatWhen(start);

    // Calendar sync, confirmation email, and alerts all run after the
    // response is sent — the booking itself is already safely saved, and
    // none of this should make the visitor wait or risk a Vercel function
    // timeout turning a successful booking into a visible error.
    after(async () => {
      let meetingUrl: string | null = null;
      try {
        const result = await createGoogleEvent({
          summary: `${EVENT_TITLE} — ${name}`,
          description: `Attendee: ${name} (${email}${phone ? `, ${phone}` : ""})${notes ? `\n\nNotes: ${notes}` : ""}`,
          start,
          end,
        });
        meetingUrl = result.meetingUrl;
        await supabase
          .from("eliteworker_demo_bookings")
          .update({ google_event_id: result.eventId, meeting_url: result.meetingUrl })
          .eq("id", booking.id);
      } catch (err) {
        // Left with google_event_id null — the reminder cron backfills this
        // later. The attendee still gets their confirmation + .ics either way.
        console.error("Google Calendar event creation failed:", err);
      }

      const cancelUrl = `${SITE_URL}/api/booking/manage/cancel?token=${createBookingActionToken(booking.id, "cancel")}`;
      const rescheduleUrl = `${SITE_URL}/booking/reschedule?token=${createBookingActionToken(booking.id, "reschedule")}`;

      try {
        const ics = generateBookingIcs({
          uid: bookingUid,
          title: EVENT_TITLE,
          description: notes || "EliteWorker demo",
          start: startDate,
          end: endDate,
          organizerEmail: (process.env.CONTACT_TO_EMAIL || "contact@eliteworker.com").trim(),
          organizerName: "EliteWorker",
          attendeeEmail: email,
          attendeeName: name,
          meetingUrl,
          method: "REQUEST",
          sequence: 0,
        });
        await sendDemoConfirmationEmail({
          to: email,
          attendeeName: name,
          when,
          eventTitle: EVENT_TITLE,
          meetingUrl,
          cancelUrl,
          rescheduleUrl,
          ics,
        });
      } catch (err) {
        console.error("Demo confirmation email error:", err);
      }

      try {
        const mailgun = new Mailgun(formData);
        const mg = mailgun.client({ username: "api", key: process.env.MAILGUN_API_KEY || "" });
        const teamElement = DemoBookedEmail({ attendeeName: name, attendeeEmail: email, attendeePhone: phone, when, eventTitle: EVENT_TITLE, notes });
        const [teamHtml, teamText] = await Promise.all([render(teamElement), render(teamElement, { plainText: true })]);
        await mg.messages.create(process.env.MAILGUN_DOMAIN || "", {
          from: process.env.CONTACT_FROM_EMAIL || `EliteWorker Site <postmaster@${process.env.MAILGUN_DOMAIN}>`,
          to: process.env.CONTACT_TO_EMAIL || "you@example.com",
          subject: `New demo booked: ${name}`,
          html: teamHtml,
          text: teamText,
        });
      } catch (err) {
        console.error("Team notification email error:", err);
      }

      await sendAlertSms(`New demo booked: ${name} — ${when}.`);
    });

    return NextResponse.json({ ok: true, bookingId: booking.id });
  } catch (err) {
    console.error("Booking error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
