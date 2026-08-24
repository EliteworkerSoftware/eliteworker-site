import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import Mailgun from "mailgun.js";
import formData from "form-data";
import { render } from "@react-email/render";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendAlertSms } from "@/lib/sms";
import { DemoBookedEmail } from "@/emails/DemoBookedEmail";

// Cal.com signs the raw request body with the webhook secret you set when
// creating the webhook in its dashboard — verify it here so this public URL
// can't be used to inject fake bookings or spam the notification email.
function verifySignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.CAL_WEBHOOK_SECRET;
  if (!secret || !signature) return false;

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

type CalAttendee = { name?: string; email?: string };
type CalBookingPayload = {
  uid?: string;
  title?: string;
  startTime?: string;
  endTime?: string;
  attendees?: CalAttendee[];
  // Cal.com sends the booker's "additional notes" text both as this
  // top-level field and nested under responses.notes.value, depending on
  // API version — check both rather than betting on just one.
  additionalNotes?: string;
  responses?: { notes?: { value?: string } };
};
type CalWebhookEvent = {
  triggerEvent?: string;
  payload?: CalBookingPayload;
};

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-cal-signature-256");

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: CalWebhookEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const booking = event.payload;
  if (!booking?.uid) {
    return NextResponse.json({ ok: true });
  }

  const status =
    event.triggerEvent === "BOOKING_CANCELLED"
      ? "cancelled"
      : event.triggerEvent === "BOOKING_RESCHEDULED"
        ? "rescheduled"
        : "confirmed";

  const attendee = booking.attendees?.[0];
  const notes = booking.additionalNotes || booking.responses?.notes?.value || null;

  // 1. Save/update the booking so it shows in /admin, even if the email below fails.
  // pipeline_status is only set on true new bookings — omitting it on
  // cancel/reschedule pings leaves whatever admin-tracked status (e.g.
  // "confirm_2") the row already has untouched.
  const supabase = getSupabaseAdmin();
  const upsertData: Record<string, unknown> = {
    booking_uid: booking.uid,
    attendee_name: attendee?.name ?? null,
    attendee_email: attendee?.email ?? null,
    start_time: booking.startTime ?? null,
    end_time: booking.endTime ?? null,
    event_title: booking.title ?? null,
    status,
    notes,
  };
  if (event.triggerEvent === "BOOKING_CREATED") {
    // Cal.com sends its own confirmation email to the attendee the moment
    // this webhook fires — "Confirm 1" tracks that first, automatic
    // confirmation. "Confirm 2" comes later from our own day-before reminder.
    upsertData.pipeline_status = "confirm_1";
  }
  const { error: dbError } = await supabase
    .from("eliteworker_demo_bookings")
    .upsert(upsertData, { onConflict: "booking_uid" });
  if (dbError) {
    console.error("Supabase upsert error:", dbError);
  }

  // 2. Notify only on new bookings, not every cancel/reschedule ping.
  if (event.triggerEvent === "BOOKING_CREATED") {
    const when = booking.startTime
      ? new Date(booking.startTime).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
      : "unknown time";

    try {
      const emailElement = DemoBookedEmail({
        attendeeName: attendee?.name || attendee?.email || "Someone",
        attendeeEmail: attendee?.email || "no email given",
        when,
        eventTitle: booking.title,
        notes,
      });
      const [html, text] = await Promise.all([
        render(emailElement),
        render(emailElement, { plainText: true }),
      ]);

      const mailgun = new Mailgun(formData);
      const mg = mailgun.client({ username: "api", key: process.env.MAILGUN_API_KEY || "" });
      await mg.messages.create(process.env.MAILGUN_DOMAIN || "", {
        from: process.env.CONTACT_FROM_EMAIL || `EliteWorker Site <postmaster@${process.env.MAILGUN_DOMAIN}>`,
        to: process.env.CONTACT_TO_EMAIL || "you@example.com",
        subject: `New demo booked: ${attendee?.name || attendee?.email || "someone"}`,
        html,
        text,
      });
    } catch (err) {
      console.error("Mailgun send error:", err);
    }

    await sendAlertSms(`New demo booked: ${attendee?.name || attendee?.email || "someone"} — ${when}.`);
  }

  return NextResponse.json({ ok: true });
}
