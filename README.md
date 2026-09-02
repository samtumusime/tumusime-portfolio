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
  with Row Level Security: the public (anon) role can only ever read rows
  marked `is_published = true`; only the authenticated admin can write.

## 1. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) → New project.
2. In **Project Settings → API**, copy the **Project URL** and **anon public
   key** — you'll need them in step 3.
3. In **Project Settings → API**, also copy the **service_role** key (keep
   this secret — it's only used server-side, never in the browser).

## 2. Run the database setup

In the Supabase dashboard, open **SQL Editor** and run, in order:

1. `supabase/schema.sql` — creates all tables, indexes, and RLS policies.
2. `supabase/storage.sql` — creates the `portfolio-media` storage bucket and
   its policies (public read, admin-only write).

## 3. Create your admin account

In **Authentication → Users**, click **Add user** and create one user with
your real email and a strong password. This is the *only* account that will
ever be able to sign in to `/admin` — enforced both by middleware and by the
database RLS policies (not just by hiding the page).

## 4. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the real values:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_EMAIL=you@example.com   # must exactly match the email from step 3
```

`SUPABASE_SERVICE_ROLE_KEY` is never imported into any client-side code —
it exists only for potential future server-side admin operations, and is
never sent to the browser. Only `NEXT_PUBLIC_*` variables are exposed
client-side, which is expected and safe (the anon key is meant to be public;
RLS is what actually protects your data).

## 5. Run it locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` for the public site and
`http://localhost:3000/login` to sign in to the dashboard.

## 6. Add your real content

The database starts empty on purpose — no invented projects, certificates,
stats, or experience. Sign in to `/admin` and fill in, in this order for the
smoothest experience:

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

## 7. Deploy to Vercel

```bash
npm run build   # sanity check locally first
```

Then in Vercel: **New Project → import this repo**, and add the same four
environment variables from step 4 in **Project Settings → Environment
Variables**. Never commit `.env.local` — it's already gitignored.

## Security checklist (already implemented)

- [x] RLS enabled on every table; public role is read-only and
      published-only.
- [x] `/admin` protected by middleware checking a real Supabase session
      *and* that the session's email matches `ADMIN_EMAIL` — not just
      client-side hiding.
- [x] Storage bucket is public-read (needed to display images/PDFs) but
      write/update/delete are admin-only policies.
- [x] Service role key is never referenced from any file under
      `components/`, `app/**/page.js` client components, or anything sent
      to the browser.
- [x] Contact form: public can only `INSERT`, never read other people's
      messages.

## Known limitations / good next steps

- Deleting a file from the **Media** library removes the database record
  but not the underlying object in Supabase Storage (it stores public URLs,
  not storage paths). Low-risk since the bucket only holds portfolio assets,
  but worth cleaning up later if storage usage matters to you.
- Single-admin only, by design, per the original spec. If you ever want a
  second editor, add their email to an allow-list instead of the single
  `ADMIN_EMAIL` check in `middleware.js`.
- Image optimization uses plain `<img>` tags rather than `next/image` for
  Supabase-hosted images, to keep things simple across arbitrary storage
  paths. You can switch to `next/image` later using the `remotePatterns`
  already configured in `next.config.mjs`.
