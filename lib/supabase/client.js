'use client';

import { createBrowserClient } from '@supabase/ssr';

const cookieOptions = {
  path: '/',
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
};

// Client-safe Supabase instance. Only ever uses the public URL + anon key.
// HttpOnly is intentionally not set: this browser client must read its own session cookies.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookieOptions }
  );
}
