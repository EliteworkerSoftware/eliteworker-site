"use client";

import { useState } from "react";
import { ShieldCheck, ShieldOff } from "lucide-react";

async function parseJsonSafe(res: Response): Promise<{ error?: string; [key: string]: unknown }> {
  try {
    return await res.json();
  } catch {
    return { error: `Unexpected response from server (${res.status})` };
  }
}

export default function AdminTwoFactorSettings({ initialEnabled }: { initialEnabled: boolean }) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [setupData, setSetupData] = useState<{ qrDataUrl: string; secret: string } | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [disabling, setDisabling] = useState(false);
  const [password, setPassword] = useState("");

  async function startSetup() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/2fa/setup", { method: "POST" });
      const data = await parseJsonSafe(res);
      if (!res.ok) throw new Error(data.error || "Failed to start setup");
      setSetupData({ qrDataUrl: data.qrDataUrl as string, secret: data.secret as string });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start setup");
    } finally {
      setBusy(false);
    }
  }

  async function confirmSetup() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/2fa/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await parseJsonSafe(res);
      if (!res.ok) throw new Error(data.error || "Invalid code");
      setEnabled(true);
      setSetupData(null);
      setCode("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setBusy(false);
    }
  }

  async function disable() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/2fa/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await parseJsonSafe(res);
      if (!res.ok) throw new Error(data.error || "Failed to disable 2FA");
      setEnabled(false);
      setDisabling(false);
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to disable 2FA");
    } finally {
      setBusy(false);
    }
  }

  if (enabled) {
    return (
      <div>
        <div className="flex items-center gap-2 text-emerald-700">
          <ShieldCheck size={19} />
          <p className="font-semibold">Two-factor authentication is on</p>
        </div>
        <p className="mt-1.5 text-sm text-ink/60">You&rsquo;ll be asked for a 6-digit code from your authenticator app every time you sign in.</p>

        {!disabling ? (
          <button
            type="button"
            onClick={() => setDisabling(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:border-red-300 hover:bg-red-50"
          >
            <ShieldOff size={13} />
            Turn off 2FA
          </button>
        ) : (
          <div className="mt-4 max-w-xs">
            <label className="text-xs font-medium text-ink/60">Confirm your password to turn off 2FA</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
            />
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                disabled={busy || !password}
                onClick={disable}
                className="rounded-full bg-red-500 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
              >
                {busy ? "Turning off…" : "Confirm turn off"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setDisabling(false);
                  setPassword("");
                  setError("");
                }}
                className="rounded-full border border-line px-4 py-1.5 text-xs font-semibold text-ink/60 hover:text-ink"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 text-ink/70">
        <ShieldOff size={19} />
        <p className="font-semibold text-ink">Two-factor authentication is off</p>
      </div>
      <p className="mt-1.5 text-sm text-ink/60">
        Scan a QR code with an authenticator app (Apple Passwords, Google Authenticator, Authy, 1Password) to add a
        second step to sign-in.
      </p>

      {!setupData ? (
        <button
          type="button"
          disabled={busy}
          onClick={startSetup}
          className="mt-4 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:brightness-105 disabled:opacity-60"
        >
          {busy ? "Generating…" : "Set up 2FA"}
        </button>
      ) : (
        <div className="mt-4">
          {/* eslint-disable-next-line @next/next/no-img-element -- a data: URI QR code, not an optimizable remote image */}
          <img src={setupData.qrDataUrl} alt="Scan this QR code with your authenticator app" width={180} height={180} />
          <p className="mt-2 text-xs text-ink/50">
            Can&rsquo;t scan it? Enter this code manually:{" "}
            <span className="font-mono text-ink/70">{setupData.secret}</span>
          </p>
          <div className="mt-3 max-w-40">
            <label className="text-xs font-medium text-ink/60">Enter the 6-digit code</label>
            <input
              type="text"
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoFocus
              placeholder="000000"
              className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-center font-mono text-sm tracking-widest text-ink focus:border-accent focus:outline-none"
            />
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              disabled={busy || code.length !== 6}
              onClick={confirmSetup}
              className="rounded-full bg-brand px-5 py-1.5 text-xs font-semibold text-white transition hover:brightness-105 disabled:opacity-50"
            >
              {busy ? "Confirming…" : "Confirm & enable"}
            </button>
            <button
              type="button"
              onClick={() => {
                setSetupData(null);
                setCode("");
                setError("");
              }}
              className="rounded-full border border-line px-5 py-1.5 text-xs font-semibold text-ink/60 hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
