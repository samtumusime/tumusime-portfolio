-- =====================================================================
-- Storage buckets for the portfolio.
-- Run after schema.sql. All buckets are public-READ (so images/PDFs can
-- be shown on the public site) but writes are restricted to the admin.
-- =====================================================================

insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do nothing;

-- Public read for anyone (files are served by public URL on the site)
drop policy if exists "public read portfolio-media" on storage.objects;
create policy "public read portfolio-media"
  on storage.objects for select
  using (bucket_id = 'portfolio-media');

-- Only the authenticated admin may upload
drop policy if exists "admin upload portfolio-media" on storage.objects;
create policy "admin upload portfolio-media"
  on storage.objects for insert
  with check (bucket_id = 'portfolio-media' and auth.role() = 'authenticated');

-- Only the authenticated admin may update/replace files
drop policy if exists "admin update portfolio-media" on storage.objects;
create policy "admin update portfolio-media"
  on storage.objects for update
  using (bucket_id = 'portfolio-media' and auth.role() = 'authenticated')
  with check (bucket_id = 'portfolio-media' and auth.role() = 'authenticated');

-- Only the authenticated admin may delete files
drop policy if exists "admin delete portfolio-media" on storage.objects;
create policy "admin delete portfolio-media"
  on storage.objects for delete
  using (bucket_id = 'portfolio-media' and auth.role() = 'authenticated');
