import { getCurrentAdmin } from "@/lib/currentAdmin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { Topbar } from "@/components/admin/Topbar";
import AdminTwoFactorSettings from "@/components/AdminTwoFactorSettings";
import AdminPasskeySettings, { type Passkey } from "@/components/AdminPasskeySettings";

export default async function SecurityPage() {
  const admin = await getCurrentAdmin();
  if (!admin) return null;

  // Queried separately from getCurrentAdmin so a missing column/table
  // (before a migration runs) can never break the auth-gating query every
  // admin page depends on — this page just falls back to "off"/empty instead.
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from("eliteworker_admin_users").select("totp_enabled").eq("id", admin.id).maybeSingle();
  const totpEnabled = data?.totp_enabled === true;

  const { data: passkeys } = await supabase
    .from("eliteworker_admin_passkeys")
    .select("id, device_name, device_type, created_at, last_used_at")
    .eq("admin_id", admin.id)
    .order("created_at", { ascending: true });

  return (
    <div>
      <Topbar admin={admin} title="Security" />
      <div className="max-w-xl space-y-4 p-5 sm:p-8">
        <AdminPasskeySettings initialPasskeys={(passkeys as Passkey[]) || []} />
        <AdminTwoFactorSettings initialEnabled={totpEnabled} />
      </div>
    </div>
  );
}
