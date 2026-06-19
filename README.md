# Portfolia

A clean, single-page developer portfolio with a full admin panel. Everything on the
public page is editable from `/admin` — name, bio, startups, tech stack, projects — and
it pulls **live** data from GitHub and Spotify.

Built with Next.js (App Router) · Supabase · Tailwind CSS.

## Features

- **Public page** (`/`) — profile, live GitHub contribution graph, live Spotify now-playing,
  tech stack, startups (with MRR badges + sparklines), featured projects.
- **Admin** (`/admin`) — Supabase-auth protected. Edit all content. Connect integrations.
- **No hardcoded content** — the page renders entirely from the DB. Seed defaults ship in
  `supabase/schema.sql` and are fully overwritable from the admin.
- Light/dark theme, ISR caching, RLS on every table.

## Setup

1. **Install**
   ```bash
   npm install
   ```

2. **Supabase**
   - Create a project at [supabase.com](https://supabase.com).
   - Run `supabase/schema.sql` in the SQL editor (creates tables, RLS, seed).
   - Create your admin user: Authentication → Users → Add user (email + password).

3. **Env** — copy and fill:
   ```bash
   cp .env.example .env.local
   ```
   Minimum to boot the admin: the three `NEXT_PUBLIC_SUPABASE_*` / `SUPABASE_SERVICE_ROLE_KEY`
   values and `ADMIN_EMAILS`.

4. **Run**
   ```bash
   npm run dev
   ```
   Open `/admin`, sign in, edit everything, connect integrations.

> Without Supabase configured the public page still renders using the seed defaults in
> `lib/seed.ts`, so you can preview the design immediately.

## Connecting integrations

All credentials can be set in the **/admin → Integrations** panel (stored in the DB), or via
env as a fallback.

| Source  | What you need | Notes |
|---------|---------------|-------|
| GitHub  | username + classic PAT (`read:user`) | Live contribution calendar via GraphQL. |
| Spotify | Client ID + Secret, then "Connect" | OAuth flow stores a refresh token; shows now-playing / last-played. |

For Spotify, add `<origin>/api/auth/spotify/callback` as a Redirect URI in the Spotify dashboard.

## Architecture

- `app/` — routes. Public page is RSC + ISR (`revalidate`); admin is `force-dynamic`.
- `app/admin/actions.ts` — server actions (Zod-validated) for all writes; revalidate on save.
- `lib/data.ts` — cached public content reads (`revalidateTag('content')`).
- `lib/integrations/*` — GitHub / Spotify / X clients, cached per source.
- `lib/supabase/*` — `@supabase/ssr` clients (server, browser, service role).
- `supabase/schema.sql` — schema, indexes, RLS, seed.

Public can only **read** content tables; only authenticated admins can **write**. The
`integrations` table (OAuth tokens) is reachable only via the service-role key — no
anon/authenticated policy exists for it.
