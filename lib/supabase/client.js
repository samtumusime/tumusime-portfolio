'use client';

import { createBrowserClient } from '@supabase/ssr';

// Client-safe Supabase instance. Only ever uses the public URL + anon key.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
