import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

const publicRoutes = [
  /^\/$/, // Matches the root path exactly
  /^\/login(\/.*)?$/, // Matches /login and any subpaths
  /^\/signup(\/.*)?$/, // Matches /signup and any subpaths
];

async function getSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  // Check for both standard and secure cookie names
  const sessionCookie = cookieStore.get('better-auth.session_token') || 
                        cookieStore.get('__Secure-better-auth.session_token');
  return sessionCookie?.value;
}

export async function AuthWrapper({ children }: { children: React.ReactNode }) {
  const headersList = await headers(); // Await the headers() function
  const pathname = headersList.get('x-next-pathname') || '';
  const requestUrl = headersList.get('x-next-url') || 'http://localhost:3000'; // Get the full URL from the proxy
  const sessionCookie = await getSessionCookie();

  const isPublicRoute = publicRoutes.some(regex => regex.test(pathname));
  
  // If there's a session, and the user is on the login/signup page, redirect to dashboard
  if (sessionCookie && (pathname.startsWith('/login') || pathname.startsWith('/signup'))) {
    redirect('/dashboard');
  }
  
  // If there's no session and the route is not public, redirect to login
  if (!sessionCookie && !isPublicRoute) {
    const loginUrl = new URL('/login', requestUrl); // Use the full request URL
    loginUrl.searchParams.set('redirect', pathname); // Keep track of where the user was going
    redirect(loginUrl.toString());
  }

  return <>{children}</>;
}
