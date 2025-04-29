import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ["/", "/about", "/products", "/contact"];
const authRoutes = ["/auth/login", "/auth/register", "/auth/forgot-password"];

export function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const hasAccessToken = request.cookies.has("accessToken");
  const isPublicRoute = publicRoutes.includes(url.pathname);
  const isAuthRoute = authRoutes.includes(url.pathname);

  if (!hasAccessToken && !isPublicRoute && !isAuthRoute) {
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/app/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};