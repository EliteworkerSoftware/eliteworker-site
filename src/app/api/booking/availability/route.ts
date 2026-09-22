import { NextRequest, NextResponse } from "next/server";
import { getOpenSlots, MAX_ADVANCE_DAYS } from "@/lib/bookingAvailability";

// Public, read-only — no PII exposed, just open time slots. Used by both the
// fresh-booking widget and the reschedule page (via excludeBookingId).
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const startParam = params.get("start");
  const daysParam = Number(params.get("days") || "14");
  const excludeBookingId = params.get("excludeBookingId") || undefined;

  const from = startParam ? new Date(startParam) : new Date();
  if (Number.isNaN(from.getTime())) {
    return NextResponse.json({ error: "Invalid start date" }, { status: 400 });
  }
  const days = Number.isFinite(daysParam) ? Math.min(Math.max(daysParam, 1), MAX_ADVANCE_DAYS) : 14;

  try {
    const slots = await getOpenSlots({ from, days, excludeBookingId });
    return NextResponse.json({ slots });
  } catch (err) {
    console.error("Availability lookup error:", err);
    return NextResponse.json({ error: "Could not load availability" }, { status: 500 });
  }
}
