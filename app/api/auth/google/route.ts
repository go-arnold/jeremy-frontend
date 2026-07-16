import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://art-du-kivu-api.kelor.tech';

/**
 * POST handler for Google OAuth.
 * Client sends the Google ID token obtained via the GSI popup (`useGoogleAuth`), duplicated
 * into both `access_token` and `id_token`. This route forwards both to the backend (same-origin
 * proxy, no CORS). Backend endpoint: POST /api/v1/auth/google/ — dj-rest-auth's
 * SocialLoginSerializer requires `access_token` present to pass validation at all, but only
 * takes the no-network-roundtrip JWT verification path when `id_token` is also present;
 * omitting `id_token` makes it treat the JWT as an opaque OAuth token and call Google's userinfo
 * endpoint with it, which Google rejects.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { access_token, id_token } = body;

    if (!access_token || !id_token) {
      return NextResponse.json({ detail: 'Missing access_token or id_token' }, { status: 400 });
    }

    const payload = { access_token, id_token };

    const response = await fetch(`${API_URL}/api/v1/auth/google/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const contentType = response.headers.get('content-type');
    let data: any = {};

    if (contentType && contentType.includes('application/json')) {
      data = await response.json().catch(() => ({}));
    }

    if (!response.ok) {
      console.error('Google OAuth backend error:', response.status, data);
      return NextResponse.json(
        { detail: data.detail || data.message || data.error || 'google_auth_failed' },
        { status: response.status }
      );
    }

    // data should contain access & refresh tokens
    const accessToken = data.access || data.access_token;
    const refreshToken = data.refresh || data.refresh_token;
    const user = data.user || null;

    if (!accessToken) {
      return NextResponse.json({ detail: 'no_token' }, { status: 400 });
    }

    const res = NextResponse.json({ user, access: accessToken, refresh: refreshToken });

    res.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    if (refreshToken) {
      res.cookies.set('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return res;
  } catch (err: any) {
    console.error('Google OAuth route error:', err);
    return NextResponse.json({ detail: 'server_error' }, { status: 500 });
  }
}
