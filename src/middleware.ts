import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const path = url.pathname;
  const hasAccessToken = request.cookies.has('accessToken') &&
    request.cookies.get('accessToken')?.value;
  const isPublicRoute = path === '/sign-in' || path.includes('sign-up');

  if (!hasAccessToken && !isPublicRoute) {
    url.pathname = '/sign-in';
    return NextResponse.redirect(url);
  }

  if (hasAccessToken && isPublicRoute) {
    url.pathname = '/seller/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/app/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};