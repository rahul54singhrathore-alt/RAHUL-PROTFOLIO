-- Portfolia schema. Run in Supabase SQL editor (or `supabase db push`).
-- Public can READ content. Only authenticated admins can WRITE.
-- `integrations` holds OAuth tokens — NO public/anon access at all.

-- ----------------------------------------------------------------------------
-- Tables
-- ----------------------------------------------------------------------------
create table if not exists public.profile (
  id            int primary key default 1,
  name          text not null default '',
  role          text not null default '',
  location      text not null default '',
  email         text not null default '',
  pronouns      text not null default '',
  tagline       text not null default '',
  bio           text not null default '',
  about         text not null default '',
  avatar_url    text not null default '',
  github_username text not null default '',
  x_handle      text not null default '',
  linkedin      text not null default '',
  website       text not null default '',
  status_text   text not null default '',
  spotify_playlist text not null default '',
  updated_at    timestamptz not null default now(),
  constraint single_row check (id = 1)
);

create table if not exists public.startups (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  tagline     text not null default '',
  url         text not null default '#',
  emoji       text not null default '🚀',
  logo        text not null default '',
  mrr         text not null default '',
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.tech_stack (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null,
  url         text not null default '#',
  sort_order  int not null default 0
);

create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text not null default '',
  url         text not null default '#',
  sort_order  int not null default 0
);

create table if not exists public.integrations (
  provider      text primary key check (provider in ('github','spotify')),
  access_token  text,
  refresh_token text,
  meta          jsonb not null default '{}'::jsonb,
  updated_at    timestamptz not null default now()
);

create table if not exists public.posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  excerpt       text not null default '',
  content       text not null default '',
  cover_image   text not null default '',
  published     boolean not null default false,
  published_at  timestamptz not null default now(),
  created_at    timestamptz not null default now()
);

create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  body        text not null,
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Admin allowlist (RLS source of truth). Service-role only — no policies.
create table if not exists public.admins (
  email      text primary key,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Indexes (sort_order is the common ORDER BY)
-- ----------------------------------------------------------------------------
create index if not exists startups_sort_idx   on public.startups (sort_order);
create index if not exists tech_sort_idx        on public.tech_stack (sort_order);
create index if not exists projects_sort_idx    on public.projects (sort_order);
create index if not exists posts_published_idx  on public.posts (published, published_at desc);
create index if not exists messages_created_idx on public.messages (created_at desc);

-- ----------------------------------------------------------------------------
-- RLS
-- ----------------------------------------------------------------------------
alter table public.profile      enable row level security;
alter table public.startups     enable row level security;
alter table public.tech_stack   enable row level security;
alter table public.projects     enable row level security;
alter table public.integrations enable row level security;
alter table public.posts        enable row level security;
alter table public.messages     enable row level security;
alter table public.admins       enable row level security;

-- True when the caller's JWT email is in the admin allowlist.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins a where a.email = (auth.jwt() ->> 'email'));
$$;
revoke execute on function public.is_admin() from public;
revoke execute on function public.is_admin() from anon;
grant execute on function public.is_admin() to authenticated;

-- Content tables: public read; writes require an allowlisted admin.
do $$
declare t text;
begin
  foreach t in array array['profile','startups','tech_stack','projects'] loop
    execute format('drop policy if exists %I_read on public.%I', t, t);
    execute format('create policy %I_read on public.%I for select using (true)', t, t);
    execute format('drop policy if exists %I_write on public.%I', t, t);
    execute format($p$create policy %I_write on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())$p$, t, t);
  end loop;
end $$;

-- posts: public reads only PUBLISHED rows; admins read/write all.
drop policy if exists posts_read_public on public.posts;
create policy posts_read_public on public.posts for select using (published = true);
drop policy if exists posts_admin on public.posts;
create policy posts_admin on public.posts for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- messages: anyone may submit (insert). Only admins can read / update / delete.
drop policy if exists messages_insert on public.messages;
create policy messages_insert on public.messages for insert to anon, authenticated with check (true);
drop policy if exists messages_admin_read on public.messages;
create policy messages_admin_read on public.messages for select to authenticated using (public.is_admin());
drop policy if exists messages_admin_update on public.messages;
create policy messages_admin_update on public.messages for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists messages_admin_delete on public.messages;
create policy messages_admin_delete on public.messages for delete to authenticated using (public.is_admin());

-- integrations + admins: NO anon/authed policies → only the service role key can touch them.

-- ----------------------------------------------------------------------------
-- Seed (idempotent)
-- ----------------------------------------------------------------------------
-- Admin allowlist — add every email that should be able to write via the API.
insert into public.admins (email) values
  ('sourabhsingh2002.rathore@gmail.com'),
  ('sourabh52.singh@gmail.com')
on conflict do nothing;

insert into public.profile (id, name, role, location, email, pronouns, bio, status_text)
values (1, 'Sourabh Singh', 'Full-Stack Developer', 'Jaipur, India',
        'sourabhsingh2002.rathore@gmail.com', 'he/him',
        'I build full-stack web products end-to-end, obsessing over the small details that make software feel right to use. Currently working with TypeScript, React, Next.js, and Tailwind CSS.',
        'Building things on the internet')
on conflict (id) do nothing;

insert into public.tech_stack (name, slug, url, sort_order) values
  ('TypeScript','typescript','https://www.typescriptlang.org',1),
  ('JavaScript','javascript','https://developer.mozilla.org/docs/Web/JavaScript',2),
  ('React','react','https://react.dev',3),
  ('Next.js','nextjs','https://nextjs.org',4),
  ('Node.js','nodejs','https://nodejs.org',5),
  ('Tailwind CSS','tailwindcss','https://tailwindcss.com',6),
  ('Supabase','supabase','https://supabase.com',7),
  ('PostgreSQL','postgresql','https://www.postgresql.org',8)
on conflict do nothing;

-- ----------------------------------------------------------------------------
-- Page views counter
-- ----------------------------------------------------------------------------
create table if not exists public.page_views (
  slug   text primary key,
  views  bigint not null default 0
);
alter table public.page_views enable row level security;
drop policy if exists page_views_read on public.page_views;
create policy page_views_read on public.page_views for select using (true);

insert into public.page_views (slug, views) values ('site', 0) on conflict do nothing;

create or replace function public.bump_views(p_slug text)
returns bigint language plpgsql security definer set search_path = public as $$
declare v bigint;
begin
  insert into public.page_views (slug, views) values (p_slug, 1)
  on conflict (slug) do update set views = public.page_views.views + 1
  returning views into v;
  return v;
end;
$$;
revoke execute on function public.bump_views(text) from public;
grant execute on function public.bump_views(text) to anon, authenticated;
