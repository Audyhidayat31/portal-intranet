import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('perpusnas_token')?.value;
  const { pathname } = request.nextUrl;

  // Static files and internal API routes bypass
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  let userPayload: { userId: string; role: string } | null = null;
  if (token) {
    try {
      // Decode JWT payload in edge middleware
      const base64Url = token.split('.')[1];
      if (base64Url) {
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        userPayload = JSON.parse(jsonPayload);
      }
    } catch {
      userPayload = null;
    }
  }

  // 1. Root path always redirects to /login
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. If trying to access /admin without being an Administrator
  if (pathname.startsWith('/admin')) {
    if (!userPayload) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (userPayload.role !== 'ADMINISTRATOR') {
      return NextResponse.redirect(new URL('/beranda', request.url));
    }
  }

  // 3. If trying to access protected portal pages without login
  const protectedPortalPaths = [
    '/beranda',
    '/kabar-kedinasan',
    '/antar-pegawai',
    '/kupas-sosok',
    '/profil',
  ];

  const isProtectedPath = protectedPortalPaths.some((p) => pathname.startsWith(p));
  if (isProtectedPath && !userPayload) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
