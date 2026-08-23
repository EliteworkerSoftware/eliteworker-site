import { getCurrentAdmin } from "@/lib/currentAdmin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { Topbar } from "@/components/admin/Topbar";
import { DemoBookingsTable, type DemoBooking } from "./DemoBookingsTable";

export default async function BookingsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) return null;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("eliteworker_demo_bookings")
    .select("*")
    .order("start_time", { ascending: false });

  return (
    <div>
      <Topbar admin={admin} title="Demo bookings" />
      <div className="p-5 sm:p-8">
        {error && <p className="mb-4 text-sm text-red-500">Failed to load: {error.message}</p>}
        <DemoBookingsTable initialRows={(data as DemoBooking[]) || []} canDelete={admin.role === "owner"} />
      </div>
    </div>
  );
}
