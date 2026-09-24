import { getCurrentAdmin } from "@/lib/currentAdmin";
import { Topbar } from "@/components/admin/Topbar";
import { AnalyticsDashboard } from "./AnalyticsDashboard";

export default async function AnalyticsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) return null;

  return (
    <div>
      <Topbar admin={admin} title="Website analytics" />
      <div className="p-5 sm:p-8">
        <AnalyticsDashboard />
      </div>
    </div>
  );
}
