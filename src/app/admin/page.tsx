import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/currentAdmin";
import { getSupabaseAdmin } from "@/lib/supabase";
import AdminLogoutButton from "@/components/AdminLogoutButton";
import AdminUsersManager from "@/components/AdminUsersManager";

export const dynamic = "force-dynamic";

type BetaSignup = {
  id: string;
  created_at: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  phone: string;
  address: string;
  employees: string | null;
  annual_revenue: string | null;
  brands: string | null;
  notes: string | null;
};

type Lead = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const supabase = getSupabaseAdmin();
  const queries = [
    supabase.from("eliteworker_beta_signups").select("*").order("created_at", { ascending: false }),
    supabase.from("eliteworker_leads").select("*").order("created_at", { ascending: false }),
  ] as const;

  const [{ data: betaSignups, error: betaError }, { data: leads, error: leadsError }] = await Promise.all(queries);

  let adminUsers: { id: string; email: string; role: "owner" | "viewer"; created_at: string }[] = [];
  if (admin.role === "owner") {
    const { data } = await supabase
      .from("eliteworker_admin_users")
      .select("id, email, role, created_at")
      .order("created_at", { ascending: true });
    adminUsers = data ?? [];
  }

  return (
    <div className="min-h-screen bg-paper-alt">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ink">EliteWorker admin</h1>
            <p className="mt-1 text-sm text-ink/50">
              Signed in as {admin.email} · <span className="capitalize">{admin.role}</span>
            </p>
          </div>
          <AdminLogoutButton />
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-ink">Beta signups {betaSignups ? `(${betaSignups.length})` : ""}</h2>
          {betaError && <p className="mt-2 text-sm text-red-500">Failed to load: {betaError.message}</p>}
          <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-paper">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs font-semibold uppercase tracking-wide text-ink/50">
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">Employees</th>
                  <th className="px-4 py-3">Revenue</th>
                  <th className="px-4 py-3">Brands carried</th>
                  <th className="px-4 py-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                {(betaSignups as BetaSignup[] | null)?.map((row) => (
                  <tr key={row.id} className="border-b border-line last:border-0 align-top">
                    <td className="px-4 py-3 whitespace-nowrap text-ink/60">{formatDate(row.created_at)}</td>
                    <td className="px-4 py-3 font-medium text-ink">{row.company_name}</td>
                    <td className="px-4 py-3 text-ink/80">{row.contact_name}</td>
                    <td className="px-4 py-3 text-ink/80">{row.contact_email}</td>
                    <td className="px-4 py-3 text-ink/80">{row.phone}</td>
                    <td className="px-4 py-3 text-ink/80">{row.address}</td>
                    <td className="px-4 py-3 text-ink/80">{row.employees || "—"}</td>
                    <td className="px-4 py-3 text-ink/80">{row.annual_revenue || "—"}</td>
                    <td className="px-4 py-3 text-ink/60">{row.brands || "—"}</td>
                    <td className="px-4 py-3 text-ink/60">{row.notes || "—"}</td>
                  </tr>
                ))}
                {betaSignups?.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-4 py-6 text-center text-ink/40">
                      No beta signups yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-lg font-semibold text-ink">Contact leads {leads ? `(${leads.length})` : ""}</h2>
          {leadsError && <p className="mt-2 text-sm text-red-500">Failed to load: {leadsError.message}</p>}
          <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-paper">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs font-semibold uppercase tracking-wide text-ink/50">
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Message</th>
                </tr>
              </thead>
              <tbody>
                {(leads as Lead[] | null)?.map((row) => (
                  <tr key={row.id} className="border-b border-line last:border-0 align-top">
                    <td className="px-4 py-3 whitespace-nowrap text-ink/60">{formatDate(row.created_at)}</td>
                    <td className="px-4 py-3 font-medium text-ink">{row.name}</td>
                    <td className="px-4 py-3 text-ink/80">{row.email}</td>
                    <td className="px-4 py-3 text-ink/80">{row.company || "—"}</td>
                    <td className="px-4 py-3 text-ink/60">{row.message}</td>
                  </tr>
                ))}
                {leads?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-ink/40">
                      No contact leads yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {admin.role === "owner" && <AdminUsersManager initialUsers={adminUsers} currentUserId={admin.id} />}
      </div>
    </div>
  );
}
