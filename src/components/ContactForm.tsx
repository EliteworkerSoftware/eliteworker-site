"use client";

import { useState } from "react";

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
      <p className="rounded-md border border-live-cyan/40 bg-live-cyan/10 p-4 text-sm text-paper">
        Thanks — we got it and will follow up shortly.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <input
        name="name"
        required
        placeholder="Your name"
        className="rounded-md border border-wire-line bg-graphite px-4 py-3 text-sm text-paper placeholder:text-paper/40 focus:border-signal-amber focus:outline-none"
      />
      <input
        name="email"
        type="email"
        required
        placeholder="Work email"
        className="rounded-md border border-wire-line bg-graphite px-4 py-3 text-sm text-paper placeholder:text-paper/40 focus:border-signal-amber focus:outline-none"
      />
      <input
        name="company"
        placeholder="Company name"
        className="rounded-md border border-wire-line bg-graphite px-4 py-3 text-sm text-paper placeholder:text-paper/40 focus:border-signal-amber focus:outline-none"
      />
      <textarea
        name="message"
        required
        rows={4}
        placeholder="What are you looking to solve?"
        className="rounded-md border border-wire-line bg-graphite px-4 py-3 text-sm text-paper placeholder:text-paper/40 focus:border-signal-amber focus:outline-none"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-md bg-signal-amber px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-400">Something went wrong — try again or email us directly.</p>
      )}
    </form>
  );
}
