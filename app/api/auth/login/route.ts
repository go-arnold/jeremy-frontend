import { NextResponse } from 'next/server';
import { extractErrorMessage } from '@/lib/api-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://art-du-kivu-api.kelor.tech';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${API_URL}/api/v1/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json().catch(() => ({}));
    } else {
      const text = await response.text().catch(() => 'No response body');
      data = { message: `Backend returned non-JSON response (${response.status})`, detail: text.substring(0, 200) };
    }

    if (!response.ok) {
      console.error(`Login API Error (${response.status}):`, data);
      const message = extractErrorMessage(data) || 'Identifiants incorrects';
      return NextResponse.json({ message, ...data }, { status: response.status });
    }

    // If the login response doesn't include the user, try to fetch it from the /me endpoint
    let user = data.user;
    if (!user && data.access) {
      try {
        const meResponse = await fetch(`${API_URL}/api/v1/auth/me/`, {
          headers: { 'Authorization': `Bearer ${data.access}` },
        });
        if (meResponse.ok) {
          const meData = await meResponse.json().catch(() => null);
          user = meData;
        }
      } catch (meError) {
        console.error('Failed to fetch user after login:', meError);
      }
    }

    const res = NextResponse.json({ user });

    // Set HttpOnly cookies on the response object
    res.cookies.set('access_token', data.access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });
    
    res.cookies.set('refresh_token', data.refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (error) {
    console.error('Login Route Error:', error);
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}
