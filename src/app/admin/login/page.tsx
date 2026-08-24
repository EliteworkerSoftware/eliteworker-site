"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [needs2fa, setNeeds2fa] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");

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
      let data: { error?: string; requires2fa?: boolean } = {};
      try {
        data = await res.json();
      } catch {
        data = { error: `Unexpected response from server (${res.status})` };
      }
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
      let data: { error?: string } = {};
      try {
        data = await res.json();
      } catch {
        data = { error: `Unexpected response from server (${res.status})` };
      }
      if (!res.ok) throw new Error(data.error || "Invalid code");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code");
      setStatus("error");
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
          <form onSubmit={handlePasswordSubmit} className="p-8">
            <h1 className="text-lg font-semibold text-ink">Admin login</h1>
            <p className="mt-1 text-sm text-ink/60">Sign in to manage leads, applications, and bookings.</p>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="mt-5 w-full rounded-lg border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-accent focus:outline-none"
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
