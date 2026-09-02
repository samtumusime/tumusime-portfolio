-- =====================================================================
-- Tumusime Sam Portfolio — Supabase schema
-- Run this once in the Supabase SQL editor (or via `supabase db push`).
-- Safe to re-run: uses "if not exists" / "or replace" where possible.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- profiles  (single row: the public "About" content)
-- ---------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null default '',
  headline text not null default '',
  bio text not null default '',
  email text,
  linkedin_url text,
  github_url text,
  location text,
  focus_areas text[] not null default '{}',
  hero_labels text[] not null default '{}',
  portrait_url text,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- skills  (grouped skill categories, each with a list of items)
-- ---------------------------------------------------------------------
create table if not exists skill_groups (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  items text[] not null default '{}',
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- experience (timeline entries)
-- ---------------------------------------------------------------------
create table if not exists experience (
  id uuid primary key default gen_random_uuid(),
  organization text not null,
  position text not null,
  date_range text not null,
  description text not null default '',
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default '',
  description text not null default '',
  technologies text[] not null default '{}',
  image_url text,
  github_url text,
  live_url text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- certificates
-- ---------------------------------------------------------------------
create table if not exists certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null default '',
  issue_date text,
  credential_id text,
  credential_url text,
  category text not null default 'other',
  description text not null default '',
  file_url text,
  image_url text,
  sort_order integer not null default 0,
  is_featured boolean not null default false,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table certificates
  add column if not exists is_featured boolean not null default false;

-- ---------------------------------------------------------------------
-- awards
-- ---------------------------------------------------------------------
create table if not exists awards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  organization text not null default '',
  award_date text,
  description text not null default '',
  image_url text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- cv_files  (versioned CV/resume uploads; only one is "active" at a time)
-- ---------------------------------------------------------------------
create table if not exists cv_files (
  id uuid primary key default gen_random_uuid(),
  label text not null default 'CV',
  file_url text not null,
  file_name text,
  is_active boolean not null default false,
  uploaded_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- messages  (contact form submissions)
-- ---------------------------------------------------------------------
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- media  (general file/image library metadata)
-- ---------------------------------------------------------------------
create table if not exists media (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  file_url text not null,
  file_type text,
  size_bytes bigint,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Helpful indexes
-- ---------------------------------------------------------------------
create index if not exists idx_projects_published on projects (is_published, sort_order);
create index if not exists idx_certificates_published on certificates (is_published, sort_order);
create index if not exists idx_certificates_category on certificates (category);
create index if not exists idx_awards_published on awards (is_published, sort_order);
create index if not exists idx_skill_groups_published on skill_groups (is_published, sort_order);
create index if not exists idx_experience_published on experience (is_published, sort_order);
create index if not exists idx_messages_created on messages (created_at desc);

-- ---------------------------------------------------------------------
-- Row Level Security
-- Public (anon) role: read-only, and only rows marked published.
-- Authenticated role: full read/write. The admin dashboard signs in with
-- Supabase Auth, so "authenticated" effectively means "the admin", since
-- this project only ever creates one auth user (see ADMIN_EMAIL).
-- Contact messages: anyone can INSERT (submit the form), only the admin
-- can SELECT/UPDATE/DELETE (read/manage) them.
-- ---------------------------------------------------------------------

alter table profiles enable row level security;
alter table skill_groups enable row level security;
alter table experience enable row level security;
alter table projects enable row level security;
alter table certificates enable row level security;
alter table awards enable row level security;
alter table cv_files enable row level security;
alter table messages enable row level security;
alter table media enable row level security;

-- profiles
drop policy if exists "public read profiles" on profiles;
create policy "public read profiles" on profiles for select using (true);
drop policy if exists "admin write profiles" on profiles;
create policy "admin write profiles" on profiles for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- skill_groups
drop policy if exists "public read published skills" on skill_groups;
create policy "public read published skills" on skill_groups for select using (is_published = true or auth.role() = 'authenticated');
drop policy if exists "admin write skills" on skill_groups;
create policy "admin write skills" on skill_groups for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- experience
drop policy if exists "public read published experience" on experience;
create policy "public read published experience" on experience for select using (is_published = true or auth.role() = 'authenticated');
drop policy if exists "admin write experience" on experience;
create policy "admin write experience" on experience for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- projects
drop policy if exists "public read published projects" on projects;
create policy "public read published projects" on projects for select using (is_published = true or auth.role() = 'authenticated');
drop policy if exists "admin write projects" on projects;
create policy "admin write projects" on projects for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- certificates
drop policy if exists "public read published certificates" on certificates;
create policy "public read published certificates" on certificates for select using (is_published = true or auth.role() = 'authenticated');
drop policy if exists "admin write certificates" on certificates;
create policy "admin write certificates" on certificates for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- awards
drop policy if exists "public read published awards" on awards;
create policy "public read published awards" on awards for select using (is_published = true or auth.role() = 'authenticated');
drop policy if exists "admin write awards" on awards;
create policy "admin write awards" on awards for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- cv_files
drop policy if exists "public read active cv" on cv_files;
create policy "public read active cv" on cv_files for select using (is_active = true or auth.role() = 'authenticated');
drop policy if exists "admin write cv" on cv_files;
create policy "admin write cv" on cv_files for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- messages: public can submit, only admin can read/manage
drop policy if exists "anyone can submit messages" on messages;
create policy "anyone can submit messages" on messages for insert with check (true);
drop policy if exists "admin read messages" on messages;
create policy "admin read messages" on messages for select using (auth.role() = 'authenticated');
drop policy if exists "admin manage messages" on messages;
create policy "admin manage messages" on messages for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
drop policy if exists "admin delete messages" on messages;
create policy "admin delete messages" on messages for delete using (auth.role() = 'authenticated');

-- media: admin-only in both directions (it's a private file library)
drop policy if exists "admin read media" on media;
create policy "admin read media" on media for select using (auth.role() = 'authenticated');
drop policy if exists "admin write media" on media;
create policy "admin write media" on media for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Seed a single empty profile row if none exists yet, so the admin
-- "Profile/About" page always has one record to edit.
insert into profiles (full_name, headline, bio)
select '', '', ''
where not exists (select 1 from profiles);
