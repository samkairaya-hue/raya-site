# Deploying to your own Supabase + Vercel

This app is a TanStack Start (SSR) app. It needs:

- a **Supabase project** (Postgres + Storage) — no Supabase Auth is used, the CMS login is a password + encrypted cookie
- a **Vercel project** (Node SSR via Nitro's `vercel` preset)

---

## 1. Create the Supabase project

1. https://supabase.com/dashboard → **New project** (pick a region close to your users).
2. From **Project Settings → API** copy:
   - Project URL → `SUPABASE_URL` / `VITE_SUPABASE_URL`
   - `anon` / publishable key → `SUPABASE_PUBLISHABLE_KEY` / `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server only, never expose)

## 2. Apply the database schema

The full schema lives in `supabase/migrations/`. From your local clone:

```bash
npm i -g supabase            # or: brew install supabase/tap/supabase
supabase login
supabase link --project-ref <your-project-ref>
supabase db push             # applies every migration in supabase/migrations
```

This creates: `site_content`, `matrix_cards`, `outcome_cards`, `magazine_cards`, `faqs`,
`user_roles`, `admin_auth`, the `has_role()` function, RLS policies, GRANTs, and the
default Hebrew content rows.

> No CLI? Open **SQL Editor** in the dashboard and paste the migration files in
> filename order (they are timestamp-prefixed), one at a time.

## 3. Create the storage bucket

The CMS uploads images and secondary-page HTML to a **private** bucket named `cms-media`
(served through signed URLs generated server-side with the service-role key).

Dashboard → **Storage → New bucket** → name `cms-media`, **Public: off**. Or via SQL:

```sql
insert into storage.buckets (id, name, public)
values ('cms-media', 'cms-media', false)
on conflict (id) do nothing;
```

No storage policies are needed — all storage access goes through the service-role key
on the server.

## 4. Create the Vercel project

1. Push this repo to GitHub, then https://vercel.com/new → import it.
2. Framework preset: **Other**. Build command `npm run build`, install command `npm install`
   (or `bun install`). Leave the output directory empty — Nitro's Vercel preset writes
   `.vercel/output` and Vercel picks it up automatically.
3. Node.js version: **22.x**.

## 5. Environment variables (Vercel → Settings → Environment Variables)

Add all of these to **Production** *and* **Preview**:

| Name | Value | Used by |
|---|---|---|
| `NITRO_PRESET` | `vercel` | build (required, selects the Vercel output) |
| `SUPABASE_URL` | `https://xxxx.supabase.co` | server |
| `SUPABASE_PUBLISHABLE_KEY` | anon key | server (public reads) |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key | server (uploads, CMS writes) |
| `VITE_SUPABASE_URL` | same as `SUPABASE_URL` | browser (baked in at build) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | same as anon key | browser (baked in at build) |
| `SESSION_SECRET` | random string, **32+ chars** | encrypts the admin cookie |
| `ADMIN_PASSWORD` | initial CMS password | `/admin` login |

Generate the session secret with:

```bash
openssl rand -hex 32
```

`VITE_*` values are embedded at build time — changing them requires a redeploy.
Changing `SESSION_SECRET` invalidates all existing admin sessions.

### About `ADMIN_PASSWORD`

`ADMIN_PASSWORD` is the **initial/fallback** password. Once you change the password from the
CMS ("🔐 סיסמת מנהל" panel) the hash is stored in the `admin_auth` table and takes precedence.
To reset a forgotten password: `delete from public.admin_auth;` — the env value applies again.

## 6. Local development

Create `.env` in the project root (not committed):

```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_PUBLISHABLE_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...
SESSION_SECRET=<64 hex chars>
ADMIN_PASSWORD=123456
```

Then `npm install && npm run dev` (http://localhost:8080).

## 7. Cookie note

The admin session cookie is `httpOnly; secure; sameSite=none`, which is required while the
app is previewed inside an iframe. On your own domain over HTTPS this works unchanged.
If you never embed the site in an iframe you can tighten it to `sameSite: "lax"` in
`src/lib/admin-session.server.ts`.

## 8. Contact-form email (still mocked)

`sendContact` in `src/lib/cms.functions.ts` currently **logs** the submission instead of
sending it (the button/reset UX works end-to-end). To send real mail on Vercel, pick a
provider and replace the mock block:

```bash
npm i resend
```

```ts
// inside sendContact's handler, replacing the console.log mock
const { Resend } = await import("resend");
const resend = new Resend(process.env.RESEND_API_KEY!);
await resend.emails.send({
  from: process.env.MAIL_FROM!,              // e.g. "site@your-domain.com" (verified domain)
  to,                                        // admin_email from the CMS General Settings
  subject: `פניה באתר: ${data.firstName}`,
  text: `${data.field2}\n\n${data.field3}`,
});
```

Then add `RESEND_API_KEY` and `MAIL_FROM` to the Vercel environment variables and verify
your sending domain with the provider.

## 9. Post-deploy checklist

- [ ] `/` renders with the Hebrew content and the correct palette
- [ ] `/admin` asks for the password and unlocks
- [ ] image upload works and shows a preview (storage bucket + service role key)
- [ ] uploading HTML to a card in sections 3/5/6 makes that card clickable
- [ ] FAQ add/remove/reorder persists after a refresh
- [ ] contact form shows the green success state and resets after 3s

## Applying the schema without the Supabase CLI

If `supabase db push` fails (e.g. "IPv6 is not supported on your current network"),
open your Supabase project → SQL Editor and paste the contents of
`supabase/full_setup.sql` (all migrations concatenated, in order) and run it once.
This creates every table, RLS policy, GRANT, function and the default Hebrew content.

Note: the database password is only used by the Supabase CLI / direct psql
connections. It is NOT a Vercel environment variable — the app authenticates with
`SUPABASE_URL` + the publishable/service-role keys over HTTPS.
