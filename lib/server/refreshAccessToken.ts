const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://art-du-kivu-api.kelor.tech';

import type { NextResponse } from 'next/server';

export interface RefreshedTokens {
  access: string;
  refresh: string | null;
}

/** Applies a refreshed access (and, if rotated, refresh) token onto an outgoing response's
 * cookies — shared by every route that can trigger a mid-request token refresh. */
export function applyRefreshedTokenCookies(res: NextResponse, refreshed: RefreshedTokens) {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookies.set('access_token', refreshed.access, {
    httpOnly: true, secure: isProd, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24,
  });
  if (refreshed.refresh) {
    res.cookies.set('refresh_token', refreshed.refresh, {
      httpOnly: true, secure: isProd, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7,
    });
  }
}

/**
 * Exchanges the refresh_token cookie for a new access token.
 *
 * The access JWT eventually expires (1 day, per SIMPLE_JWT.ACCESS_TOKEN_LIFETIME), but nothing
 * in this codebase ever called `POST /auth/token/refresh/` before — every session silently
 * logged itself out once the token expired, even though a 7-day refresh_token was sitting right
 * there in a cookie, unused. Callers (the proxy route, `/api/auth/me`) should call this on a
 * 401, retry once with the new access token, and set BOTH tokens back onto their own response's
 * cookies — `ROTATE_REFRESH_TOKENS`/`BLACKLIST_AFTER_ROTATION` are both on server-side, so the
 * old refresh_token is invalidated the moment it's used and the new one must replace it or the
 * *next* refresh attempt will fail. This helper does not touch cookies itself since a request
 * handler's incoming `cookies()` is read-only; only the outgoing `NextResponse` can set them.
 */
export async function refreshAccessToken(refreshToken: string | undefined): Promise<RefreshedTokens | null> {
  if (!refreshToken) return null;
  try {
    const response = await fetch(`${API_URL}/api/v1/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const data = await response.json().catch(() => ({}));
    if (!data.access) return null;
    return { access: data.access, refresh: data.refresh || null };
  } catch {
    return null;
  }
}
