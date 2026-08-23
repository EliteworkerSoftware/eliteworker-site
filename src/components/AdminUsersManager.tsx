"use client";

import { useState } from "react";

type AdminRow = { id: string; email: string; role: "owner" | "viewer"; created_at: string };

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
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"owner" | "viewer">("viewer");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

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
        body: JSON.stringify({ email, password, role }),
      });
      const data = await parseJsonSafe(res);
      if (!res.ok) throw new Error(data.error || "Failed to add admin");
      setEmail("");
      setPassword("");
      setRole("viewer");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add admin");
    } finally {
      setBusy(false);
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
    <section className="mt-12">
      <h2 className="text-lg font-semibold text-ink">Admin users</h2>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-paper">
        <table className="w-full min-w-[500px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs font-semibold uppercase tracking-wide text-ink/50">
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
                  {u.email}
                  {u.id === currentUserId && <span className="ml-2 text-xs text-ink/40">(you)</span>}
                </td>
                <td className="px-4 py-3 text-ink/80 capitalize">{u.role}</td>
                <td className="px-4 py-3 text-ink/60">{formatDate(u.created_at)}</td>
                <td className="px-4 py-3 text-right">
                  {u.id !== currentUserId && (
                    <button
                      type="button"
                      onClick={() => handleRemove(u.id)}
                      className="text-xs font-semibold text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  )}
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
        <div className="flex-1 min-w-[180px]">
          <label className="text-xs font-medium text-ink/60">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
          />
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="text-xs font-medium text-ink/60">Temporary password</label>
          <input
            type="text"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
        Owners can view submissions and manage other admins. Viewers can only view submissions.
      </p>
    </section>
  );
}
