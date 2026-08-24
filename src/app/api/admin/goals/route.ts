import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/currentAdmin";
import { setDashboardGoal, GOAL_FIELDS, type GoalField } from "@/lib/dashboardGoals";

export async function PATCH(req: NextRequest) {
  const admin = await getCurrentAdmin();
  // Same tier as managing admin users — a sales target is a management
  // decision, not day-to-day triage viewers should be able to change.
  if (!admin || admin.role !== "owner") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { field, value } = await req.json();
  if (!GOAL_FIELDS.includes(field)) {
    return NextResponse.json({ error: "Invalid goal field" }, { status: 400 });
  }
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
    return NextResponse.json({ error: "Goal must be a whole number, 0 or more" }, { status: 400 });
  }

  const result = await setDashboardGoal(field as GoalField, value);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ ok: true });
}
