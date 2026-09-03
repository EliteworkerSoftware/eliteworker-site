"use client";

import { useState } from "react";
import { startRegistration } from "@simplewebauthn/browser";
import { Fingerprint, Trash2 } from "lucide-react";

export type Passkey = { id: string; device_name: string | null; device_type: string | null; created_at: string; last_used_at: string | null };

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", { dateStyle: "medium" });
}

async function parseJsonSafe(res: Response): Promise<{ error?: string; [key: string]: unknown }> {
  try {
    return await res.json();
  } catch {
    return { error: `Unexpected response from server (${res.status})` };
  }
}

export default function AdminPasskeySettings({ initialPasskeys }: { initialPasskeys: Passkey[] }) {
  const [passkeys, setPasskeys] = useState(initialPasskeys);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function addPasskey() {
    setBusy(true);
    setError("");
    try {
      const optionsRes = await fetch("/api/admin/passkeys/register-options", { method: "POST" });
      const optionsJSON = await parseJsonSafe(optionsRes);
      if (!optionsRes.ok) throw new Error((optionsJSON as { error?: string }).error || "Failed to start setup");

      // This is what actually triggers the Face ID / Touch ID / Windows
      // Hello fingerprint prompt — the browser handles it natively.
      const attestation = await startRegistration({ optionsJSON: optionsJSON as never });

      const deviceName = window.prompt("Name this passkey (e.g. \"MacBook\" or \"iPhone\")", "") || undefined;
      const verifyRes = await fetch("/api/admin/passkeys/register-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: attestation, deviceName }),
      });
      const verifyData = await parseJsonSafe(verifyRes);
      if (!verifyRes.ok) throw new Error(verifyData.error || "Failed to save passkey");

      const listRes = await fetch("/api/admin/passkeys");
      if (listRes.ok) setPasskeys((await listRes.json()).passkeys);
    } catch (err) {
      // A cancelled/dismissed biometric prompt throws too — don't show that as a scary error.
      if (err instanceof Error && err.name === "NotAllowedError") return;
      setError(err instanceof Error ? err.message : "Failed to add passkey");
    } finally {
      setBusy(false);
    }
  }

  async function removePasskey(id: string) {
    if (!confirm("Remove this passkey? You'll need another way to sign in if it's your only one.")) return;
    setError("");
    try {
      const res = await fetch(`/api/admin/passkeys/${id}`, { method: "DELETE" });
      const data = await parseJsonSafe(res);
      if (!res.ok) throw new Error(data.error || "Failed to remove passkey");
      setPasskeys((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove passkey");
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 text-ink/70">
        <Fingerprint size={19} />
        <p className="font-semibold text-ink">Passkeys</p>
      </div>
      <p className="mt-1.5 text-sm text-ink/60">
        Sign in with Face ID, Touch ID, or Windows Hello instead of a password — add one for each device you use.
      </p>

      {passkeys.length > 0 && (
        <div className="mt-4 divide-y divide-line">
          {passkeys.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-3 py-2.5">
              <div>
                <p className="text-sm font-medium text-ink">{p.device_name || "Unnamed passkey"}</p>
                <p className="text-xs text-ink/45">
                  Added {formatDate(p.created_at)}
                  {p.last_used_at ? ` · Last used ${formatDate(p.last_used_at)}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removePasskey(p.id)}
                className="rounded-md p-1.5 text-ink/30 hover:bg-red-50 hover:text-red-500"
                aria-label="Remove passkey"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        disabled={busy}
        onClick={addPasskey}
        className="mt-4 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:brightness-105 disabled:opacity-60"
      >
        {busy ? "Waiting for your device…" : "Add a passkey"}
      </button>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
