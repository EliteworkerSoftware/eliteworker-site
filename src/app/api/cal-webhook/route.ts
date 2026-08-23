import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import Mailgun from "mailgun.js";
import formData from "form-data";
import { getSupabaseAdmin } from "@/lib/supabase";

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

  // 1. Save/update the booking so it shows in /admin, even if the email below fails.
  const supabase = getSupabaseAdmin();
  const { error: dbError } = await supabase.from("eliteworker_demo_bookings").upsert(
    {
      booking_uid: booking.uid,
      attendee_name: attendee?.name ?? null,
      attendee_email: attendee?.email ?? null,
      start_time: booking.startTime ?? null,
      end_time: booking.endTime ?? null,
      event_title: booking.title ?? null,
      status,
    },
    { onConflict: "booking_uid" }
  );
  if (dbError) {
    console.error("Supabase upsert error:", dbError);
  }

  // 2. Notify only on new bookings, not every cancel/reschedule ping.
  if (event.triggerEvent === "BOOKING_CREATED") {
    try {
      const mailgun = new Mailgun(formData);
      const mg = mailgun.client({ username: "api", key: process.env.MAILGUN_API_KEY || "" });
      await mg.messages.create(process.env.MAILGUN_DOMAIN || "", {
        from: process.env.CONTACT_FROM_EMAIL || `EliteWorker Site <postmaster@${process.env.MAILGUN_DOMAIN}>`,
        to: process.env.CONTACT_TO_EMAIL || "you@example.com",
        subject: `New demo booked: ${attendee?.name || attendee?.email || "someone"}`,
        text: `${attendee?.name || "Someone"} (${attendee?.email || "no email given"}) booked a demo.\n\nWhen: ${booking.startTime} – ${booking.endTime}\nEvent: ${booking.title || "—"}`,
      });
    } catch (err) {
      console.error("Mailgun send error:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
