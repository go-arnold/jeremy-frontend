import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { extractErrorMessage } from '@/lib/api-client';
import { refreshAccessToken, applyRefreshedTokenCookies, RefreshedTokens } from '@/lib/server/refreshAccessToken';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://art-du-kivu-api.kelor.tech';

export async function GET() {
  const cookieStore = await cookies();
  let token = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;
  let refreshed: RefreshedTokens | null = null;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const fetchMe = (authToken: string) =>
    fetch(`${API_URL}/api/v1/auth/me/`, {
      headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

  try {
    let response = await fetchMe(token);

    // Access token expired — this is the call AuthProvider fires on every page load, so
    // without a refresh attempt here every session silently logged itself out once it expired.
    if (response.status === 401 && refreshToken) {
      refreshed = await refreshAccessToken(refreshToken);
      if (refreshed) {
        token = refreshed.access;
        response = await fetchMe(token);
      }
    }

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json().catch(() => ({}));
    } else {
      const text = await response.text().catch(() => 'No response body');
      data = { message: `Backend returned non-JSON response (${response.status})`, detail: text.substring(0, 200) };
    }

    if (!response.ok) {
      console.error(`Auth Me API Error (${response.status}):`, data);
      const cleanMessage = extractErrorMessage(data);
      const errorRes = NextResponse.json({ message: cleanMessage, ...data }, { status: response.status });
      if (refreshed) applyRefreshedTokenCookies(errorRes, refreshed);
      return errorRes;
    }

    const res = NextResponse.json(data);
    if (refreshed) applyRefreshedTokenCookies(res, refreshed);
    return res;
  } catch (error: any) {
    console.error('Auth Me Route Fatal Error:', error);
    return NextResponse.json({
      message: 'Impossible de contacter le serveur d\'authentification',
      error: error.message
    }, { status: 500 });
  }
}
