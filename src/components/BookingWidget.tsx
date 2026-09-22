"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Clock, CheckCircle2 } from "lucide-react";
import Turnstile from "@/components/Turnstile";
import { BUSINESS_TIMEZONE } from "@/lib/bookingConfig";

const fieldClass =
  "rounded-lg border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:border-accent focus:outline-none";
const buttonClass =
  "rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 disabled:opacity-60";

type Slot = { start: string; end: string };
type DaySlots = { date: string; times: Slot[] };
type Stage = "loading" | "pick-slot" | "details" | "confirmed" | "error";

function formatDay(dateStr: string): { weekday: string; day: string } {
  const d = new Date(`${dateStr}T12:00:00Z`);
  return {
    weekday: new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: BUSINESS_TIMEZONE }).format(d),
    day: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: BUSINESS_TIMEZONE }).format(d),
  };
}

function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: BUSINESS_TIMEZONE }).format(new Date(iso));
}

function formatWhen(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "full", timeStyle: "short", timeZone: BUSINESS_TIMEZONE }).format(new Date(iso));
}

export default function BookingWidget({ mode, token }: { mode: "book" | "reschedule"; token?: string }) {
  const [stage, setStage] = useState<Stage>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [days, setDays] = useState<DaySlots[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");
  const [confirmedWhen, setConfirmedWhen] = useState("");

  // Reschedule mode only — the current time being moved, shown above the picker.
  const [currentWhen, setCurrentWhen] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAvailability(excludeBookingId?: string) {
      try {
        const params = new URLSearchParams({ days: "14" });
        if (excludeBookingId) params.set("excludeBookingId", excludeBookingId);
        const res = await fetch(`/api/booking/availability?${params.toString()}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not load availability");
        if (cancelled) return;
        setDays(data.slots || []);
        setStage("pick-slot");
      } catch (err) {
        if (cancelled) return;
        setErrorMessage(err instanceof Error ? err.message : "Could not load availability");
        setStage("error");
      }
    }

    async function init() {
      if (mode === "reschedule") {
        if (!token) {
          setErrorMessage("This link is missing its token.");
          setStage("error");
          return;
        }
        try {
          const res = await fetch(`/api/booking/reschedule-info?token=${encodeURIComponent(token)}`);
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "This link isn't valid.");
          if (cancelled) return;
          if (data.currentStart) setCurrentWhen(formatWhen(data.currentStart));
          await loadAvailability(data.bookingId);
        } catch (err) {
          if (cancelled) return;
          setErrorMessage(err instanceof Error ? err.message : "This link isn't valid.");
          setStage("error");
        }
        return;
      }
      await loadAvailability();
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [mode, token]);

  async function handleSelectSlot(date: string, slot: Slot) {
    setSelectedDate(date);
    setSelectedSlot(slot);
    if (mode === "reschedule") {
      setBusy(true);
      setFormError("");
      try {
        const res = await fetch("/api/booking/reschedule", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, start: slot.start, end: slot.end }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        setConfirmedWhen(formatWhen(slot.start));
        setStage("confirmed");
      } catch (err) {
        setFormError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setBusy(false);
      }
    }
  }

  async function handleSubmitDetails(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedSlot) return;
    setBusy(true);
    setFormError("");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          notes: form.get("notes"),
          start: selectedSlot.start,
          end: selectedSlot.end,
          turnstileToken: form.get("cf-turnstile-response"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setConfirmedWhen(formatWhen(selectedSlot.start));
      setStage("confirmed");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  if (stage === "loading") {
    return <div className="p-10 text-center text-sm text-ink/60">Loading available times…</div>;
  }

  if (stage === "error") {
    return (
      <div className="p-10 text-center">
        <p className="text-sm text-ink/60">{errorMessage}</p>
      </div>
    );
  }

  if (stage === "confirmed") {
    return (
      <div className="p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 className="text-emerald-500" size={32} />
        </div>
        <h2 className="mt-4 text-lg font-bold text-ink">
          {mode === "reschedule" ? "You're rescheduled" : "You're booked"}
        </h2>
        <p className="mt-1.5 text-sm text-ink/60">{confirmedWhen}</p>
        <p className="mt-4 text-xs text-ink/40">
          A confirmation email with a calendar invite is on its way. Need to change it? Use the links in that email.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      {stage === "pick-slot" && (
        <>
          {mode === "reschedule" && currentWhen && (
            <p className="mb-6 text-sm text-ink/60">
              Currently booked for <span className="font-medium text-ink">{currentWhen}</span> — pick a new time below.
            </p>
          )}
          {days.length === 0 ? (
            <p className="p-6 text-center text-sm text-ink/60">No open times in the next couple weeks — check back soon or reply to any of our emails.</p>
          ) : (
            <>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {days.map((day) => {
                  const { weekday, day: dayLabel } = formatDay(day.date);
                  const active = selectedDate === day.date;
                  return (
                    <button
                      key={day.date}
                      type="button"
                      onClick={() => {
                        setSelectedDate(day.date);
                        setSelectedSlot(null);
                      }}
                      className={`flex shrink-0 flex-col items-center gap-1 rounded-xl border px-4 py-3 text-sm transition ${
                        active ? "border-accent bg-accent/5" : "border-line hover:border-accent/50"
                      }`}
                    >
                      <CalendarDays size={16} className={active ? "text-accent" : "text-ink/40"} />
                      <span className="font-medium text-ink">{weekday}</span>
                      <span className="text-xs text-ink/60">{dayLabel}</span>
                    </button>
                  );
                })}
              </div>

              {selectedDate && (
                <div className="mt-6">
                  <div className="flex flex-wrap gap-2">
                    {days
                      .find((d) => d.date === selectedDate)
                      ?.times.map((slot) => {
                        const active = selectedSlot?.start === slot.start;
                        return (
                          <button
                            key={slot.start}
                            type="button"
                            disabled={busy}
                            onClick={() => handleSelectSlot(selectedDate, slot)}
                            className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition disabled:opacity-60 ${
                              active ? "border-accent bg-accent text-white" : "border-line text-ink hover:border-accent"
                            }`}
                          >
                            <Clock size={14} />
                            {formatTime(slot.start)}
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}

              <p className="mt-6 text-xs text-ink/40">
                All times shown in {new Intl.DateTimeFormat("en-US", { timeZoneName: "short", timeZone: BUSINESS_TIMEZONE }).formatToParts(new Date()).find((p) => p.type === "timeZoneName")?.value || BUSINESS_TIMEZONE}.
              </p>

              {formError && <p className="mt-3 text-sm text-red-500">{formError}</p>}

              {mode === "book" && (
                <button
                  type="button"
                  disabled={!selectedSlot || busy}
                  onClick={() => setStage("details")}
                  className={`${buttonClass} mt-6`}
                >
                  Next
                </button>
              )}
            </>
          )}
        </>
      )}

      {stage === "details" && selectedSlot && (
        <form onSubmit={handleSubmitDetails} className="grid gap-4">
          <p className="text-sm text-ink/60">
            Booking <span className="font-medium text-ink">{formatWhen(selectedSlot.start)}</span>
          </p>
          <input name="name" required placeholder="Full name" className={fieldClass} />
          <input name="email" type="email" required placeholder="Work email" className={fieldClass} />
          <input name="phone" type="tel" required placeholder="Phone number" className={fieldClass} />
          <textarea name="notes" rows={3} placeholder="Anything we should know before the call? (optional)" className={fieldClass} />
          <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStage("pick-slot")}
              className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink/60 hover:text-ink"
            >
              Back
            </button>
            <button type="submit" disabled={busy} className={buttonClass}>
              {busy ? "Booking…" : "Confirm booking"}
            </button>
          </div>
          {formError && <p className="text-sm text-red-500">{formError}</p>}
        </form>
      )}
    </div>
  );
}
