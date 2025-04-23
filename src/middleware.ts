import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const path = url.pathname;
  const hasAccessToken = request.cookies.has('accessToken') &&
    request.cookies.get('accessToken')?.value;
  // const isPublicRoute = path === '/auth' || path.includes('auth');

  // if (!hasAccessToken && !isPublicRoute) {
  //   url.pathname = '/auth';
  //   return NextResponse.redirect(url);
  // }

  // if (hasAccessToken && isPublicRoute) {
  //   url.pathname = '/dashboard';
  //   return NextResponse.redirect(url);
  // }
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/app/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};