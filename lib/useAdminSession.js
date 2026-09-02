'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

// Client-side guard: redirects to /login if the session disappears
// (e.g. token expired) while the admin is sitting on a page.
// The real authorization boundary is middleware.js + RLS — this is just UX.
export function useAdminSession() {
  const [user, setUser] = useState(undefined); // undefined = loading
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user || null);
      if (!data.user) router.replace('/login');
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
        router.replace('/login');
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [router]);

  return user;
}
