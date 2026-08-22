"use client";

import { useState } from "react";
import Turnstile from "@/components/Turnstile";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      company: form.get("company"),
      message: form.get("message"),
      turnstileToken: form.get("cf-turnstile-response"),
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
        Thanks — we got it and will follow up shortly.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-2xl border border-line bg-paper p-7 shadow-[0_2px_10px_rgba(15,23,42,0.03)]"
    >
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
        placeholder="Email"
        className="rounded-lg border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-accent focus:outline-none"
      />
      <input
        name="company"
        placeholder="Company name"
        className="rounded-lg border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-accent focus:outline-none"
      />
      <textarea
        name="message"
        required
        rows={4}
        placeholder="What are you looking to solve?"
        className="rounded-lg border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-accent focus:outline-none"
      />
      <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-500">Something went wrong — try again or email us directly.</p>
      )}
    </form>
  );
}
