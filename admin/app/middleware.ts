import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../lib/firebase-admin'; // Corrected import path

export async function middleware(request: NextRequest) {
  const idToken = request.cookies.get('idToken')?.value;

  if (!idToken) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // It's better to use the Firebase Admin SDK on the server-side for token verification
    // I'll assume you have a firebase-admin setup in `lib/firebase-admin.ts`
    const decodedToken = await auth.verifyIdToken(idToken);

    if (decodedToken.admin !== true) {
      // If not an admin, redirect to the home page
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }

    if (request.nextUrl.pathname === '/admin') {
      const usersUrl = new URL('/admin/users', request.url);
      return NextResponse.redirect(usersUrl);
    }

    return NextResponse.next();
  } catch (error) {
    // If token is invalid, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'session-expired');
    const response = NextResponse.redirect(loginUrl);
    // Clear the invalid cookie
    response.cookies.delete('idToken');
    return response;
  }
}

// Match all paths under /admin
export const config = {
  matcher: '/admin/:path*',
};
