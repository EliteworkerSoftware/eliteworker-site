# EliteWorker marketing site — setup guide (no coding experience required)

This is a working starter. Follow these steps in order and you'll have a live,
editable site with a working contact form and demo booking.

## 1. Your daily editing tool: Claude Code

For "describe the change, watch it happen live" editing, install **Claude Code**
(Anthropic's desktop coding tool) and open this folder in it. You can literally
say things like "make the hero headline bigger" or "add a pricing section" and
watch the file change, with a live preview running in your browser at the same
time (see step 2). This replaces needing to touch code directly — your job is
the art direction, Claude Code does the typing.

## 2. Run it locally (see changes live in your browser)

Open a terminal in this folder and run:

```
npm install
npm run dev
```

Then open http://localhost:3000 — every edit saves and updates instantly.

## 3. Connect Supabase (stores every demo request / contact form lead)

You already have a Supabase project. In it, open the SQL editor and run:

```sql
create table eliteworker_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  email text not null,
  company text,
  message text not null
);
```

Then in Supabase go to Project Settings → API and copy:
- **Project URL** → paste into `.env.local` as `SUPABASE_URL`
- **service_role key** (not the anon key) → paste as `SUPABASE_SERVICE_ROLE_KEY`

Copy `.env.example` to `.env.local` first (`.env.local` is where your real keys live —
it's never uploaded to GitHub).

## 4. Connect Mailgun (sends you an email every time someone submits the form)

1. Sign up free at https://mailgun.com
2. Create an API key → paste into `.env.local` as `MAILGUN_API_KEY`
3. Copy your sending domain (Mailgun gives you a sandbox domain to start, or
   verify your own domain under Sending → Domains) → paste as `MAILGUN_DOMAIN`
4. Set `CONTACT_TO_EMAIL` to whatever inbox should get the leads
5. For now you can leave `CONTACT_FROM_EMAIL` unset to use the Mailgun sandbox
   address; once you verify your own domain in Mailgun (a few DNS records),
   set it to something like `EliteWorker <hello@eliteworker.io>`

## 5. Connect Cal.com (demo booking calendar)

1. Sign up free at https://cal.com and connect the calendar you want demo
   bookings to land on
2. Create an event type called something like "eliteworker-demo"
3. Set `NEXT_PUBLIC_CAL_LINK` in `.env.local` to `your-username/eliteworker-demo`

## 6. Admin dashboard (`/admin`) — view submissions, manage admin users

The dashboard at `/admin` shows every contact form lead and beta signup, and
lets Owner-role accounts add or remove other admins. It uses its own accounts
table, separate from Supabase Auth — in the Supabase SQL editor, run:

```sql
create table eliteworker_admin_users (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  email text not null unique,
  password_hash text not null,
  role text not null check (role in ('owner', 'viewer'))
);

alter table eliteworker_admin_users enable row level security;
```

(RLS with no policies is intentional — the app only ever queries this table
with the Supabase service role key, which bypasses RLS, so this just makes
sure the table is unreachable through Supabase's public API under any
circumstance, since it holds password hashes.)

Set `ADMIN_SESSION_SECRET` in `.env.local` to any long random string (used to
sign login sessions — `openssl rand -hex 32` or ask Claude Code to generate one).

There's no signup page by design — the very first Owner account has to be
seeded directly, since the in-app "add admin" UI needs an existing Owner to
use it:

```
node scripts/create-admin.mjs you@eliteworker.com "temporary-password" owner
```

After that, sign in at `/admin/login` and add further admins (Owner or
Viewer role) from the dashboard itself. Keep that script around — it's also
the way back in if every Owner account is ever lost (just run it again with
an existing email to reset that account's password, or a new email to add one).

**Owner** can view submissions and manage admin accounts. **Viewer** can only
view submissions.

Replying to a lead, beta applicant, or demo booking contact right from the
dashboard (instead of your email inbox) needs one more table, shared across
all three — in the Supabase SQL editor, run:

```sql
create table eliteworker_replies (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  source_table text not null check (source_table in ('eliteworker_leads', 'eliteworker_beta_signups', 'eliteworker_demo_bookings')),
  source_id uuid not null,
  admin_id uuid not null references eliteworker_admin_users(id),
  admin_name text,
  message text not null
);

alter table eliteworker_replies enable row level security;
create index eliteworker_replies_source_idx on eliteworker_replies (source_table, source_id);

-- If you ran an earlier version of this guide, this replaces that
-- leads-only table — safe to drop:
drop table if exists eliteworker_lead_replies;
```

Each section now has its own status list instead of one shared one (Leads:
New/Contacted/Booked for Demo/Archived, Beta: New/Approved/Declined/Archived,
Bookings: Confirm 1/Confirm 2/Converted/Archived), and demo booking reminders
are now automatic. This needs one more migration — in the Supabase SQL editor, run:

```sql
-- New columns the per-section statuses use
alter table eliteworker_beta_signups add column if not exists decline_reason text;
alter table eliteworker_demo_bookings add column if not exists reminder_sent_at timestamptz;
alter table eliteworker_demo_bookings alter column pipeline_status set default 'confirm_1';

-- Status values are now validated in the app (per section) rather than by a
-- single shared database constraint — drop the old constraint if you have one
-- (safe to run even if it doesn't exist or is named differently):
alter table eliteworker_leads drop constraint if exists eliteworker_leads_pipeline_status_check;
alter table eliteworker_beta_signups drop constraint if exists eliteworker_beta_signups_pipeline_status_check;
alter table eliteworker_demo_bookings drop constraint if exists eliteworker_demo_bookings_pipeline_status_check;

-- Remap any existing rows off the old shared status values onto the closest
-- new one for that section — spot-check a few rows after running this:
update eliteworker_leads set pipeline_status = 'booked_demo' where pipeline_status = 'converted';
update eliteworker_beta_signups set pipeline_status = 'new' where pipeline_status = 'contacted';
update eliteworker_beta_signups set pipeline_status = 'approved' where pipeline_status = 'converted';
update eliteworker_demo_bookings set pipeline_status = 'confirm_1' where pipeline_status in ('new', 'contacted');
```

**Demo booking reminders are now automated.** When someone books a demo,
Cal.com immediately emails them its own confirmation — the dashboard marks
that as **Confirm 1**. About a day before the booking, a scheduled job emails
them again asking them to confirm they'll still be there; clicking the button
in that email marks it **Confirm 2**. This needs two things:

1. In `.env.local` (and in Vercel's Environment Variables once deployed), set
   `CRON_SECRET` to any long random string.
2. The schedule itself lives in `vercel.json` (already set up to run daily at
   14:00 UTC) — Vercel picks it up automatically on your next deploy, no
   dashboard setup needed. Locally, `next dev` never fires it — that's expected;
   reminders only send from the deployed site.

Whatever a booker types into Cal.com's "additional notes" field at booking
time now comes through too — shown in the demo booking's admin row and in
the team notification email. One more column for that:

```sql
alter table eliteworker_demo_bookings add column if not exists notes text;
```

The Overview page's "This month" metrics (demo bookings, closed sales, new leads)
need to know *when* a booking actually converted, not just when it was
originally booked — a booking scheduled in one month can close in the next.
One more column:

```sql
alter table eliteworker_demo_bookings add column if not exists converted_at timestamptz;
```

Each "This month" meter now shows progress toward an editable goal (click
the "Goal: N" text under a meter to change it — Owner role only) instead of
a plain count. The goal itself is stored separately and only changes when
someone edits it — a new table for that, seeded with starter defaults:

```sql
create table eliteworker_dashboard_goals (
  id uuid primary key default '00000000-0000-0000-0000-000000000001',
  demo_bookings_goal integer not null default 10,
  closed_sales_goal integer not null default 5,
  new_leads_goal integer not null default 20,
  updated_at timestamptz default now()
);

insert into eliteworker_dashboard_goals (id) values ('00000000-0000-0000-0000-000000000001')
on conflict (id) do nothing;
```

Two more additions to the admin dashboard: the "Resend invite" button on an
admin account now disappears once that person has actually logged in (no
point resending a password they've already used), and every admin can turn
on two-factor authentication for their own account from the new "Security"
link next to Log out — any standard authenticator app works (Apple's
Passwords app, Google Authenticator, Authy, 1Password). Both need one more
migration:

```sql
alter table eliteworker_admin_users add column if not exists last_login_at timestamptz;
alter table eliteworker_admin_users add column if not exists totp_secret text;
alter table eliteworker_admin_users add column if not exists totp_enabled boolean not null default false;
```

2FA is opt-in per admin, not forced — each person turns it on for themselves
once they're ready, so nobody gets locked out by a half-finished rollout.

Each admin can also add a passkey (Face ID, Touch ID, or Windows Hello
fingerprint) from the same Security page, and use it to sign in instead of a
password — same "Security" link, one more table:

```sql
create table eliteworker_admin_passkeys (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references eliteworker_admin_users(id) on delete cascade,
  credential_id text not null unique,
  public_key text not null,
  counter bigint not null default 0,
  device_type text,
  backed_up boolean not null default false,
  device_name text,
  created_at timestamptz default now(),
  last_used_at timestamptz
);
```

A passkey is tied to the exact domain it was registered on — one added
while testing on `localhost` won't work on the live `eliteworker.com` site,
and vice versa. That's normal WebAuthn behavior, not a bug.

A "Join meeting"/"Join" button now shows up on demo bookings that have a
video call link (Overview's Upcoming Demos, and each booking's expanded
row in the Demo Bookings tab) — clicking an upcoming demo on Overview also
jumps straight to that booking in the Demo Bookings tab. One more column,
populated automatically from Cal.com's webhook going forward (past
bookings won't have one retroactively):

```sql
alter table eliteworker_demo_bookings add column if not exists meeting_url text;
```

Admins can now upload a profile photo (Security page in `/admin`), shown next
to their name in the dashboard's account menu instead of just initials. This
needs a new column plus a public Storage bucket to hold the images — in the
Supabase SQL editor, run:

```sql
alter table eliteworker_admin_users add column if not exists avatar_url text;

insert into storage.buckets (id, name, public)
values ('admin-avatars', 'admin-avatars', true)
on conflict (id) do nothing;
```

(The bucket is public-read so avatar images load directly by URL, but every
upload/delete goes through `/api/admin/profile/avatar` using the service role
key — same bypass-RLS pattern as the rest of the admin tables.)

## 7. Push to GitHub

```
git init
git add .
git commit -m "Initial EliteWorker site"
```
Then create a new empty repo on GitHub and follow the "push an existing
repository" instructions it gives you.

## 8. Deploy to Vercel (free, no credit card needed)

1. Go to https://vercel.com and choose "Continue with GitHub"
2. Click "Add New Project" and pick this repo
3. Before deploying, click "Environment Variables" and paste in everything
   from your `.env.local` file
4. Click Deploy — you'll get a live URL in about a minute
5. Once it's live, go to Project Settings → Domains and add your real domain
   (eliteworker.io or whatever you register)

From then on, every time you push a change to GitHub, Vercel automatically
rebuilds and updates the live site — and every push also gets its own
preview link so you can check changes before they go live.

## What's already built

- `/` — homepage: hero, features, workflow, contact form
- `/demo` — dedicated demo booking page (Cal.com embed)
- `/admin` — password-protected dashboard: view contact leads, beta signups,
  and demo bookings, reply to any of them by email right from the dashboard,
  manage admin users (Owner/Viewer roles)
- Contact form → saves to Supabase + emails you via Mailgun
- SEO: page titles/descriptions, sitemap.xml, robots.txt, Open Graph tags

## Swapping in your real brand

Colors and fonts live in one place: `src/app/globals.css` (the `:root` block
at the top) and `src/app/layout.tsx` (font imports). Send me your logo file
and hex codes and I'll update these directly, or point Claude Code at your
logo and ask it to match the palette.
