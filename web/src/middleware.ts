// middleware.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { errorHandlerMiddleware } from './middleware/error';
import { loggerMiddleware } from './middleware/logger';
import { admin_middleware } from './middleware/admin';
import { user_middleware } from './middleware/user';

// Middleware for route protection
export function middleware(req: NextRequest) {
  try {
    // Apply logging for all requests
    loggerMiddleware(req);

    user_middleware(req)

    // Only apply admin check for /admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
      return admin_middleware(req);
    }

    return NextResponse.next();
  } catch (error) {
    return errorHandlerMiddleware(req);
  }
}


export function authenticate(req: NextRequest) {
  const token =
    req.cookies.get('__Secure-next-auth.session-token')?.value ||
    req.cookies.get('next-auth.session-token')?.value;

  if (!token) {
    const loginUrl = new URL('/auth/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Apply this middleware only to /admin routes
export const config = {
  matcher: ['/admin/:path*', '/cart/:path*', ],
};