import { JWT } from "google-auth-library";

// Service-account auth — no OAuth consent screen or refresh tokens to manage.
// The business owner shares their calendar with this service account's email
// once (Calendar Settings -> Share with specific people -> "Make changes to
// events"). One module-level client so a warm serverless instance reuses its
// cached access token instead of re-authorizing on every call.
let client: JWT | null = null;

function isConfigured(): boolean {
  return Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY && process.env.GOOGLE_CALENDAR_ID);
}

function getClient(): JWT {
  if (!client) {
    client = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      // Env vars can't hold real newlines — the key is stored with literal
      // "\n" and unescaped here.
      key: (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });
  }
  return client;
}

async function calendarFetch(path: string, init?: RequestInit): Promise<Response> {
  const { token } = await getClient().getAccessToken();
  const res = await fetch(`https://www.googleapis.com/calendar/v3${path}`, {
    ...init,
    headers: { ...init?.headers, Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  return res;
}

export type BusyInterval = { start: string; end: string };

// Soft-skips (returns no busy times) if not configured yet, matching the
// Twilio/Turnstile pattern elsewhere — availability still works from
// Supabase bookings alone, just without the "blocks manually-added personal
// events too" benefit until the owner finishes setup.
export async function getFreeBusy(timeMin: string, timeMax: string): Promise<BusyInterval[]> {
  if (!isConfigured()) {
    console.warn("Google Calendar env vars not set — skipping freebusy lookup");
    return [];
  }
  const calendarId = process.env.GOOGLE_CALENDAR_ID as string;
  const res = await calendarFetch("/freeBusy", {
    method: "POST",
    body: JSON.stringify({ timeMin, timeMax, items: [{ id: calendarId }] }),
  });
  if (!res.ok) {
    throw new Error(`Google freeBusy error ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  return data.calendars?.[calendarId]?.busy || [];
}

export async function createEvent(input: {
  summary: string;
  description: string;
  start: string;
  end: string;
}): Promise<{ eventId: string; meetingUrl: string | null }> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID as string;
  const res = await calendarFetch(`/calendars/${encodeURIComponent(calendarId)}/events?conferenceDataVersion=1`, {
    method: "POST",
    body: JSON.stringify({
      summary: input.summary,
      description: input.description,
      start: { dateTime: input.start },
      end: { dateTime: input.end },
      // No `attendees` — a bare service account can't send Calendar invites
      // to non-Workspace guests without domain-wide delegation. The .ics
      // email attachment is the attendee-facing calendar artifact instead;
      // this event exists purely so the host's own calendar stays in sync.
      conferenceData: {
        createRequest: { requestId: crypto.randomUUID(), conferenceSolutionKey: { type: "hangoutsMeet" } },
      },
    }),
  });
  if (!res.ok) {
    throw new Error(`Google createEvent error ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  return { eventId: data.id, meetingUrl: data.hangoutLink || null };
}

export async function updateEvent(eventId: string, input: { start: string; end: string }): Promise<void> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID as string;
  const res = await calendarFetch(`/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`, {
    method: "PATCH",
    body: JSON.stringify({ start: { dateTime: input.start }, end: { dateTime: input.end } }),
  });
  if (!res.ok) {
    throw new Error(`Google updateEvent error ${res.status}: ${await res.text()}`);
  }
}

export async function deleteEvent(eventId: string): Promise<void> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID as string;
  const res = await calendarFetch(`/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`, {
    method: "DELETE",
  });
  // 404/410 means the event is already gone — treat as success so a cancel
  // never fails just because the calendar and Supabase drifted.
  if (!res.ok && res.status !== 404 && res.status !== 410) {
    throw new Error(`Google deleteEvent error ${res.status}: ${await res.text()}`);
  }
}

export { isConfigured as isGoogleCalendarConfigured };
