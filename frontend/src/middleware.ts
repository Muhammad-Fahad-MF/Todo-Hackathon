import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function getSessionCookie(request: NextRequest): string | undefined {
  // Check for both standard and secure cookie names
  const sessionCookie = request.cookies.get('better-auth.session_token') || 
                        request.cookies.get('__Secure-better-auth.session_token');
  return sessionCookie?.value;
}

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  // DEBUG: Log cookies to Vercel logs to see what's actually present
  console.log(`[Middleware] Path: ${request.nextUrl.pathname}`);
  console.log(`[Middleware] Cookies present: ${request.cookies.getAll().map(c => c.name).join(', ')}`);
  console.log(`[Middleware] Session found: ${!!sessionCookie}`);

  const protectedRoutes = ['/dashboard']; 

  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !sessionCookie) {
    console.log(`[Middleware] Redirecting to login from ${request.nextUrl.pathname}`);
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const authRoutes = ['/login', '/signup'];
  const isAuthRoute = authRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isAuthRoute && sessionCookie) {
    console.log(`[Middleware] Redirecting to dashboard from ${request.nextUrl.pathname}`);
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};