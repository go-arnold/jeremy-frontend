import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://art-du-kivu-api.kelor.tech';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
      return NextResponse.json({ detail: 'Authentification requise', code: 'not_authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { context } = body;

    if (!context) {
      return NextResponse.json({ detail: 'Le champ context est requis', code: 'bad_request' }, { status: 400 });
    }

    const response = await fetch(`${API_URL}/api/v1/media/upload-signature/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ context }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { detail: data.detail || data.message || 'Erreur lors de la demande de signature', code: 'upload_error' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Upload signature error:', err);
    return NextResponse.json({ detail: 'Erreur serveur', code: 'server_error' }, { status: 500 });
  }
}