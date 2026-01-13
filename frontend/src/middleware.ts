import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'better-auth.session_token'; // Default Better-Auth session cookie name

function getSessionCookie(request: NextRequest): string | undefined {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  return sessionCookie?.value;
}

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  const protectedRoutes = ['/dashboard']; 

  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !sessionCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const authRoutes = ['/login', '/signup'];
  const isAuthRoute = authRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
