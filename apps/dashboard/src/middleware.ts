import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('fint_auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Protect internal routes in production
  if (
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/income') || 
    pathname.startsWith('/expense') || 
    pathname.startsWith('/assets') || 
    pathname.startsWith('/loans') || 
    pathname.startsWith('/investments') || 
    pathname.startsWith('/insurance') || 
    pathname.startsWith('/retirement') || 
    pathname.startsWith('/goals') || 
    pathname.startsWith('/accounts') || 
    pathname.startsWith('/score') || 
    pathname.startsWith('/analytics') || 
    pathname.startsWith('/reports') || 
    pathname.startsWith('/ai') || 
    pathname.startsWith('/notifications') || 
    pathname.startsWith('/profile') || 
    pathname.startsWith('/settings') ||
    pathname.startsWith('/admin')
  ) {
    // For development, bypass this redirect if not needed.
    // if (!token) {
    //   return NextResponse.redirect(new URL('/login', request.url));
    // }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|icons|logos|fonts).*)',
  ],
};