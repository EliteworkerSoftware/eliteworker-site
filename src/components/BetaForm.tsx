"use client";

import { useState } from "react";

export default function BetaForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      company: form.get("company"),
      message: "Requested to join the EliteWorker beta.",
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("sent");
      e.currentTarget.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p className="rounded-2xl border border-brand-light/40 bg-brand/6 p-6 text-sm text-ink">
        You&rsquo;re on the list — we&rsquo;ll follow up with next steps shortly.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl border border-line bg-paper p-7 shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
      <input
        name="name"
        required
        placeholder="Your name"
        className="rounded-lg border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-accent focus:outline-none"
      />
      <input
        name="email"
        type="email"
        required
        placeholder="Work email"
        className="rounded-lg border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-accent focus:outline-none"
      />
      <input
        name="company"
        placeholder="Company name"
        className="rounded-lg border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-accent focus:outline-none"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-ink transition hover:brightness-105 disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Join the Beta"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-500">Something went wrong — try again or email us directly.</p>
      )}
    </form>
  );
}
