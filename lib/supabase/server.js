import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const cookieOptions = {
  path: '/',
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
};

// Server-side client is bound to the incoming request's cookies and only uses
// the public anon key. RLS remains the database authorization boundary.
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookieOptions,
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
            // Middleware refreshes the session instead.
          }
        },
      },
    }
  );
}
