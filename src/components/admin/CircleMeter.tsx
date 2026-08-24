"use client";

import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import type { GoalField } from "@/lib/dashboardGoals";

type Accent = "brand" | "accent" | "teal" | "emerald";

const ACCENT_COLOR: Record<Accent, string> = {
  brand: "#3b82f6",
  accent: "#f59e0b",
  teal: "#0d9488",
  emerald: "#059669",
};

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function CircleMeter({
  label,
  value,
  goal,
  goalField,
  accent,
  canEditGoal,
}: {
  label: string;
  value: number;
  goal: number;
  goalField: GoalField;
  accent: Accent;
  canEditGoal: boolean;
}) {
  // The goal itself is persisted server-side (eliteworker_dashboard_goals)
  // and only ever changes when someone edits it here — it's not tied to the
  // month and doesn't reset with the count it's measuring.
  const [currentGoal, setCurrentGoal] = useState(goal);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(goal));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const percent = currentGoal > 0 ? Math.max(0, Math.min(100, (value / currentGoal) * 100)) : value > 0 ? 100 : 0;
  const offset = CIRCUMFERENCE * (1 - percent / 100);
  const color = ACCENT_COLOR[accent];

  function startEdit() {
    setDraft(String(currentGoal));
    setError("");
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setError("");
  }

  async function saveGoal() {
    const num = Number(draft);
    if (!Number.isInteger(num) || num < 0) {
      setError("Enter a whole number, 0 or more");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/goals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field: goalField, value: num }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to save goal");
      setCurrentGoal(num);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save goal");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col items-center rounded-2xl border border-line bg-paper p-6 text-center">
      <div className="relative h-28 w-28">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="var(--line)" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-3xl font-bold text-ink">{value}</span>
        </div>
      </div>
      <p className="mt-3 text-sm font-medium text-ink/60">{label}</p>

      {editing ? (
        <div className="mt-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-ink/40">Goal:</span>
            <input
              type="number"
              min={0}
              step={1}
              value={draft}
              autoFocus
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveGoal();
                if (e.key === "Escape") cancelEdit();
              }}
              className="w-14 rounded-md border border-line bg-paper px-1.5 py-0.5 text-center text-xs text-ink outline-none focus:border-brand"
            />
            <button
              type="button"
              onClick={saveGoal}
              disabled={saving}
              className="rounded-md p-1 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50"
              aria-label="Save goal"
            >
              <Check size={13} />
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-md p-1 text-ink/40 hover:bg-paper-alt hover:text-ink"
              aria-label="Cancel"
            >
              <X size={13} />
            </button>
          </div>
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
      ) : (
        <button
          type="button"
          onClick={canEditGoal ? startEdit : undefined}
          disabled={!canEditGoal}
          className={`mt-1 flex items-center gap-1 text-xs text-ink/35 ${canEditGoal ? "hover:text-ink/60" : ""}`}
        >
          Goal: {currentGoal}
          {canEditGoal && <Pencil size={11} />}
        </button>
      )}
    </div>
  );
}
