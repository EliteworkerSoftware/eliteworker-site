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

## 4. Connect Resend (sends you an email every time someone submits the form)

1. Sign up free at https://resend.com
2. Create an API key → paste into `.env.local` as `RESEND_API_KEY`
3. Set `CONTACT_TO_EMAIL` to whatever inbox should get the leads
4. For now you can leave `CONTACT_FROM_EMAIL` as the Resend test address; once
   you verify your own domain in Resend (a few DNS records), switch it to
   something like `EliteWorker <hello@eliteworker.io>`

## 5. Connect Cal.com (demo booking calendar)

1. Sign up free at https://cal.com and connect the calendar you want demo
   bookings to land on
2. Create an event type called something like "eliteworker-demo"
3. Set `NEXT_PUBLIC_CAL_LINK` in `.env.local` to `your-username/eliteworker-demo`

## 6. Push to GitHub

```
git init
git add .
git commit -m "Initial EliteWorker site"
```
Then create a new empty repo on GitHub and follow the "push an existing
repository" instructions it gives you.

## 7. Deploy to Vercel (free, no credit card needed)

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
- Contact form → saves to Supabase + emails you via Resend
- SEO: page titles/descriptions, sitemap.xml, robots.txt, Open Graph tags

## Swapping in your real brand

Colors and fonts live in one place: `src/app/globals.css` (the `:root` block
at the top) and `src/app/layout.tsx` (font imports). Send me your logo file
and hex codes and I'll update these directly, or point Claude Code at your
logo and ask it to match the palette.
