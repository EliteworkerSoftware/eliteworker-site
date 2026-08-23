import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { createConfirmToken } from "@/lib/demoConfirmToken";
import { sendDemoReminderEmail } from "@/lib/sendDemoReminderEmail";
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
    .select("id, booking_uid, attendee_name, attendee_email, start_time, event_title")
    .eq("pipeline_status", "confirm_1")
    .is("reminder_sent_at", null)
    .gte("start_time", windowStart)
    .lte("start_time", windowEnd);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let sent = 0;
  for (const booking of bookings || []) {
    if (!booking.attendee_email) continue;
    try {
      const confirmUrl = `${SITE_URL}/api/demo-confirm?token=${createConfirmToken(booking.id)}`;
      // Cal.com's own reschedule flow: it looks up the original booking from
      // rescheduleUid and preloads the attendee's name/email/answers itself,
      // so there's nothing else to pass.
      const rescheduleUrl = `https://cal.com/${process.env.NEXT_PUBLIC_CAL_LINK}?rescheduleUid=${encodeURIComponent(booking.booking_uid)}`;
      const when = booking.start_time
        ? new Date(booking.start_time).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })
        : "soon";
      await sendDemoReminderEmail({
        to: booking.attendee_email,
        name: booking.attendee_name || "there",
        when,
        eventTitle: booking.event_title,
        confirmUrl,
        rescheduleUrl,
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

  return NextResponse.json({ ok: true, checked: bookings?.length || 0, sent });
}
