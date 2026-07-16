import { useEffect, useState } from 'react';

/**
 * Cache client-side pour les données récupérées via API
 * Stocke les données en mémoire et optionnellement dans localStorage
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // en millisecondes
}

// Cache en mémoire
const memoryCache = new Map<string, CacheEntry<any>>();

/**
 * Hook de caching client-side avec localStorage optionnel
 */
export function useCachedFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: {
    ttl?: number; // en secondes, défaut 5 minutes
    useLocalStorage?: boolean;
  } = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const ttlMs = (options.ttl || 300) * 1000;
  const useLS = options.useLocalStorage ?? true;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Vérifier la cache mémoire
        const memoryCached = memoryCache.get(key);
        if (memoryCached && Date.now() - memoryCached.timestamp < memoryCached.ttl) {
          setData(memoryCached.data);
          setLoading(false);
          return;
        }

        // Vérifier localStorage
        if (useLS) {
          try {
            const lsEntry = localStorage.getItem(`cache:${key}`);
            if (lsEntry) {
              const parsed = JSON.parse(lsEntry);
              if (Date.now() - parsed.timestamp < parsed.ttl) {
                setData(parsed.data);
                memoryCache.set(key, parsed);
                setLoading(false);
                return;
              }
            }
          } catch (e) {
            // localStorage error, continue
          }
        }

        // Récupérer les données
        const result = await fetchFn();

        // Stocker dans les deux caches
        const entry = {
          data: result,
          timestamp: Date.now(),
          ttl: ttlMs,
        };

        memoryCache.set(key, entry);

        if (useLS) {
          try {
            localStorage.setItem(`cache:${key}`, JSON.stringify(entry));
          } catch (e) {
            // localStorage error, continue sans localStorage
          }
        }

        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [key, fetchFn, ttlMs, useLS]);

  return { data, loading, error };
}

/**
 * Invalide une entrée de cache
 */
export function invalidateCache(key: string) {
  memoryCache.delete(key);
  try {
    localStorage.removeItem(`cache:${key}`);
  } catch (e) {
    // ignore
  }
}

/**
 * Invalide toutes les entrées de cache correspondant à un pattern
 */
export function invalidateCachePattern(pattern: string | RegExp) {
  const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
  
  // Vider la mémoire
  for (const [key] of memoryCache) {
    if (regex.test(key)) {
      memoryCache.delete(key);
    }
  }

  // Vider localStorage
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((k) => {
      if (k.startsWith('cache:') && regex.test(k.substring(6))) {
        localStorage.removeItem(k);
      }
    });
  } catch (e) {
    // ignore
  }
}

/**
 * Nettoie la cache obsolète
 */
export function cleanupCache() {
  const now = Date.now();

  // Vider la mémoire
  for (const [key, entry] of memoryCache) {
    if (now - entry.timestamp > entry.ttl) {
      memoryCache.delete(key);
    }
  }

  // Vider localStorage
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((k) => {
      if (k.startsWith('cache:')) {
        const entry = JSON.parse(localStorage.getItem(k) || '{}');
        if (now - entry.timestamp > entry.ttl) {
          localStorage.removeItem(k);
        }
      }
    });
  } catch (e) {
    // ignore
  }
}
