"use client";

import { useState } from "react";
import { RotateCw } from "lucide-react";

type AdminRow = { id: string; email: string; full_name: string | null; role: "owner" | "viewer"; created_at: string };

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", { dateStyle: "medium" });
}

// A failed request doesn't always come back as JSON (a dev-server compile
// error or a proxy timeout returns HTML/plain text) — parse defensively so
// that case surfaces as a normal error message instead of a raw parse crash.
async function parseJsonSafe(res: Response): Promise<{ error?: string; [key: string]: unknown }> {
  try {
    return await res.json();
  } catch {
    return { error: `Unexpected response from server (${res.status})` };
  }
}

export default function AdminUsersManager({
  initialUsers,
  currentUserId,
}: {
  initialUsers: AdminRow[];
  currentUserId: string;
}) {
  const [users, setUsers] = useState(initialUsers);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"owner" | "viewer">("viewer");
  const [busy, setBusy] = useState(false);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [revealed, setRevealed] = useState<{ label: string; password: string; emailSent: boolean } | null>(null);

  async function refresh() {
    const res = await fetch("/api/admin/users");
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users);
    }
  }

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, fullName, role }),
      });
      const data = await parseJsonSafe(res);
      if (!res.ok) throw new Error(data.error || "Failed to add admin");
      setRevealed({ label: email, password: data.tempPassword as string, emailSent: data.emailSent as boolean });
      setEmail("");
      setFullName("");
      setRole("viewer");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add admin");
    } finally {
      setBusy(false);
    }
  }

  async function handleResend(user: AdminRow) {
    setResendingId(user.id);
    setError("");
    try {
      const res = await fetch(`/api/admin/users/${user.id}/resend`, { method: "POST" });
      const data = await parseJsonSafe(res);
      if (!res.ok) throw new Error(data.error || "Failed to resend invite");
      setRevealed({ label: user.email, password: data.tempPassword as string, emailSent: data.emailSent as boolean });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend invite");
    } finally {
      setResendingId(null);
    }
  }

  async function handleRemove(id: string) {
    if (!confirm("Remove this admin's access?")) return;
    setError("");
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      const data = await parseJsonSafe(res);
      if (!res.ok) throw new Error(data.error || "Failed to remove admin");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove admin");
    }
  }

  return (
    <div>
      {revealed && (
        <div className="mb-5 rounded-2xl border border-brand-light/40 bg-brand/6 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-ink">
                Temp password for {revealed.label}
                {!revealed.emailSent && <span className="ml-2 text-xs font-normal text-red-500">(invite email failed to send)</span>}
              </p>
              <p className="mt-1.5 rounded-lg bg-paper px-3 py-2 font-mono text-sm text-ink">{revealed.password}</p>
              <p className="mt-2 text-xs text-ink/50">Copy it now — this won&rsquo;t be shown again.</p>
            </div>
            <button
              type="button"
              onClick={() => setRevealed(null)}
              className="text-xs font-medium text-ink/40 hover:text-ink"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-line bg-paper">
        <table className="w-full min-w-125 text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs font-semibold uppercase tracking-wide text-ink/50">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Added</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-medium text-ink">
                  {u.full_name || "—"}
                  {u.id === currentUserId && <span className="ml-2 text-xs text-ink/40">(you)</span>}
                </td>
                <td className="px-4 py-3 text-ink/80">{u.email}</td>
                <td className="px-4 py-3 text-ink/80 capitalize">{u.role}</td>
                <td className="px-4 py-3 text-ink/60">{formatDate(u.created_at)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      disabled={resendingId === u.id}
                      onClick={() => handleResend(u)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-dark disabled:opacity-50"
                    >
                      <RotateCw size={12} className={resendingId === u.id ? "animate-spin" : ""} />
                      Resend
                    </button>
                    {u.id !== currentUserId && (
                      <button
                        type="button"
                        onClick={() => handleRemove(u.id)}
                        className="text-xs font-semibold text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form
        onSubmit={handleAdd}
        className="mt-4 flex flex-wrap items-end gap-3 rounded-2xl border border-line bg-paper p-5"
      >
        <div className="flex-1 min-w-45">
          <label className="text-xs font-medium text-ink/60">Full name</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
          />
        </div>
        <div className="flex-1 min-w-45">
          <label className="text-xs font-medium text-ink/60">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-ink/60">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "owner" | "viewer")}
            className="mt-1 rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
          >
            <option value="viewer">Viewer</option>
            <option value="owner">Owner</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white transition hover:brightness-105 disabled:opacity-60"
        >
          {busy ? "Adding…" : "Add admin"}
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      <p className="mt-2 text-xs text-ink/40">
        Owners can view submissions and manage other admins. Viewers can view and triage submissions but can&rsquo;t
        delete entries or manage admins. A temp password is emailed on add — use Resend if it needs to go out again.
      </p>
    </div>
  );
}
