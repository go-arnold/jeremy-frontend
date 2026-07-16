import { unstable_cache } from 'next/cache';

/**
 * Cache wrapper pour les appels API avec des durations intelligentes
 * Utilise le caching Next.js pour optimiser les performances
 */

// Durées de cache par type de contenu (en secondes)
const CACHE_DURATIONS = {
  short: 300,      // 5 minutes : contenu très actif (live, radio)
  medium: 900,     // 15 minutes : contenu régulièrement mis à jour
  long: 3600,      // 1 heure : contenu stable (articles)
  veryLong: 86400, // 24 heures : contenu quasi-statique
};

/**
 * Crée un wrapper de cache réutilisable pour une fonction
 */
export function createCachedFetcher<T>(
  fn: () => Promise<T>,
  key: string,
  duration: keyof typeof CACHE_DURATIONS = 'long',
  revalidateTags: string[] = []
): () => Promise<T> {
  return unstable_cache(fn, [key], {
    revalidate: CACHE_DURATIONS[duration],
    tags: revalidateTags,
  });
}

/**
 * Types de cache disponibles avec leurs configurations par défaut
 */
export const cacheConfig = {
  // Home page
  home: { duration: 'medium' as const, tags: ['home', 'content'] },
  
  // Articles et blog
  articles: { duration: 'long' as const, tags: ['articles', 'blog'] },
  articleDetail: { duration: 'medium' as const, tags: ['article', 'blog'] },
  
  // Événements
  events: { duration: 'medium' as const, tags: ['events', 'content'] },
  eventDetail: { duration: 'medium' as const, tags: ['event', 'content'] },
  
  // Communauté
  communityPosts: { duration: 'short' as const, tags: ['community', 'feed'] },
  
  // Podcasts
  podcasts: { duration: 'long' as const, tags: ['podcasts', 'content'] },
  podcastDetail: { duration: 'medium' as const, tags: ['podcast', 'content'] },
  
  // Web TV
  webTvVideos: { duration: 'long' as const, tags: ['webtv', 'content'] },
  webTvPremiers: { duration: 'medium' as const, tags: ['webtv', 'premiers'] },
  
  // Artistes
  artists: { duration: 'long' as const, tags: ['artists', 'content'] },
  artistDetail: { duration: 'medium' as const, tags: ['artist', 'content'] },
  
  // Magazine
  magazine: { duration: 'long' as const, tags: ['magazine', 'content'] },
  
  // Sorties/Premières
  releases: { duration: 'medium' as const, tags: ['releases', 'content'] },
  
  // Live et radio
  liveShow: { duration: 'short' as const, tags: ['live', 'radio'] },
  radioShow: { duration: 'short' as const, tags: ['radio', 'live'] },
  
  // Catégories et filtres
  categories: { duration: 'veryLong' as const, tags: ['categories'] },
  filters: { duration: 'veryLong' as const, tags: ['filters'] },
};
