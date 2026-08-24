"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { startAuthentication, browserSupportsWebAuthn } from "@simplewebauthn/browser";
import { Fingerprint, Eye, EyeOff } from "lucide-react";

async function parseJsonSafe(res: Response): Promise<{ error?: string; [key: string]: unknown }> {
  try {
    return await res.json();
  } catch {
    return { error: `Unexpected response from server (${res.status})` };
  }
}

const noSubscription = () => () => {};

const inputClasses =
  "w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-brand-light focus:outline-none";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="flex min-h-screen bg-ink">
      <div className="hidden flex-1 flex-col justify-center px-16 lg:flex">
        <Image
          src="/Eliteworker%20Header%20Logo%20White.svg"
          alt="EliteWorker"
          width={660}
          height={101}
          className="h-7 w-auto"
          priority
        />
        <h1 className="mt-10 max-w-md text-4xl font-bold leading-tight text-white">
          Built for the team behind <span className="text-brand-light">EliteWorker</span>.
        </h1>
        <p className="mt-4 max-w-sm text-white/50">
          Manage leads, beta applications, and demo bookings from one dashboard.
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <Image
            src="/Eliteworker%20Header%20Logo%20White.svg"
            alt="EliteWorker"
            width={660}
            height={101}
            className="mx-auto mb-10 h-6 w-auto lg:hidden"
            priority
          />

          {!needs2fa ? (
            <>
              <h2 className="text-center text-2xl font-bold text-white lg:text-left">Sign in</h2>
              <p className="mt-1 text-center text-sm text-white/50 lg:text-left">
                Enter your email and password to continue.
              </p>

              {passkeySupported && (
                <>
                  <button
                    type="button"
                    disabled={passkeyBusy}
                    onClick={handlePasskeyLogin}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5 disabled:opacity-60"
                  >
                    <Fingerprint size={16} />
                    {passkeyBusy ? "Waiting for your device…" : "Sign in with a passkey"}
                  </button>
                  <div className="mt-5 flex items-center gap-3">
                    <span className="h-px flex-1 bg-white/10" />
                    <span className="text-xs text-white/35">or</span>
                    <span className="h-px flex-1 bg-white/10" />
                  </div>
                </>
              )}

              <form onSubmit={handlePasswordSubmit} className={passkeySupported ? "mt-5" : "mt-6"}>
                <label className="text-sm text-white/70">Email address</label>
                <input
                  type="email"
                  required
                  autoFocus={!passkeySupported}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`mt-1.5 ${inputClasses}`}
                />
                <label className="mt-4 block text-sm text-white/70">Password</label>
                <div className="relative mt-1.5">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={`${inputClasses} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 flex items-center px-3.5 text-white/40 hover:text-white/70"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="mt-5 w-full rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:brightness-105 disabled:opacity-60"
                >
                  {status === "sending" ? "Signing in…" : "Sign in"}
                </button>
                {status === "error" && <p className="mt-3 text-sm text-red-400">{error}</p>}
              </form>
            </>
          ) : (
            <form onSubmit={handleCodeSubmit}>
              <h2 className="text-center text-2xl font-bold text-white lg:text-left">Enter your code</h2>
              <p className="mt-1 text-center text-sm text-white/50 lg:text-left">
                Open your authenticator app and enter the current 6-digit code.
              </p>
              <input
                type="text"
                inputMode="numeric"
                required
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="000000"
                className={`mt-6 text-center font-mono text-lg tracking-widest ${inputClasses}`}
              />
              <button
                type="submit"
                disabled={status === "sending" || code.length !== 6}
                className="mt-4 w-full rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:brightness-105 disabled:opacity-60"
              >
                {status === "sending" ? "Verifying…" : "Verify"}
              </button>
              {status === "error" && <p className="mt-3 text-sm text-red-400">{error}</p>}
              <button
                type="button"
                onClick={() => {
                  setNeeds2fa(false);
                  setCode("");
                  setError("");
                  setStatus("idle");
                }}
                className="mt-3 w-full text-center text-xs font-medium text-white/40 hover:text-white/70"
              >
                Back to sign in
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
