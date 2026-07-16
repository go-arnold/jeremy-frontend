import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { extractErrorMessage } from '@/lib/api-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://art-du-kivu-api.kelor.tech';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = await fetch(`${API_URL}/api/v1/auth/me/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
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
      console.error(`Auth Me API Error (${response.status}):`, data);
      const cleanMessage = extractErrorMessage(data);
      return NextResponse.json({ message: cleanMessage, ...data }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Auth Me Route Fatal Error:', error);
    return NextResponse.json({ 
      message: 'Impossible de contacter le serveur d\'authentification',
      error: error.message 
    }, { status: 500 });
  }
}
