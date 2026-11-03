import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { safeRecoveryRedirect } from '@/lib/auth/safeRedirect.mjs';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/forgot-password', requestUrl.origin));
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(new URL('/forgot-password', requestUrl.origin));
    }

    const destination = safeRecoveryRedirect(requestUrl.searchParams.get('next'));
    return NextResponse.redirect(new URL(destination, requestUrl.origin));
  } catch {
    return NextResponse.redirect(new URL('/forgot-password', requestUrl.origin));
  }
}
