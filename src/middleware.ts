import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const path = url.pathname;
  const hasAccessToken = request.cookies.has('accessToken') &&
    request.cookies.get('accessToken')?.value;
  
  const publicRoutes = ['/auth/login', '/auth/register'];
  const isPublicRoute = publicRoutes.includes(path);

  if (!hasAccessToken && !isPublicRoute && !path.startsWith('/api/')) {
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  // if (hasAccessToken && isPublicRoute) {
  //   url.pathname = '/dashboard';
  //   return NextResponse.redirect(url);
  // }
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/app/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};