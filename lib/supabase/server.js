import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Server-side Supabase client bound to the incoming request's cookies,
// so it knows whether the visitor is an authenticated admin.
// Still only ever uses the anon key — RLS decides what it can see/do.
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component with no response to write to.
            // Safe to ignore — middleware refreshes the session instead.
          }
        },
      },
    }
  );
}

// Admin-only client using the service role key. NEVER import this into any
// file that is bundled for the browser — it must only be used inside
// server actions / route handlers, and only after verifying the caller is
// the authenticated admin.
export function createServiceRoleClient() {
  const { createClient: createSupabaseClient } = require('@supabase/supabase-js');
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
