import { NextResponse } from 'next/server';
import { createMiddlewareClient } from '@/lib/supabase/middleware';
import { safeAdminRedirect } from '@/lib/auth/safeRedirect.mjs';

function redirectWithSessionCookies(url, response) {
  const headers = new Headers(response.headers);
  headers.delete('x-middleware-next');
  headers.set('location', url.toString());
  return new NextResponse(null, { status: 307, headers });
}

export async function middleware(request) {
  const { supabase, response } = createMiddlewareClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
  const isLoginRoute = pathname.startsWith('/login');
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
  matcher: ['/admin/:path*', '/login', '/update-password'],
};
