import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { verifyBookingActionToken } from "@/lib/demoConfirmToken";

// JSON endpoint the reschedule page's client component calls to prefill the
// booking's current details and confirm the token is still valid.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") || "";
  const bookingId = verifyBookingActionToken(token, "reschedule");
  if (!bookingId) return NextResponse.json({ error: "Invalid or expired link" }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { data: booking } = await supabase
    .from("eliteworker_demo_bookings")
    .select("id, status, start_time, end_time, attendee_name, event_title")
    .eq("id", bookingId)
    .single();

  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (booking.status === "cancelled") {
    return NextResponse.json({ error: "This booking has already been cancelled." }, { status: 409 });
  }

  return NextResponse.json({
    bookingId: booking.id,
    attendeeName: booking.attendee_name,
    eventTitle: booking.event_title,
    currentStart: booking.start_time,
    currentEnd: booking.end_time,
  });
}
