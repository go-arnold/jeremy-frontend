const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://art-du-kivu-api.kelor.tech';

/**
 * Extracts a human-readable string from complex error objects (especially Django REST)
 * to prevent "[object Object]" displays.
 */
export function extractErrorMessage(data: any): string {
  if (!data) return 'Une erreur inconnue est survenue';
  if (typeof data === 'string') return data;
  
  // If it's an array, try to extract from the first element
  if (Array.isArray(data)) {
    if (data.length === 0) return 'Une erreur inconnue est survenue';
    return extractErrorMessage(data[0]);
  }

  if (typeof data === 'object' && data !== null) {
    // 1. Check priority fields that are usually strings or arrays of strings
    const priority = ['detail', 'message', 'error', 'non_field_errors', 'errorMessage', 'errors'];
    for (const key of priority) {
      const val = data[key];
      if (val) {
        if (typeof val === 'string') return val;
        if (Array.isArray(val) && typeof val[0] === 'string') return val[0];
        // If the priority field is an object or array, recurse
        const nested = extractErrorMessage(val);
        if (nested && nested !== '[object Object]' && !nested.includes('erreur serveur')) return nested;
      }
    }

    // 2. Try any other key that has a string value or array of strings (common in field-specific errors)
    for (const key in data) {
      const val = data[key];
      if (typeof val === 'string') return `${key}: ${val}`;
      if (Array.isArray(val) && typeof val[0] === 'string') return `${key}: ${val[0]}`;
    }

    // 3. Try any other key that has an array or object value
    for (const key in data) {
      const val = data[key];
      if (val && (Array.isArray(val) || typeof val === 'object')) {
        const nested = extractErrorMessage(val);
        if (nested && nested !== '[object Object]') return nested;
      }
    }

    // Last resort: stringify the whole thing if it's a small object
    try {
      const str = JSON.stringify(data);
      if (str === '{}') return 'Une erreur serveur est survenue';
      return str.length < 150 ? str : 'Erreur serveur détaillée';
    } catch (e) {
      return 'Une erreur serveur est survenue';
    }
  }

  return String(data);
}

// In-memory cache for API requests (server-side)
const responseCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60000; // 1 minute pour la cache serveur

function getCacheKey(endpoint: string, options?: RequestInit): string {
  return `${endpoint}:${JSON.stringify(options || {})}`;
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  cacheTime?: number
): Promise<T> {
  const isClient = typeof window !== 'undefined';
  const isInternal = endpoint.startsWith('/api/auth') || endpoint.startsWith('/api/proxy');
  const cacheKey = getCacheKey(endpoint, options);
  
  // Vérifier la cache serveur (côté serveur uniquement, pas pour les mutations)
  if (!isClient && !options.method || options.method === 'GET') {
    const cached = responseCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < (cacheTime || CACHE_TTL)) {
      return cached.data as T;
    }
  }
  
  let url = `${API_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  
  // Create a new headers object to avoid mutating the original
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (isClient && !isInternal) {
    url = `/api/proxy?endpoint=${encodeURIComponent(endpoint.startsWith('/') ? endpoint : '/' + endpoint)}`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const response = await fetch(url, {
      ...options,
      headers,
      signal: options.signal || controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    
    if (!response.ok) {
      let message = `Erreur ${response.status}`;
      if (isJson) {
        const errorData = await response.json().catch(() => ({}));
        message = extractErrorMessage(errorData);
      } else {
        const text = await response.text().catch(() => '');
        if (text && text.length < 150) message = text;
      }
      throw new Error(message);
    }

    if (response.status === 204) return {} as T;
    
    const data = isJson ? await response.json() : await response.text();
    
    // Cache la réponse côté serveur pour les GET
    if (!isClient && (!options.method || options.method === 'GET')) {
      responseCache.set(cacheKey, { data, timestamp: Date.now() });
    }
    
    return data as T;
  } catch (error: any) {
    // Ensure we always throw a simple string message
    const message = error.message || 'Erreur de connexion réseau';
    throw new Error(typeof message === 'string' ? message : 'Erreur inconnue');
  }
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
