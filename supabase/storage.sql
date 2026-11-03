-- =====================================================================
-- Storage bucket for portfolio files.
-- Run after schema.sql. Public reads remain available for existing URLs;
-- writes are restricted to the owner UUID checked by schema.sql.
-- =====================================================================

insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do nothing;

-- Public read for anyone (files are served by public URL on the site)
drop policy if exists "public read portfolio-media" on storage.objects;
create policy "public read portfolio-media"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'portfolio-media');

-- Only the authenticated admin may upload
drop policy if exists "admin upload portfolio-media" on storage.objects;
create policy "admin upload portfolio-media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'portfolio-media' and portfolio_private.is_portfolio_admin());

-- Only the authenticated admin may update/replace files
drop policy if exists "admin update portfolio-media" on storage.objects;
create policy "admin update portfolio-media"
  on storage.objects for update to authenticated
  using (bucket_id = 'portfolio-media' and portfolio_private.is_portfolio_admin())
  with check (bucket_id = 'portfolio-media' and portfolio_private.is_portfolio_admin());

-- Only the authenticated admin may delete files
drop policy if exists "admin delete portfolio-media" on storage.objects;
create policy "admin delete portfolio-media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'portfolio-media' and portfolio_private.is_portfolio_admin());
