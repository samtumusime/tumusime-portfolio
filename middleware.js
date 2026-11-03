import { NextResponse } from 'next/server';
import { createMiddlewareClient } from '@/lib/supabase/middleware';
import { safeAdminRedirect } from '@/lib/auth/safeRedirect.mjs';

function applyPrivateHeaders(headers) {
  headers.set('Cache-Control', 'private, no-store, max-age=0');
  headers.set('Pragma', 'no-cache');
  headers.set('X-Robots-Tag', 'noindex, nofollow');
  headers.set('Referrer-Policy', 'no-referrer');
}

function redirectWithSessionCookies(url, response) {
  const headers = new Headers(response.headers);
  headers.delete('x-middleware-next');
  headers.set('location', url.toString());
  applyPrivateHeaders(headers);
  return new NextResponse(null, { status: 307, headers });
}

export async function middleware(request) {
  const { supabase, getResponse } = createMiddlewareClient(request);

  let user = null;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (!error) user = data.user;
  } catch {
    // Fail closed: an Auth verification outage must never grant admin access.
  }

  const response = getResponse();
  applyPrivateHeaders(response.headers);

  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
  const isLoginRoute = pathname === '/login';
  const isPasswordUpdateRoute = pathname === '/update-password';

  const adminUserId = process.env.ADMIN_USER_ID?.trim();
  const isAuthorizedAdmin = Boolean(user && adminUserId && user.id === adminUserId);

  if ((isAdminRoute || isPasswordUpdateRoute) && !isAuthorizedAdmin) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.search = '';
    loginUrl.searchParams.set(
      'next',
      safeAdminRedirect(`${pathname}${request.nextUrl.search}`)
    );
    return redirectWithSessionCookies(loginUrl, response);
  }

  if (isLoginRoute && isAuthorizedAdmin) {
    return redirectWithSessionCookies(new URL('/admin', request.url), response);
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/login',
    '/forgot-password',
    '/update-password',
    '/auth/callback',
  ],
};
