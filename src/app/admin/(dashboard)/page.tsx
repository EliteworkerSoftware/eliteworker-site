import { Inbox, ClipboardList, CalendarCheck } from "lucide-react";
import { getCurrentAdmin } from "@/lib/currentAdmin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getDashboardGoals } from "@/lib/dashboardGoals";
import { Topbar } from "@/components/admin/Topbar";
import { StatCard } from "@/components/admin/StatCard";
import { CircleMeter } from "@/components/admin/CircleMeter";
import { UpcomingDemos, type UpcomingDemo } from "@/components/admin/UpcomingDemos";

async function countRows(table: string, unreadOnly = false) {
  const supabase = getSupabaseAdmin();
  let query = supabase.from(table).select("id", { count: "exact", head: true });
  if (unreadOnly) query = query.eq("is_read", false);
  const { count } = await query;
  return count ?? 0;
}

async function countSince(table: string, column: string, sinceIso: string) {
  const supabase = getSupabaseAdmin();
  const { count } = await supabase.from(table).select("id", { count: "exact", head: true }).gte(column, sinceIso);
  return count ?? 0;
}

async function countConvertedSince(sinceIso: string) {
  const supabase = getSupabaseAdmin();
  const { count } = await supabase
    .from("eliteworker_demo_bookings")
    .select("id", { count: "exact", head: true })
    .eq("pipeline_status", "converted")
    .gte("converted_at", sinceIso);
  return count ?? 0;
}

async function getUpcomingDemos(): Promise<UpcomingDemo[]> {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("eliteworker_demo_bookings")
    .select("id, attendee_name, event_title, start_time")
    .gte("start_time", new Date().toISOString())
    .neq("status", "cancelled")
    .order("start_time", { ascending: true })
    .limit(5);
  return (data as UpcomingDemo[]) || [];
}

export default async function OverviewPage() {
  const admin = await getCurrentAdmin();
  if (!admin) return null;

  // Recomputed from the current date on every load — "this month" metrics
  // need no actual reset logic, they just naturally cover a different range
  // once the calendar turns over. Goals are separate: persisted, and only
  // change when someone edits them on a meter.
  const now = new Date();
  const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();

  const [
    leadsTotal,
    leadsUnread,
    betaTotal,
    betaUnread,
    bookingsTotal,
    bookingsUnread,
    upcomingDemos,
    leadsThisMonth,
    bookingsThisMonth,
    closedThisMonth,
    goals,
  ] = await Promise.all([
    countRows("eliteworker_leads"),
    countRows("eliteworker_leads", true),
    countRows("eliteworker_beta_signups"),
    countRows("eliteworker_beta_signups", true),
    countRows("eliteworker_demo_bookings"),
    countRows("eliteworker_demo_bookings", true),
    getUpcomingDemos(),
    countSince("eliteworker_leads", "created_at", startOfMonth),
    countSince("eliteworker_demo_bookings", "created_at", startOfMonth),
    countConvertedSince(startOfMonth),
    getDashboardGoals(),
  ]);

  const canEditGoals = admin.role === "owner";

  return (
    <div>
      <Topbar admin={admin} title="Overview" />
      <div className="space-y-8 p-5 sm:p-8">
        <UpcomingDemos demos={upcomingDemos} />

        <div>
          <h2 className="font-display text-sm font-bold tracking-wide text-ink/50 uppercase">This month</h2>
          <div className="mt-3 grid gap-5 sm:grid-cols-3">
            <CircleMeter
              label="Demo bookings"
              value={bookingsThisMonth}
              goal={goals.demo_bookings_goal}
              goalField="demo_bookings_goal"
              accent="teal"
              canEditGoal={canEditGoals}
            />
            <CircleMeter
              label="Closed sales"
              value={closedThisMonth}
              goal={goals.closed_sales_goal}
              goalField="closed_sales_goal"
              accent="emerald"
              canEditGoal={canEditGoals}
            />
            <CircleMeter
              label="New leads"
              value={leadsThisMonth}
              goal={goals.new_leads_goal}
              goalField="new_leads_goal"
              accent="brand"
              canEditGoal={canEditGoals}
            />
          </div>
        </div>

        <div>
          <h2 className="font-display text-sm font-bold tracking-wide text-ink/50 uppercase">All time</h2>
          <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard href="/admin/leads" label="Contact leads" total={leadsTotal} unread={leadsUnread} icon={Inbox} accent="brand" />
            <StatCard
              href="/admin/beta"
              label="Beta applications"
              total={betaTotal}
              unread={betaUnread}
              icon={ClipboardList}
              accent="accent"
            />
            <StatCard
              href="/admin/bookings"
              label="Demo bookings"
              total={bookingsTotal}
              unread={bookingsUnread}
              icon={CalendarCheck}
              accent="teal"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
