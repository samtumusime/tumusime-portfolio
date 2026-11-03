-- Run only after the approved Phase 1 migration has been applied.
-- Read-only verification: no settings, records, policies, or objects are changed.
-- The result is one row suitable for the Supabase SQL tool's explicit LIMIT requirement.

with policy_state as (
  select
    count(*) filter (
      where policyname in (
        'admin write profiles', 'admin write skills', 'admin write experience',
        'admin write projects', 'admin write certificates', 'admin write awards',
        'admin write cv', 'admin read media', 'admin write media',
        'admin read messages', 'admin manage messages', 'admin delete messages',
        'admin upload portfolio-media', 'admin update portfolio-media',
        'admin delete portfolio-media'
      )
    ) = 15 as expected_admin_policy_count,
    count(*) filter (
      where policyname in (
        'admin write profiles', 'admin write skills', 'admin write experience',
        'admin write projects', 'admin write certificates', 'admin write awards',
        'admin write cv', 'admin read media', 'admin write media',
        'admin read messages', 'admin manage messages', 'admin delete messages',
        'admin upload portfolio-media', 'admin update portfolio-media',
        'admin delete portfolio-media'
      )
      and coalesce(qual, '') || coalesce(with_check, '') not ilike '%portfolio_private.is_portfolio_admin%'
    ) = 0 as all_admin_policies_use_uid_helper,
    count(*) filter (
      where policyname in (
        'admin write profiles', 'admin write skills', 'admin write experience',
        'admin write projects', 'admin write certificates', 'admin write awards',
        'admin write cv', 'admin read media', 'admin write media',
        'admin read messages', 'admin manage messages', 'admin delete messages',
        'admin upload portfolio-media', 'admin update portfolio-media',
        'admin delete portfolio-media'
      )
      and roles @> array['authenticated']::name[]
    ) = 15 as admin_policies_target_authenticated_role,
    count(*) filter (
      where schemaname = 'public'
        and tablename in ('skill_groups','experience','projects','certificates','awards','cv_files')
        and policyname in (
          'public read published skills','public read published experience',
          'public read published projects','public read published certificates',
          'public read published awards','public read active cv'
        )
        and coalesce(qual, '') ilike '%portfolio_private.is_portfolio_admin%'
    ) = 6 as published_reads_preserve_owner_access
  from pg_policies
  where (schemaname = 'public' and tablename in (
    'profiles','skill_groups','experience','projects','certificates','awards',
    'cv_files','messages','media'
  )) or (schemaname = 'storage' and tablename = 'objects')
)
select
  policy_state.expected_admin_policy_count,
  policy_state.all_admin_policies_use_uid_helper,
  policy_state.admin_policies_target_authenticated_role,
  policy_state.published_reads_preserve_owner_access,
  position(
    'bf61502c-268f-43d9-bd8f-641758660adc'
    in pg_get_functiondef('portfolio_private.is_portfolio_admin()'::regprocedure)
  ) > 0 as expected_owner_uid_bound,
  not has_function_privilege('anon', 'public.rls_auto_enable()', 'EXECUTE') as anon_rpc_revoked,
  not has_function_privilege('authenticated', 'public.rls_auto_enable()', 'EXECUTE') as authenticated_rpc_revoked,
  (
    (select count(*) from public.profiles) +
    (select count(*) from public.skill_groups) +
    (select count(*) from public.experience) +
    (select count(*) from public.projects) +
    (select count(*) from public.certificates) +
    (select count(*) from public.awards) +
    (select count(*) from public.cv_files) +
    (select count(*) from public.messages) +
    (select count(*) from public.media)
  ) = 24 as application_row_count_preserved,
  (select count(*) from storage.objects where bucket_id = 'portfolio-media') = 6 as storage_object_count_preserved
from policy_state
limit 1;
