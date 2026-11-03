import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { safeRecoveryRedirect } from '@/lib/auth/safeRedirect.mjs';

function privateRedirect(url) {
  const response = NextResponse.redirect(url);
  response.headers.set('Cache-Control', 'private, no-store, max-age=0');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Referrer-Policy', 'no-referrer');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const failureUrl = new URL('/forgot-password', requestUrl.origin);

  if (!code) return privateRedirect(failureUrl);

  try {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return privateRedirect(failureUrl);

    const destination = safeRecoveryRedirect(requestUrl.searchParams.get('next'));
    return privateRedirect(new URL(destination, requestUrl.origin));
  } catch {
    return privateRedirect(failureUrl);
  }
}
