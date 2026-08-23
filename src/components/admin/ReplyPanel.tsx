"use client";

import { useState } from "react";

export type ReplyRecord = {
  id: string;
  created_at: string;
  admin_name: string | null;
  message: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

async function parseJsonSafe(res: Response): Promise<{ error?: string; [key: string]: unknown }> {
  try {
    return await res.json();
  } catch {
    return { error: `Unexpected response from server (${res.status})` };
  }
}

// Shared by the leads/beta/bookings expanded rows so replying works the same
// way everywhere — compose, send, and see the sent history — without leaving
// the admin dashboard for an email client.
export function ReplyPanel({
  replyApi,
  recipientName,
  recipientEmail,
  initialReplies,
}: {
  replyApi: string;
  recipientName: string;
  recipientEmail: string | null;
  initialReplies: ReplyRecord[];
}) {
  const [replies, setReplies] = useState(initialReplies);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function handleSend() {
    if (!message.trim() || sending) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch(replyApi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await parseJsonSafe(res);
      if (!res.ok) throw new Error(data.error || "Failed to send reply");
      setReplies((prev) => [...prev, data.reply as ReplyRecord]);
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reply");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mt-4 max-w-2xl border-t border-line pt-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
        {replies.length > 0 ? "Reply history" : "Reply"}
      </p>

      {replies.length > 0 && (
        <div className="mt-2 space-y-2">
          {replies.map((reply) => (
            <div key={reply.id} className="rounded-lg border border-line bg-paper px-3 py-2">
              <p className="text-xs text-ink/45">
                {formatDate(reply.created_at)} {reply.admin_name ? `· ${reply.admin_name}` : ""}
              </p>
              <p className="mt-1 text-sm whitespace-pre-wrap text-ink">{reply.message}</p>
            </div>
          ))}
        </div>
      )}

      {recipientEmail ? (
        <>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Reply to ${recipientName} — sent from ${recipientEmail}...`}
            rows={3}
            className="mt-3 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-brand"
          />
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              disabled={sending || !message.trim()}
              onClick={handleSend}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-brand/90 disabled:opacity-50"
            >
              {sending ? "Sending…" : "Send reply"}
            </button>
          </div>
        </>
      ) : (
        <p className="mt-3 text-sm text-ink/40 italic">No email address on file — can&rsquo;t reply from here.</p>
      )}
    </div>
  );
}
