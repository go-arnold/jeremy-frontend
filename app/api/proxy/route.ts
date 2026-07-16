import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { extractErrorMessage } from '@/lib/api-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://art-du-kivu-api.kelor.tech';

// Cache en mémoire pour les requêtes GET
const requestCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

/**
 * Détermine le TTL de cache basé sur l'endpoint
 */
function getCacheTTL(endpoint: string, method: string): number | null {
  // Pas de cache pour les mutations
  if (method !== 'GET' && method !== 'HEAD') {
    return null;
  }

  // Cache long pour les données statiques (5 minutes)
  if (endpoint.includes('/categories') || endpoint.includes('/cities') || endpoint.includes('/filters')) {
    return 5 * 60 * 1000;
  }

  // Cache moyen pour les listes (3 minutes)
  if (endpoint.includes('page_size') || endpoint.includes('?')) {
    return 3 * 60 * 1000;
  }

  // Cache court pour les détails (1 minute)
  return 60 * 1000;
}

export async function GET(request: Request) { return handleProxy(request); }
export async function POST(request: Request) { return handleProxy(request); }
export async function PUT(request: Request) { return handleProxy(request); }
export async function DELETE(request: Request) { return handleProxy(request); }

async function handleProxy(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');

  if (!endpoint) {
    return NextResponse.json({ message: 'Missing endpoint' }, { status: 400 });
  }

  const method = request.method;
  const cacheTTL = getCacheTTL(endpoint, method);

  // Vérifier la cache
  if (cacheTTL) {
    const cacheKey = `${method}:${endpoint}`;
    const cached = requestCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return NextResponse.json(cached.data, {
        status: 200,
        headers: {
          'X-Cache': 'HIT',
          'Cache-Control': 'public, max-age=60, must-revalidate',
        },
      });
    }
  }

  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Forward important headers from the client that might be needed by the backend
    // to generate correct URLs in emails (like Referer or Origin)
    const clientOrigin = request.headers.get('origin');
    const clientReferer = request.headers.get('referer');
    if (clientOrigin) headers['Origin'] = clientOrigin;
    if (clientReferer) headers['Referer'] = clientReferer;

    const options: RequestInit = {
      method: request.method,
      headers,
    };

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      const clientContentType = request.headers.get('content-type') || '';
      if (clientContentType.includes('multipart/form-data')) {
        // For multipart, override Content-Type with the original (includes boundary) 
        // and forward raw body as ArrayBuffer
        (headers as Record<string, string>)['Content-Type'] = clientContentType;
        options.body = await request.arrayBuffer();
      } else {
        options.body = await request.text();
      }
    }

    const fetchUrl = `${API_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    
    const response = await fetch(fetchUrl, {
      ...options,
      cache: 'no-store'
    });
    
    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json().catch(() => ({}));
    } else {
      const text = await response.text().catch(() => '');
      data = { message: text.length < 200 ? text : `Erreur ${response.status}: ${response.statusText}` };
    }

    if (!response.ok) {
      if (response.status === 400 || response.status === 401) {
        console.warn(`Proxy API Error (${response.status}) for ${endpoint}:`, data);
      }
      const cleanMessage = extractErrorMessage(data);
      return NextResponse.json({ message: cleanMessage, ...data }, { status: response.status });
    }

    // Stocker dans la cache
    if (cacheTTL) {
      const cacheKey = `${method}:${endpoint}`;
      requestCache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        ttl: cacheTTL,
      });

      // Nettoyer les entrées obsolètes tous les 100 appels
      if (requestCache.size > 100) {
        const now = Date.now();
        for (const [key, entry] of requestCache.entries()) {
          if (now - entry.timestamp > entry.ttl) {
            requestCache.delete(key);
          }
        }
      }
    }

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'X-Cache': cacheTTL ? 'MISS' : 'SKIP',
        'Cache-Control': cacheTTL ? 'public, max-age=60, must-revalidate' : 'no-store',
      },
    });
  } catch (error: any) {
    console.error('Proxy Fatal Error:', error);
    return NextResponse.json(
      { message: 'Le serveur est injoignable. Veuillez réessayer dans quelques instants.' }, 
      { status: 503 }
    );
  }
}
