"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Trash2 } from "lucide-react";
import type { AdminUser } from "@/lib/currentAdmin";

function initials({ full_name, email }: AdminUser) {
  const source = full_name?.trim() || email;
  const parts = source.split(/\s+/);
  return (parts.length > 1 ? parts[0][0] + parts[1][0] : source.slice(0, 2)).toUpperCase();
}

export default function AdminAvatarUpload({ admin }: { admin: AdminUser }) {
  const [avatarUrl, setAvatarUrl] = useState(admin.avatar_url);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setBusy(true);
    setError("");
    try {
      const body = new FormData();
      body.set("file", file);
      const res = await fetch("/api/admin/profile/avatar", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setAvatarUrl(data.avatarUrl);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/profile/avatar", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove photo");
      setAvatarUrl(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove photo");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <p className="font-semibold text-ink">Profile photo</p>
      <p className="mt-1.5 text-sm text-ink/60">Shown next to your name in the admin dashboard.</p>

      <div className="mt-4 flex items-center gap-4">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URL, not a local/optimizable asset
          <img src={avatarUrl} alt="" className="h-16 w-16 rounded-full object-cover" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-lg font-semibold text-white">
            {initials(admin)}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink/70 transition hover:border-ink/25 hover:text-ink disabled:opacity-60"
          >
            <Camera size={14} />
            {busy ? "Uploading…" : avatarUrl ? "Change photo" : "Upload photo"}
          </button>
          {avatarUrl && (
            <button
              type="button"
              disabled={busy}
              onClick={handleRemove}
              className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:border-red-300 hover:bg-red-50 disabled:opacity-60"
            >
              <Trash2 size={13} />
              Remove
            </button>
          )}
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
