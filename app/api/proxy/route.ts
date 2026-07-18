import { createHash } from 'crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { extractErrorMessage } from '@/lib/api-client';
import { refreshAccessToken, applyRefreshedTokenCookies } from '@/lib/server/refreshAccessToken';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://art-du-kivu-api.kelor.tech';

// Cache en mémoire pour les requêtes GET
const requestCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

/**
 * Identifies the caller for cache-key scoping, without storing the raw token in memory.
 * Responses can vary per Bearer token (e.g. gamification/media-ranking has no user id in the
 * URL), so the cache key MUST be scoped by identity — otherwise user A's cached response gets
 * served to user B for the same anonymous-looking endpoint.
 */
function identityHash(token: string | undefined): string {
  if (!token) return 'anon';
  return createHash('sha256').update(token).digest('hex').slice(0, 16);
}

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
export async function PATCH(request: Request) { return handleProxy(request); }
export async function DELETE(request: Request) { return handleProxy(request); }

async function handleProxy(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');

  if (!endpoint) {
    return NextResponse.json({ message: 'Missing endpoint' }, { status: 400 });
  }

  const method = request.method;
  const cacheTTL = getCacheTTL(endpoint, method);

  const cookieStore = await cookies();
  let token = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;
  let refreshed: { access: string; refresh: string | null } | null = null;

  // Cache key MUST be scoped by caller identity — see identityHash() above.
  const cacheKey = `${method}:${endpoint}:${identityHash(token)}`;

  // Vérifier la cache
  if (cacheTTL) {
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

  // Body/multipart can only be read off `request` once — capture it up front so a retry after
  // a token refresh can reuse the exact same payload instead of re-reading an exhausted stream.
  let body: BodyInit | undefined;
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  const clientOrigin = request.headers.get('origin');
  const clientReferer = request.headers.get('referer');
  if (clientOrigin) (headers as Record<string, string>)['Origin'] = clientOrigin;
  if (clientReferer) (headers as Record<string, string>)['Referer'] = clientReferer;

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const clientContentType = request.headers.get('content-type') || '';
    if (clientContentType.includes('multipart/form-data')) {
      (headers as Record<string, string>)['Content-Type'] = clientContentType;
      body = await request.arrayBuffer();
    } else {
      body = await request.text();
    }
  }

  const fetchUrl = `${API_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  async function doFetch(authToken: string | undefined) {
    const reqHeaders = { ...headers } as Record<string, string>;
    if (authToken) reqHeaders['Authorization'] = `Bearer ${authToken}`;
    return fetch(fetchUrl, { method: request.method, headers: reqHeaders, body, cache: 'no-store' });
  }

  try {
    let response = await doFetch(token);

    // Access token expired — try the refresh_token once before giving up. Without this, every
    // session silently died once the access token expired, regardless of the 7-day refresh token.
    if (response.status === 401 && refreshToken) {
      refreshed = await refreshAccessToken(refreshToken);
      if (refreshed) {
        token = refreshed.access;
        response = await doFetch(token);
      }
    }

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
      const errorRes = NextResponse.json({ message: cleanMessage, ...data }, { status: response.status });
      if (refreshed) applyRefreshedTokenCookies(errorRes, refreshed);
      return errorRes;
    }

    // Stocker dans la cache
    if (cacheTTL) {
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

    const res = NextResponse.json(data, {
      status: response.status,
      headers: {
        'X-Cache': cacheTTL ? 'MISS' : 'SKIP',
        'Cache-Control': cacheTTL ? 'public, max-age=60, must-revalidate' : 'no-store',
      },
    });
    if (refreshed) applyRefreshedTokenCookies(res, refreshed);
    return res;
  } catch (error: any) {
    console.error('Proxy Fatal Error:', error);
    return NextResponse.json(
      { message: 'Le serveur est injoignable. Veuillez réessayer dans quelques instants.' },
      { status: 503 }
    );
  }
}
