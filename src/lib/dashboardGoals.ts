import { getSupabaseAdmin } from "./supabase";

// A singleton settings row, addressed by a fixed known id — simpler than
// "find the one row" logic, and upsert-by-id means the first read/write
// after the table's created just works without a separate seed step.
const GOALS_ROW_ID = "00000000-0000-0000-0000-000000000001";

export const GOAL_FIELDS = ["demo_bookings_goal", "closed_sales_goal", "new_leads_goal"] as const;
export type GoalField = (typeof GOAL_FIELDS)[number];

export type DashboardGoals = Record<GoalField, number>;

const DEFAULT_GOALS: DashboardGoals = {
  demo_bookings_goal: 10,
  closed_sales_goal: 5,
  new_leads_goal: 20,
};

// Falls back to defaults if the table doesn't exist yet (pre-migration) or
// the row hasn't been created — the Overview page shouldn't break just
// because nobody's set a goal yet.
export async function getDashboardGoals(): Promise<DashboardGoals> {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from("eliteworker_dashboard_goals").select("*").eq("id", GOALS_ROW_ID).maybeSingle();
  if (!data) return DEFAULT_GOALS;
  return {
    demo_bookings_goal: data.demo_bookings_goal ?? DEFAULT_GOALS.demo_bookings_goal,
    closed_sales_goal: data.closed_sales_goal ?? DEFAULT_GOALS.closed_sales_goal,
    new_leads_goal: data.new_leads_goal ?? DEFAULT_GOALS.new_leads_goal,
  };
}

export async function setDashboardGoal(field: GoalField, value: number): Promise<{ error: string } | { error?: undefined }> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("eliteworker_dashboard_goals")
    .upsert({ id: GOALS_ROW_ID, [field]: value, updated_at: new Date().toISOString() }, { onConflict: "id" });
  return error ? { error: error.message } : {};
}
