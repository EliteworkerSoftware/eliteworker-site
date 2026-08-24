"use client";

import { useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import Turnstile from "@/components/Turnstile";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [showSuccess, setShowSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // React nulls out e.currentTarget once the handler returns, so it can't
    // be read after the await below — grab the element itself now, before
    // any async gap, or .reset() throws and gets swallowed by the catch
    // block, silently flipping a successful submission to the error state.
    const formEl = e.currentTarget;
    setStatus("sending");
    const form = new FormData(formEl);
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
      formEl.reset();
      setStatus("idle");
      setShowSuccess(true);
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
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

      {showSuccess && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
          onClick={() => setShowSuccess(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-2xl border-2 border-emerald-500 bg-paper p-8 text-center shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              aria-label="Close"
              className="absolute top-3 right-3 rounded-full p-1 text-ink/35 hover:bg-ink/5 hover:text-ink/60"
            >
              <X size={18} />
            </button>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="text-emerald-500" size={32} />
            </div>
            <h2 className="mt-4 text-lg font-bold text-ink">Successfully sent your message</h2>
            <p className="mt-1.5 text-sm text-ink/60">We will be in touch shortly.</p>
            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              className="mt-6 w-full rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-105"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
