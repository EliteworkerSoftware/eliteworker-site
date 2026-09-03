"use client";

import { useState } from "react";
import { RotateCw, Pencil, Check, X } from "lucide-react";

type AdminRow = {
  id: string;
  email: string;
  full_name: string | null;
  role: "owner" | "viewer";
  created_at: string;
  last_login_at: string | null;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", { dateStyle: "medium" });
}

// Best-effort split for pre-filling the edit form from a stored "First Last"
// string — first token is the first name, everything else is the last name.
function splitName(fullName: string | null): { first: string; last: string } {
  const parts = (fullName || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: "", last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"owner" | "viewer">("viewer");
  const [busy, setBusy] = useState(false);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [revealed, setRevealed] = useState<{ label: string; password: string; emailSent: boolean } | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFirst, setEditFirst] = useState("");
  const [editLast, setEditLast] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

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
        body: JSON.stringify({ email, fullName: `${firstName} ${lastName}`.trim(), role }),
      });
      const data = await parseJsonSafe(res);
      if (!res.ok) throw new Error(data.error || "Failed to add admin");
      setRevealed({ label: email, password: data.tempPassword as string, emailSent: data.emailSent as boolean });
      setEmail("");
      setFirstName("");
      setLastName("");
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

  function startEdit(user: AdminRow) {
    const { first, last } = splitName(user.full_name);
    setEditingId(user.id);
    setEditFirst(first);
    setEditLast(last);
    setError("");
  }

  async function saveEdit(id: string) {
    setSavingEdit(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: `${editFirst} ${editLast}`.trim() }),
      });
      const data = await parseJsonSafe(res);
      if (!res.ok) throw new Error(data.error || "Failed to update name");
      setEditingId(null);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update name");
    } finally {
      setSavingEdit(false);
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

      {/* Mobile/tablet: one stacked row per admin instead of a wide table. */}
      <div className="divide-y divide-line md:hidden">
        {users.map((u) => (
          <div key={u.id} className="py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                {editingId === u.id ? (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <input
                      autoFocus
                      value={editFirst}
                      onChange={(e) => setEditFirst(e.target.value)}
                      placeholder="First"
                      className="w-20 rounded-md border border-line bg-paper px-2 py-1 text-sm text-ink focus:border-accent focus:outline-none"
                    />
                    <input
                      value={editLast}
                      onChange={(e) => setEditLast(e.target.value)}
                      placeholder="Last"
                      className="w-20 rounded-md border border-line bg-paper px-2 py-1 text-sm text-ink focus:border-accent focus:outline-none"
                    />
                    <button
                      type="button"
                      disabled={savingEdit}
                      onClick={() => saveEdit(u.id)}
                      className="rounded-md p-1 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50"
                      aria-label="Save name"
                    >
                      <Check size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="rounded-md p-1 text-ink/40 hover:bg-paper-alt hover:text-ink"
                      aria-label="Cancel"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-ink">{u.full_name || "—"}</span>
                    {u.id === currentUserId && <span className="text-xs text-ink/40">(you)</span>}
                    <button
                      type="button"
                      onClick={() => startEdit(u)}
                      className="rounded-md p-1 text-ink/30 hover:bg-paper-alt hover:text-ink/70"
                      aria-label="Edit name"
                    >
                      <Pencil size={13} />
                    </button>
                  </div>
                )}
                <p className="mt-0.5 truncate text-sm text-ink/70">{u.email}</p>
              </div>
              <span className="shrink-0 rounded-full bg-paper-alt px-2 py-1 text-xs font-medium text-ink/70 capitalize">{u.role}</span>
            </div>
            <p className="mt-2 text-xs text-ink/40">Added {formatDate(u.created_at)}</p>
            <div className="mt-3 flex items-center gap-4 border-t border-line pt-3">
              {!u.last_login_at && (
                <button
                  type="button"
                  disabled={resendingId === u.id}
                  onClick={() => handleResend(u)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-dark disabled:opacity-50"
                >
                  <RotateCw size={12} className={resendingId === u.id ? "animate-spin" : ""} />
                  Resend
                </button>
              )}
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
          </div>
        ))}
      </div>

      {/* Desktop: the full table. */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-140 text-left text-sm">
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
                  {editingId === u.id ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        autoFocus
                        value={editFirst}
                        onChange={(e) => setEditFirst(e.target.value)}
                        placeholder="First"
                        className="w-20 rounded-md border border-line bg-paper px-2 py-1 text-sm text-ink focus:border-accent focus:outline-none"
                      />
                      <input
                        value={editLast}
                        onChange={(e) => setEditLast(e.target.value)}
                        placeholder="Last"
                        className="w-20 rounded-md border border-line bg-paper px-2 py-1 text-sm text-ink focus:border-accent focus:outline-none"
                      />
                      <button
                        type="button"
                        disabled={savingEdit}
                        onClick={() => saveEdit(u.id)}
                        className="rounded-md p-1 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50"
                        aria-label="Save name"
                      >
                        <Check size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="rounded-md p-1 text-ink/40 hover:bg-paper-alt hover:text-ink"
                        aria-label="Cancel"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span>{u.full_name || "—"}</span>
                      {u.id === currentUserId && <span className="text-xs text-ink/40">(you)</span>}
                      <button
                        type="button"
                        onClick={() => startEdit(u)}
                        className="rounded-md p-1 text-ink/30 hover:bg-paper-alt hover:text-ink/70"
                        aria-label="Edit name"
                      >
                        <Pencil size={13} />
                      </button>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-ink/80">{u.email}</td>
                <td className="px-4 py-3 text-ink/80 capitalize">{u.role}</td>
                <td className="px-4 py-3 text-ink/60">{formatDate(u.created_at)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    {!u.last_login_at && (
                      <button
                        type="button"
                        disabled={resendingId === u.id}
                        onClick={() => handleResend(u)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-dark disabled:opacity-50"
                      >
                        <RotateCw size={12} className={resendingId === u.id ? "animate-spin" : ""} />
                        Resend
                      </button>
                    )}
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
        className="mt-6 flex flex-wrap items-end gap-3 border-t border-line pt-5"
      >
        <div className="min-w-30">
          <label className="text-xs font-medium text-ink/60">First name</label>
          <input
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
          />
        </div>
        <div className="min-w-30">
          <label className="text-xs font-medium text-ink/60">Last name</label>
          <input
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
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
