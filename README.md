# Tumusime Sam — Portfolio + Admin Dashboard

A rebuild of your portfolio as a Next.js app with a real Supabase-backed CMS.
The public site and the `/admin` dashboard read and write the **same**
database — nothing is hardcoded, so anything you publish in the dashboard
appears on the live site immediately, and unpublishing/deleting removes it
just as immediately.

## What's inside

- **Public site** (`app/page.js` + `components/public/*`) — hero with your
  cutout portrait, about, skills, experience, projects, certificates
  (search + filter + modal), awards, and a working contact form. All content
  is fetched live from Supabase; nothing is invented or hardcoded, including
  the stat counters (they're computed from your real row counts).
- **Admin dashboard** (`app/admin/*`) — protected by Supabase Auth. Sections:
  Overview, Projects, Certificates, Awards, Skills, Experience, CV,
  Profile/About, Messages, Media, Settings. Every list supports
  create/edit/delete/publish-unpublish/reorder, with confirmation on delete,
  loading states, and empty states.
- **Database** (`supabase/schema.sql`, `supabase/storage.sql`) — 9 tables
  with Row Level Security. The live project now binds CMS access to the
  approved owner UID; the versioned migration and read-only post-check are
  recorded below. The local authentication UI/middleware patch is not deployed.

## 1. Connect the existing Supabase project

Use the existing project for this portfolio. Do not create a replacement
project or point this redesign at a new empty database. In **Project Settings
→ API**, use the existing Project URL and anon/publishable key. Do not copy or
expose a service-role key; the current CMS uses the public key with RLS.

## 2. Database scripts and migration status

`supabase/schema.sql` and `supabase/storage.sql` are setup scripts for a fresh
database; do not rerun them against the existing live project as part of this
redesign. The live database already contains records and Storage objects.
The owner-UID policy change was applied to the existing live project on
2026-10-30 and passed its read-only post-check. It is versioned at
`supabase/migrations/20261030145944_admin_identity_rls_hardening.sql`, matching
the version recorded in live Supabase, with a
companion rollback at `supabase/rollbacks/20261030_admin_identity_rls_hardening.sql`.
Do not rerun setup scripts or this migration against the live project.

The helper in `schema.sql` is bound to this portfolio's current Auth user UUID.
If these setup scripts are deliberately used with a different project, replace
that UUID with the intended owner's Auth UID and set the same value in
`ADMIN_USER_ID`.
The post-check is available at `supabase/verification/phase1_security_postcheck.sql`
for verification in any separately configured environment.

## 3. Confirm the existing admin account

Use the existing owner account in **Authentication → Users** for this
project; do not create a duplicate account. Record that account's stable UUID.
The live database policies are bound to the approved UUID. The revised
`ADMIN_USER_ID` middleware and password-recovery flow remain in the local
working copy and have not been deployed.

## 4. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the real values:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
ADMIN_USER_ID=...             # UUID of the existing owner account
```

`ADMIN_USER_ID` is an authorization identifier, not a credential. Only the
`NEXT_PUBLIC_*` variables are exposed client-side. Keep all privileged keys
out of browser code; the current application does not require a service-role
key.

## 5. Run it locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` for the public site and
`http://localhost:3000/login` to sign in to the dashboard.

## 6. Add your real content

The existing database contains the portfolio owner's records and files.
Preserve existing IDs and URLs; edit or add only authentic, owner-confirmed
content. Do not seed fictional projects, certificates, statistics, or experience.

1. **Profile / About** — name, bio, hero labels, focus tags, contact links,
   portrait (or leave the portrait field empty to keep using the bundled
   `public/assets/samu-cutout.png`).
2. **CV** — upload your CV PDF and mark it active.
3. **Projects / Certificates / Awards / Skills / Experience** — add your
   real entries. Anything left as "Draft" stays hidden from visitors.

Test the full loop once you've added something:
`Create in admin → appears on public site → edit in admin → public site
updates → unpublish/delete → disappears from public site.` This works
identically for every content type.

## 7. Deployment status

Cloudflare is the approved deployment target, but the repository does not yet
contain a validated Cloudflare Next.js adapter/runtime configuration. Cloudflare
compatibility, environment bindings, auth-cookie behavior, and preview smoke
tests are later implementation work. Do not deploy without the owner's approval.

## Security status (Phase 1)

- [x] RLS is enabled on the portfolio tables; published-content reads,
      profile reads, and public contact inserts remain part of the design.
- [x] Live CMS and Storage policies now require the approved owner UID;
      unpublished portfolio rows and the private inbox are owner-restricted.
- [x] Public/anon/authenticated execute access to the `SECURITY DEFINER`
      `rls_auto_enable()` RPC was revoked; the event trigger remains intact.
- [x] The revised `ADMIN_USER_ID` middleware, recovery callback and password
      update UI are committed on `security/auth-hardening`; they are not deployed.
- [ ] Before launch, configure Supabase Auth password strength to require at least
      16 characters plus lowercase, uppercase, digits and symbols. The UI mirrors
      these rules, but Supabase Auth must enforce them server-side.
- [ ] Add `https://about.samtumusime49.workers.dev/auth/callback` to Supabase
      Auth's redirect URL allowlist. Add any actual preview callback URLs only
      if preview deployments will be used, then test recovery.
- [ ] Run the production build and complete login, recovery, password-change,
      unauthorized-user and public-content smoke tests before merging/deploying.
- [x] The live contact inbox has no public read policy; anti-spam/rate limits
      remain a later security task.
- [ ] Leaked-password protection is currently disabled in Supabase Auth and
      needs separate project-setting action before launch.
- [x] No service-role credential is used by the current browser application.

## Known limitations / good next steps

- Deleting a file from the **Media** library removes the database record
  but not the underlying object in Supabase Storage (it stores public URLs,
  not storage paths). Low-risk since the bucket only holds portfolio assets,
  but worth cleaning up later if storage usage matters to you.
- Single-admin only, bound by Auth UUID. Changing the owner or adding editors
  requires a coordinated database policy and server-environment update.
- Image optimization uses plain `<img>` tags rather than `next/image` for
  Supabase-hosted images, to keep things simple across arbitrary storage
  paths. You can switch to `next/image` later using the `remotePatterns`
  already configured in `next.config.mjs`.
