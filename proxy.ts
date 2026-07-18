import { NextRequest, NextResponse } from 'next/server';

// Next.js 16 request-interception convention (formerly `middleware.ts`) — unrelated to
// app/api/proxy/route.ts, which is this project's own backend API proxy. Naming collision is
// just Next's own terminology, not a code relationship between the two files.
const PROTECTED_PREFIXES = ['/mon-profil'];

/**
 * Server-side gate for authenticated routes. Without this, a protected page like /mon-profil was
 * only guarded client-side (useEffect + redirect), so its HTML/JS shipped to the browser before
 * any auth check ran. This only checks cookie *presence* (cheap, no network call) — the actual
 * token validity/refresh is still handled by /api/auth/me and /api/proxy, which redirect the
 * client to /auth/login themselves if the session turns out to be invalid.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (!isProtected) return NextResponse.next();

  const hasSession = Boolean(
    request.cookies.get('access_token')?.value || request.cookies.get('refresh_token')?.value
  );

  if (!hasSession) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/mon-profil/:path*'],
};
