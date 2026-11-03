-- PROPOSAL ONLY. Use only if the owner approves a rollback after applying the matching migration.
-- Restores the policy expressions and exact function grants captured in security-baseline.json.
-- No application rows or Storage objects are inserted, updated, or deleted.

begin;

-- Restore the pre-change ACL, including its explicit role grants.
grant execute on function public.rls_auto_enable() to public, anon, authenticated, service_role;

-- Restore pre-change CMS and published-content policies.
drop policy if exists "admin write profiles" on public.profiles;
create policy "admin write profiles" on public.profiles
  for all using (auth.role() = 'authenticated'::text)
  with check (auth.role() = 'authenticated'::text);

drop policy if exists "admin write skills" on public.skill_groups;
create policy "admin write skills" on public.skill_groups
  for all using (auth.role() = 'authenticated'::text)
  with check (auth.role() = 'authenticated'::text);
drop policy if exists "public read published skills" on public.skill_groups;
create policy "public read published skills" on public.skill_groups
  for select using ((is_published = true) or (auth.role() = 'authenticated'::text));

drop policy if exists "admin write experience" on public.experience;
create policy "admin write experience" on public.experience
  for all using (auth.role() = 'authenticated'::text)
  with check (auth.role() = 'authenticated'::text);
drop policy if exists "public read published experience" on public.experience;
create policy "public read published experience" on public.experience
  for select using ((is_published = true) or (auth.role() = 'authenticated'::text));

drop policy if exists "admin write projects" on public.projects;
create policy "admin write projects" on public.projects
  for all using (auth.role() = 'authenticated'::text)
  with check (auth.role() = 'authenticated'::text);
drop policy if exists "public read published projects" on public.projects;
create policy "public read published projects" on public.projects
  for select using ((is_published = true) or (auth.role() = 'authenticated'::text));

drop policy if exists "admin write certificates" on public.certificates;
create policy "admin write certificates" on public.certificates
  for all using (auth.role() = 'authenticated'::text)
  with check (auth.role() = 'authenticated'::text);
drop policy if exists "public read published certificates" on public.certificates;
create policy "public read published certificates" on public.certificates
  for select using ((is_published = true) or (auth.role() = 'authenticated'::text));

drop policy if exists "admin write awards" on public.awards;
create policy "admin write awards" on public.awards
  for all using (auth.role() = 'authenticated'::text)
  with check (auth.role() = 'authenticated'::text);
drop policy if exists "public read published awards" on public.awards;
create policy "public read published awards" on public.awards
  for select using ((is_published = true) or (auth.role() = 'authenticated'::text));

drop policy if exists "admin write cv" on public.cv_files;
create policy "admin write cv" on public.cv_files
  for all using (auth.role() = 'authenticated'::text)
  with check (auth.role() = 'authenticated'::text);
drop policy if exists "public read active cv" on public.cv_files;
create policy "public read active cv" on public.cv_files
  for select using ((is_active = true) or (auth.role() = 'authenticated'::text));

drop policy if exists "admin read media" on public.media;
create policy "admin read media" on public.media
  for select using (auth.role() = 'authenticated'::text);
drop policy if exists "admin write media" on public.media;
create policy "admin write media" on public.media
  for all using (auth.role() = 'authenticated'::text)
  with check (auth.role() = 'authenticated'::text);

drop policy if exists "admin read messages" on public.messages;
create policy "admin read messages" on public.messages
  for select using (auth.role() = 'authenticated'::text);
drop policy if exists "admin manage messages" on public.messages;
create policy "admin manage messages" on public.messages
  for update using (auth.role() = 'authenticated'::text)
  with check (auth.role() = 'authenticated'::text);
drop policy if exists "admin delete messages" on public.messages;
create policy "admin delete messages" on public.messages
  for delete using (auth.role() = 'authenticated'::text);

-- Restore Storage owner policies. Public-read remains as originally configured.
drop policy if exists "admin upload portfolio-media" on storage.objects;
create policy "admin upload portfolio-media" on storage.objects
  for insert with check ((bucket_id = 'portfolio-media'::text) and (auth.role() = 'authenticated'::text));
drop policy if exists "admin update portfolio-media" on storage.objects;
create policy "admin update portfolio-media" on storage.objects
  for update using ((bucket_id = 'portfolio-media'::text) and (auth.role() = 'authenticated'::text))
  with check ((bucket_id = 'portfolio-media'::text) and (auth.role() = 'authenticated'::text));
drop policy if exists "admin delete portfolio-media" on storage.objects;
create policy "admin delete portfolio-media" on storage.objects
  for delete using ((bucket_id = 'portfolio-media'::text) and (auth.role() = 'authenticated'::text));

-- The migration creates this dedicated schema only after confirming it is absent.
drop function if exists portfolio_private.is_portfolio_admin();
drop schema portfolio_private;

commit;
