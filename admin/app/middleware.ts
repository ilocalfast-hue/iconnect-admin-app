import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin'; // Corrected import path

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

    // If the user is an admin and tries to access a non-admin page, you might want to redirect them to admin
    // Or just let them proceed. For now, we'll just protect the /admin routes.
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
