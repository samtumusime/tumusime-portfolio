-- PROPOSAL ONLY. Do not apply until the owner approves this exact production DB change.
-- Project: tumusime-portfolio (uxtikyfojssnbwdjzald)
-- This change does not insert/update/delete application rows or Storage objects.
-- It binds the existing CMS identity to the sole currently observed Auth user ID.

begin;

create schema if not exists portfolio_private;
revoke all on schema portfolio_private from public;
grant usage on schema portfolio_private to anon, authenticated;

create or replace function portfolio_private.is_portfolio_admin()
returns boolean
language sql
stable
security invoker
set search_path = pg_catalog
as $$
  select auth.uid() = 'bf61502c-268f-43d9-bd8f-641758660adc'::uuid;
$$;

revoke all on function portfolio_private.is_portfolio_admin() from public;
grant execute on function portfolio_private.is_portfolio_admin() to anon, authenticated;

-- Remove ambient authenticated-user write access; only the bound owner may manage CMS rows.
drop policy if exists "admin write profiles" on public.profiles;
create policy "admin write profiles" on public.profiles
  for all to authenticated
  using (portfolio_private.is_portfolio_admin())
  with check (portfolio_private.is_portfolio_admin());

drop policy if exists "admin write skills" on public.skill_groups;
create policy "admin write skills" on public.skill_groups
  for all to authenticated
  using (portfolio_private.is_portfolio_admin())
  with check (portfolio_private.is_portfolio_admin());

drop policy if exists "admin write experience" on public.experience;
create policy "admin write experience" on public.experience
  for all to authenticated
  using (portfolio_private.is_portfolio_admin())
  with check (portfolio_private.is_portfolio_admin());

drop policy if exists "admin write projects" on public.projects;
create policy "admin write projects" on public.projects
  for all to authenticated
  using (portfolio_private.is_portfolio_admin())
  with check (portfolio_private.is_portfolio_admin());

drop policy if exists "admin write certificates" on public.certificates;
create policy "admin write certificates" on public.certificates
  for all to authenticated
  using (portfolio_private.is_portfolio_admin())
  with check (portfolio_private.is_portfolio_admin());

drop policy if exists "admin write awards" on public.awards;
create policy "admin write awards" on public.awards
  for all to authenticated
  using (portfolio_private.is_portfolio_admin())
  with check (portfolio_private.is_portfolio_admin());

drop policy if exists "admin write cv" on public.cv_files;
create policy "admin write cv" on public.cv_files
  for all to authenticated
  using (portfolio_private.is_portfolio_admin())
  with check (portfolio_private.is_portfolio_admin());

drop policy if exists "admin read media" on public.media;
create policy "admin read media" on public.media
  for select to authenticated
  using (portfolio_private.is_portfolio_admin());

drop policy if exists "admin write media" on public.media;
create policy "admin write media" on public.media
  for all to authenticated
  using (portfolio_private.is_portfolio_admin())
  with check (portfolio_private.is_portfolio_admin());

drop policy if exists "admin read messages" on public.messages;
create policy "admin read messages" on public.messages
  for select to authenticated
  using (portfolio_private.is_portfolio_admin());

drop policy if exists "admin manage messages" on public.messages;
create policy "admin manage messages" on public.messages
  for update to authenticated
  using (portfolio_private.is_portfolio_admin())
  with check (portfolio_private.is_portfolio_admin());

drop policy if exists "admin delete messages" on public.messages;
create policy "admin delete messages" on public.messages
  for delete to authenticated
  using (portfolio_private.is_portfolio_admin());

-- Draft/unpublished rows remain visible to the public only when published; the owner can see all.
drop policy if exists "public read published skills" on public.skill_groups;
create policy "public read published skills" on public.skill_groups
  for select to anon, authenticated
  using (is_published = true or portfolio_private.is_portfolio_admin());

drop policy if exists "public read published experience" on public.experience;
create policy "public read published experience" on public.experience
  for select to anon, authenticated
  using (is_published = true or portfolio_private.is_portfolio_admin());

drop policy if exists "public read published projects" on public.projects;
create policy "public read published projects" on public.projects
  for select to anon, authenticated
  using (is_published = true or portfolio_private.is_portfolio_admin());

drop policy if exists "public read published certificates" on public.certificates;
create policy "public read published certificates" on public.certificates
  for select to anon, authenticated
  using (is_published = true or portfolio_private.is_portfolio_admin());

drop policy if exists "public read published awards" on public.awards;
create policy "public read published awards" on public.awards
  for select to anon, authenticated
  using (is_published = true or portfolio_private.is_portfolio_admin());

drop policy if exists "public read active cv" on public.cv_files;
create policy "public read active cv" on public.cv_files
  for select to anon, authenticated
  using (is_active = true or portfolio_private.is_portfolio_admin());

-- Storage uploads, updates and deletes are restricted to the same owner identity.
drop policy if exists "admin upload portfolio-media" on storage.objects;
create policy "admin upload portfolio-media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'portfolio-media' and portfolio_private.is_portfolio_admin());

drop policy if exists "admin update portfolio-media" on storage.objects;
create policy "admin update portfolio-media" on storage.objects
  for update to authenticated
  using (bucket_id = 'portfolio-media' and portfolio_private.is_portfolio_admin())
  with check (bucket_id = 'portfolio-media' and portfolio_private.is_portfolio_admin());

drop policy if exists "admin delete portfolio-media" on storage.objects;
create policy "admin delete portfolio-media" on storage.objects
  for delete to authenticated
  using (bucket_id = 'portfolio-media' and portfolio_private.is_portfolio_admin());

-- Remove unnecessary public RPC execution on the event-trigger helper; retain the trigger/function.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

commit;
