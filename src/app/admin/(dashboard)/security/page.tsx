import { getCurrentAdmin } from "@/lib/currentAdmin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { Topbar } from "@/components/admin/Topbar";
import AdminTwoFactorSettings from "@/components/AdminTwoFactorSettings";

export default async function SecurityPage() {
  const admin = await getCurrentAdmin();
  if (!admin) return null;

  // Queried separately from getCurrentAdmin so a missing column (before the
  // 2FA migration runs) can never break the auth-gating query every admin
  // page depends on — this page just falls back to "2FA off" instead.
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from("eliteworker_admin_users").select("totp_enabled").eq("id", admin.id).maybeSingle();
  const totpEnabled = data?.totp_enabled === true;

  return (
    <div>
      <Topbar admin={admin} title="Security" />
      <div className="max-w-xl space-y-4 p-5 sm:p-8">
        <AdminTwoFactorSettings initialEnabled={totpEnabled} />
      </div>
    </div>
  );
}
