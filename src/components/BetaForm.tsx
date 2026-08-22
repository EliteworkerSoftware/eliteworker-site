"use client";

import { useState } from "react";
import Turnstile from "@/components/Turnstile";

const fieldClass =
  "rounded-lg border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-accent focus:outline-none";
const buttonClass =
  "rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 disabled:opacity-60";

type Stage = "email" | "code" | "form" | "sent";

export default function BetaForm() {
  const [stage, setStage] = useState<Stage>("email");
  const [email, setEmail] = useState("");
  const [challengeToken, setChallengeToken] = useState("");
  const [code, setCode] = useState("");
  const [verifiedToken, setVerifiedToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleRequestCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/beta/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, turnstileToken: form.get("cf-turnstile-response") }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setChallengeToken(data.token);
      setStage("code");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function handleVerifyCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/beta/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: challengeToken, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setVerifiedToken(data.verifiedToken);
      setStage("form");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = {
      companyName: form.get("companyName"),
      contactName: form.get("contactName"),
      contactEmail: email,
      phone: form.get("phone"),
      address: form.get("address"),
      employees: form.get("employees"),
      annualRevenue: form.get("annualRevenue"),
      brands: form.get("brands"),
      notes: form.get("notes"),
      verifiedToken,
    };
    try {
      const res = await fetch("/api/beta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("failed");
      setStage("sent");
    } catch {
      setError("Something went wrong — try again or email us directly.");
    } finally {
      setBusy(false);
    }
  }

  if (stage === "sent") {
    return (
      <p className="rounded-2xl border border-brand-light/40 bg-brand/6 p-6 text-sm text-ink">
        You&rsquo;re on the list — we&rsquo;ll follow up within 48 hours. Check your inbox for a confirmation email.
      </p>
    );
  }

  if (stage === "email") {
    return (
      <form
        onSubmit={handleRequestCode}
        className="grid gap-4 rounded-2xl border border-line bg-paper p-7 shadow-[0_2px_10px_rgba(15,23,42,0.03)]"
      >
        <p className="text-sm text-ink/60">
          Enter your work email and we&rsquo;ll send you a verification code to get started.
        </p>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Work email"
          className={fieldClass}
        />
        <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />
        <button type="submit" disabled={busy} className={buttonClass}>
          {busy ? "Sending…" : "Send verification code"}
        </button>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </form>
    );
  }

  if (stage === "code") {
    return (
      <form
        onSubmit={handleVerifyCode}
        className="grid gap-4 rounded-2xl border border-line bg-paper p-7 shadow-[0_2px_10px_rgba(15,23,42,0.03)]"
      >
        <p className="text-sm text-ink/60">
          We sent a 6-digit code to <span className="font-medium text-ink">{email}</span>. Enter it below to
          continue.
        </p>
        <input
          required
          inputMode="numeric"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Verification code"
          className={fieldClass}
        />
        <button type="submit" disabled={busy} className={buttonClass}>
          {busy ? "Verifying…" : "Verify"}
        </button>
        <button
          type="button"
          onClick={() => {
            setStage("email");
            setCode("");
            setError("");
          }}
          className="text-xs font-medium text-ink/50 underline underline-offset-2 hover:text-ink"
        >
          Use a different email
        </button>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-2xl border border-line bg-paper p-7 shadow-[0_2px_10px_rgba(15,23,42,0.03)]"
    >
      <p className="text-xs font-medium text-brand">Email verified — {email}</p>

      <input name="companyName" required placeholder="Company name" className={fieldClass} />

      <div className="grid gap-4 sm:grid-cols-2">
        <input name="contactName" required placeholder="Company contact" className={fieldClass} />
        <input name="phone" type="tel" required placeholder="Phone number" className={fieldClass} />
      </div>

      <input name="address" required placeholder="Company address" className={fieldClass} />

      <div className="grid gap-4 sm:grid-cols-2">
        <select name="employees" required defaultValue="" className={fieldClass}>
          <option value="" disabled>
            How many employees?
          </option>
          <option value="1-5">1–5</option>
          <option value="6-20">6–20</option>
          <option value="21-50">21–50</option>
          <option value="51-100">51–100</option>
          <option value="100+">100+</option>
        </select>
        <select name="annualRevenue" required defaultValue="" className={fieldClass}>
          <option value="" disabled>
            Annual revenue
          </option>
          <option value="Under $500K">Under $500K</option>
          <option value="$500K-$1M">$500K–$1M</option>
          <option value="$1M-$5M">$1M–$5M</option>
          <option value="$5M-$20M">$5M–$20M</option>
          <option value="$20M+">$20M+</option>
        </select>
      </div>

      <textarea
        name="brands"
        required
        rows={2}
        placeholder="What brands do you currently carry? (list at least 5, any category)"
        className={fieldClass}
      />

      <textarea
        name="notes"
        required
        rows={3}
        placeholder="Anything else we should know?"
        className={fieldClass}
      />

      <button type="submit" disabled={busy} className={buttonClass}>
        {busy ? "Sending…" : "Submit"}
      </button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </form>
  );
}
