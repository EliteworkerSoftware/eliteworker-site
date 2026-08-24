"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { startAuthentication, browserSupportsWebAuthn } from "@simplewebauthn/browser";
import { Fingerprint } from "lucide-react";

async function parseJsonSafe(res: Response): Promise<{ error?: string; [key: string]: unknown }> {
  try {
    return await res.json();
  } catch {
    return { error: `Unexpected response from server (${res.status})` };
  }
}

const noSubscription = () => () => {};

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [needs2fa, setNeeds2fa] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");
  const [passkeyBusy, setPasskeyBusy] = useState(false);

  // browserSupportsWebAuthn() reads a browser API unavailable during SSR —
  // useSyncExternalStore is the correct way to read a value like this that
  // can't be known until the client mounts, without a setState-in-effect
  // hydration mismatch.
  const passkeySupported = useSyncExternalStore(noSubscription, browserSupportsWebAuthn, () => false);

  async function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await parseJsonSafe(res)) as { error?: string; requires2fa?: boolean };
      if (!res.ok) throw new Error(data.error || "Failed to sign in");

      if (data.requires2fa) {
        setNeeds2fa(true);
        setStatus("idle");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
      setStatus("error");
    }
  }

  async function handleCodeSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/admin/login/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await parseJsonSafe(res);
      if (!res.ok) throw new Error(data.error || "Invalid code");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code");
      setStatus("error");
    }
  }

  async function handlePasskeyLogin() {
    setPasskeyBusy(true);
    setError("");
    try {
      const optionsRes = await fetch("/api/admin/passkeys/login-options", { method: "POST" });
      const optionsJSON = await parseJsonSafe(optionsRes);
      if (!optionsRes.ok) throw new Error((optionsJSON as { error?: string }).error || "Failed to start passkey sign-in");

      // Triggers the native Face ID / Touch ID / Windows Hello prompt.
      const assertion = await startAuthentication({ optionsJSON: optionsJSON as never });

      const verifyRes = await fetch("/api/admin/passkeys/login-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assertion),
      });
      const verifyData = await parseJsonSafe(verifyRes);
      if (!verifyRes.ok) throw new Error(verifyData.error || "Passkey sign-in failed");

      router.push("/admin");
      router.refresh();
    } catch (err) {
      if (err instanceof Error && err.name === "NotAllowedError") return;
      setError(err instanceof Error ? err.message : "Passkey sign-in failed");
      setStatus("error");
    } finally {
      setPasskeyBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-admin-nav px-6">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-admin-nav-line bg-paper shadow-[0_20px_60px_rgba(30,64,175,0.35)]">
        <div className="bg-admin-nav px-8 py-7 text-center">
          <Image
            src="/Eliteworker%20Header%20Logo%20White.svg"
            alt="EliteWorker"
            width={660}
            height={101}
            className="mx-auto h-6 w-auto"
            priority
          />
        </div>
        <div className="flex">
          <span className="h-1 flex-1 bg-brand-dark" />
          <span className="h-1 flex-1 bg-brand" />
          <span className="h-1 flex-1 bg-accent" />
        </div>

        {!needs2fa ? (
          <div className="p-8">
            <h1 className="text-lg font-semibold text-ink">Admin login</h1>
            <p className="mt-1 text-sm text-ink/60">Sign in to manage leads, applications, and bookings.</p>

            {passkeySupported && (
              <>
                <button
                  type="button"
                  disabled={passkeyBusy}
                  onClick={handlePasskeyLogin}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-ink/25 disabled:opacity-60"
                >
                  <Fingerprint size={16} />
                  {passkeyBusy ? "Waiting for your device…" : "Sign in with a passkey"}
                </button>
                <div className="mt-5 flex items-center gap-3">
                  <span className="h-px flex-1 bg-line" />
                  <span className="text-xs text-ink/35">or</span>
                  <span className="h-px flex-1 bg-line" />
                </div>
              </>
            )}

            <form onSubmit={handlePasswordSubmit} className={passkeySupported ? "mt-4" : "mt-5"}>
              <input
                type="email"
                required
                autoFocus={!passkeySupported}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full rounded-lg border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-accent focus:outline-none"
              />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="mt-3 w-full rounded-lg border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-accent focus:outline-none"
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-4 w-full rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 disabled:opacity-60"
              >
                {status === "sending" ? "Signing in…" : "Sign in"}
              </button>
              {status === "error" && <p className="mt-3 text-sm text-red-500">{error}</p>}
            </form>
          </div>
        ) : (
          <form onSubmit={handleCodeSubmit} className="p-8">
            <h1 className="text-lg font-semibold text-ink">Enter your code</h1>
            <p className="mt-1 text-sm text-ink/60">Open your authenticator app and enter the current 6-digit code.</p>
            <input
              type="text"
              inputMode="numeric"
              required
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="000000"
              className="mt-5 w-full rounded-lg border border-line bg-paper px-4 py-3 text-center font-mono text-lg tracking-widest text-ink placeholder:text-ink/35 focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === "sending" || code.length !== 6}
              className="mt-4 w-full rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 disabled:opacity-60"
            >
              {status === "sending" ? "Verifying…" : "Verify"}
            </button>
            {status === "error" && <p className="mt-3 text-sm text-red-500">{error}</p>}
            <button
              type="button"
              onClick={() => {
                setNeeds2fa(false);
                setCode("");
                setError("");
                setStatus("idle");
              }}
              className="mt-3 w-full text-center text-xs font-medium text-ink/40 hover:text-ink"
            >
              Back to sign in
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
