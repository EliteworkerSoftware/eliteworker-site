import { Inbox, ClipboardList, CalendarCheck } from "lucide-react";
import { getCurrentAdmin } from "@/lib/currentAdmin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { Topbar } from "@/components/admin/Topbar";
import { StatCard } from "@/components/admin/StatCard";

async function countRows(table: string, unreadOnly = false) {
  const supabase = getSupabaseAdmin();
  let query = supabase.from(table).select("id", { count: "exact", head: true });
  if (unreadOnly) query = query.eq("is_read", false);
  const { count } = await query;
  return count ?? 0;
}

export default async function OverviewPage() {
  const admin = await getCurrentAdmin();
  if (!admin) return null;

  const [leadsTotal, leadsUnread, betaTotal, betaUnread, bookingsTotal, bookingsUnread] = await Promise.all([
    countRows("eliteworker_leads"),
    countRows("eliteworker_leads", true),
    countRows("eliteworker_beta_signups"),
    countRows("eliteworker_beta_signups", true),
    countRows("eliteworker_demo_bookings"),
    countRows("eliteworker_demo_bookings", true),
  ]);

  return (
    <div>
      <Topbar admin={admin} title="Overview" />
      <div className="p-5 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
  );
}
