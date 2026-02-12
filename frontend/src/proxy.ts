import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // This is now a lightweight proxy.
  // The authentication logic has been moved to a different part of the application.
  
  const sessionCookie = request.cookies.get('better-auth.session_token');

  // Optimistic check. We don't validate the token here.
  // The data layer will handle validation.
  if (!sessionCookie) {
    // Even if the cookie is not present, we continue.
    // The UI will handle the unauthenticated state.
  }

  const response = NextResponse.next();
  response.headers.set('x-next-pathname', request.nextUrl.pathname);
  response.headers.set('x-next-url', request.url);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};