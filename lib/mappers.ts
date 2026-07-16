import { Artiste, Genre, ArtisteDetail, Release, VideoItem, GalleryPhoto } from "@/types/artistes";
import { BlogPost, BlogCard, BlogCategory, ArticleBlock, Comment } from "@/types/blog";
import {PodcastEpisode} from "@/types/podcasts"

export function mapApiArtistToArtiste(apiArtist: any): Artiste {
  //const genreNames = typeof apiArtist.genre_names === 'string' ? apiArtist.genre_names : "";
  //const genresArray = genreNames.split(',').map(g => g.trim()).filter(Boolean);

  console.log("GENRES: ",apiArtist.genre_names);
  const genreNames = apiArtist.genre_names;
  const genresArray = genreNames;
  
  return {
    id: apiArtist.slug || apiArtist.id?.toString(),
    name: apiArtist.name || "Artiste",
    city: apiArtist.city || "Kivu",
    genres: genresArray.length > 0 ? genresArray : ["Tous"],
    image: apiArtist.photo_url || "",
    href: `/artistes/${apiArtist.slug}`,
  };
}

export function mapApiArtistDetailToArtisteDetail(apiDetail: any): ArtisteDetail {
  return {
    id: apiDetail.slug || apiDetail.id?.toString(),
    name: apiDetail.name || "Artiste",
    city: apiDetail.city || "Kivu",
    country: apiDetail.country || "RD Congo",
    genres: apiDetail.genres?.map((g: any) => g.name) || [],
    bio: apiDetail.bio || "",
    coverImage: apiDetail.cover_url || apiDetail.photo_url || "",
    bookingLabel: "Réserver l'artiste",
    releases: apiDetail.releases?.map((r: any) => ({
      id: r.slug || r.id?.toString(),
      title: r.title,
      year: r.release_date ? new Date(r.release_date).getFullYear().toString() : "",
      type: r.format?.toUpperCase() || "SINGLE",
      coverImage: r.cover_url || "",
      href: `/releases/${r.slug}`
    })) || [],
    videos: apiDetail.videos?.map((v: any) => ({
      id: v.id?.toString() || Math.random().toString(),
      title: v.title,
      thumbnail: v.thumbnail_url || "",
      duration: v.duration || "",
      views: "",
      publishedAt: v.published_at_human || "",
      href: v.video_url || "#"
    })) || [],
    gallery: apiDetail.gallery?.map((p: any) => ({
      id: p.id?.toString() || Math.random().toString(),
      src: p.image_url,
      alt: p.caption || apiDetail.name
    })) || []
  };
}

export function mapApiBlogToBlogCard(apiArticle: any): BlogCard {
  return {
    id: apiArticle.slug || apiArticle.id?.toString(),
    slug: apiArticle.slug,
    title: apiArticle.title,
    excerpt: apiArticle.excerpt,
    image: apiArticle.featured_image_url || apiArticle.image_url || "",
    category: (apiArticle.category?.name as BlogCategory) || "Tous",
    readTime: apiArticle.read_time ? `${apiArticle.read_time} min` : "5 min",
    publishedAt: apiArticle.published_at_human || "Récemment",
    featured: apiArticle.is_featured || false,
  };
}

export function mapApiArticleToBlogPost(apiArticle: any): BlogPost {
  const paragraphs = apiArticle.content?.split('\n\n') || [];
  const blocks: ArticleBlock[] = paragraphs.map((p: string) => ({
    type: "paragraph",
    content: p.trim()
  }));

  return {
    id: apiArticle.slug || apiArticle.id?.toString(),
    slug: apiArticle.slug,
    title: apiArticle.title,
    coverImage: apiArticle.featured_image_url || "",
    categories: apiArticle.category ? [apiArticle.category.name as BlogCategory] : ["Tous"],
    author: {
      name: apiArticle.author?.username || "Rédaction",
      avatar: apiArticle.author?.avatar_url || "",
      publishedAt: apiArticle.published_at_human || "Récemment"
    },
    readTime: apiArticle.read_time ? `${apiArticle.read_time} min` : "5 min",
    blocks: blocks,
    tags: apiArticle.tags?.map((t: any) => t.name) || [],
    relatedPosts: [],
    comments: apiArticle.comments?.map((c: any): Comment => ({
      id: c.id?.toString() || Math.random().toString(),
      author: c.user?.username || "Anonyme",
      avatar: c.user?.avatar_url || "",
      content: c.content,
      publishedAt: c.created_at_human || "Récemment",
      likes: c.like_count || 0
    })) || []
  };
}

export function mapApiEventToEvent(apiEvent: any) {
  const eventDate = apiEvent.date ? new Date(apiEvent.date) : new Date();
  
  const day = eventDate.getDate().toString().padStart(2, '0');
  const monthStr = eventDate.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '').toUpperCase();
  const fullDate = eventDate.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return {
    id: apiEvent.slug || apiEvent.id?.toString(),
    slug: apiEvent.slug,
    title: apiEvent.title,
    image: apiEvent.image_url || "",
    date: fullDate,
    dateShort: {
      day: day,
      month: monthStr
    },
    location: apiEvent.venue_name || apiEvent.city?.name || "Kivu",
    venue: apiEvent.venue_name,
    city: apiEvent.city?.name || apiEvent.city_name,
    category: apiEvent.category_name || apiEvent.category,
    description: apiEvent.description || "",
    isFeatured: apiEvent.is_featured,
    time: apiEvent.date ? new Date(apiEvent.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : "18:00",
  };
}

export function mapApiEventDetailToEventDetail(apiDetail: any): any {
  const base = mapApiEventToEvent(apiDetail);
  return {
    ...base,
    coverImage: apiDetail.image_url || "",
    about: apiDetail.description || "",
    price: apiDetail.ticket_price ? `${apiDetail.ticket_price} $` : "Gratuit",
    venue: {
      name: apiDetail.venue_name || "Lieu secret",
      address: apiDetail.venue_address || "Goma, Kivu",
      image: apiDetail.image_url || ""
    },
    schedule: apiDetail.schedule?.map((s: any) => ({
      date: s.date ? new Date(s.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : "Aujourd'hui",
      time: s.start_time || "18:00",
      label: s.title || s.activity
    })) || [],
    similarEvents: [] 
  };
}

export function mapApiPodcastToEpisode(apiEpisode: any) {
  return {
    id: apiEpisode.slug || apiEpisode.id?.toString(),
    slug: apiEpisode.slug,
    title: apiEpisode.title,
    description: apiEpisode.description,
    image: apiEpisode.image_url || "",
    duration: apiEpisode.duration || "00:00",
    publishedAt: apiEpisode.published_at_human || "Récemment",
    category: apiEpisode.series_name || "Podcast",
    host: apiEpisode.host_name || "Art du Kivu",
    guest: apiEpisode.guest_name || "",
  };
}

export function mapApiEpisodeToPodcastEpisode(apiEpisode: any): PodcastEpisode {
  return {
    id: apiEpisode.slug || apiEpisode.id?.toString(),
    slug: apiEpisode.slug,
    episodeNumber: apiEpisode.number || 1,
    publishedAt: apiEpisode.published_at_human || "Récemment",
    title: apiEpisode.title,
    subtitle: apiEpisode.subtitle || "",
    coverImage: apiEpisode.image_url || "",
    tags: apiEpisode.tags?.map((t: any) => t.name) || [],
    badge: apiEpisode.is_exclusive ? "Exclusif" : undefined,
    description: apiEpisode.description || "",
    duration: apiEpisode.duration || "00:00",
    currentTime: "00:00",
    progressPercent: 0,
    audioUrl: apiEpisode.audio_url || apiEpisode.audio_file || "",
    guest: {
      name: apiEpisode.guest_name || "Invité",
      title: apiEpisode.guest_title || "",
      avatar: apiEpisode.guest_avatar || "",
      bio: apiEpisode.guest_bio || "",
      website: apiEpisode.guest_website,
      twitter: apiEpisode.guest_twitter
    },
    relatedEpisodes: apiEpisode.related?.map((r: any) => ({
      id: r.slug || r.id?.toString(),
      slug: r.slug,
      episodeNumber: r.number || 1,
      title: r.title,
      image: r.image_url || "",
      duration: r.duration || "00:00"
    })) || []
  };
}

export function mapApiVideoToWebTVVideo(apiVideo: any) {
  return {
    id: apiVideo.slug || apiVideo.id?.toString(),
    slug: apiVideo.slug,
    title: apiVideo.title,
    description: apiVideo.description || "",
    thumbnail: apiVideo.thumbnail_url || apiVideo.image_url || "",
    // PremierSection(Desktop) render a `PremierVideo` shape (imageUrl/imageAlt/subtitle/tag),
    // not the plain list-card shape above — populate both so the same mapped object works for
    // either component tree without a second mapper.
    imageUrl: apiVideo.thumbnail_url || apiVideo.image_url || "",
    imageAlt: apiVideo.title || "",
    subtitle: apiVideo.description || "",
    // Scoped to the Premier/hero use only (not a generic "category tag") — DocsSection etc.
    // read their own `tag`/label from `category`, not from this field.
    liveTag: apiVideo.is_live ? "En Direct" : "Premiere",
    videoUrl: apiVideo.video_url,
    // The real `VideoDetailSerializer`'s live playback field — VOD's own `video_url` is used
    // for the non-live player; a live video plays `playbackHlsUrl` via LiveStreamPlayer instead.
    playbackHlsUrl: apiVideo.playback_hls_url || "",
    duration: apiVideo.duration,
    // Real backend field is `category` (snake_case values: freestyles, studio_sessions, docs,
    // interviews, premiers, concerts) — not `category_name`, which doesn't exist on the
    // serializer at all.
    category: apiVideo.category,
    isPremier: apiVideo.is_premier,
    isLive: apiVideo.is_live || false,
    likeCount: apiVideo.like_count || 0,
    commentCount: apiVideo.comment_count || 0,
    publishedAt: apiVideo.published_at_human,
    // Aliases consumed by StudioSession/DocVideo-shaped card components.
    author: apiVideo.artist_names?.[0] || "",
    date: apiVideo.published_at_human || "",
    href: apiVideo.slug ? `/web-tv/${apiVideo.slug}` : "/web-tv",
  };
}

export function mapApiRadioToRadioProgram(apiProgram: any) {
  return {
    id: apiProgram.slug || apiProgram.id?.toString(),
    title: apiProgram.title,
    presenter: apiProgram.presenter || apiProgram.host || apiProgram.artist_names?.[0],
    host: apiProgram.presenter || apiProgram.host || apiProgram.artist_names?.[0],
    startTime: apiProgram.start_time,
    endTime: apiProgram.end_time,
    time: `${apiProgram.start_time || ''} - ${apiProgram.end_time || ''}`,
    day: apiProgram.day_name,
    image: apiProgram.cover_url || apiProgram.image_url || "",
    streamUrl: apiProgram.stream_url,
    hlsUrl: apiProgram.cf_playback_hls_url || null,
    dashUrl: apiProgram.cf_playback_dash_url || null,
    isLive: apiProgram.status === 'live',
    listenerCount: apiProgram.listener_count || apiProgram.online_followers || 0,
    status: apiProgram.status === 'live' ? 'now' : (apiProgram.status === 'upcoming' ? 'next' : 'later'),
    messages: []
  };
}

export function mapApiPostToCommunityItem(apiPost: any) {
  if (!apiPost) return { type: "talent", data: {} };

  // The real CommunityPostSerializer never returns media_url/image_url/video_url — only
  // `media: [{type: "image"|"song"|"video", url}]` (per TalentSubmissionSerializer /
  // CommunityPostWriteSerializer). Unpack it by type instead of reading fields that don't exist.
  const mediaItems: { type?: string; url?: string }[] = Array.isArray(apiPost.media) ? apiPost.media : [];
  const imageItem = mediaItems.find((m) => m.type === "image");
  const videoItem = mediaItems.find((m) => m.type === "video");
  const audioItem = mediaItems.find((m) => m.type === "song");

  const data = {
    id: apiPost.id?.toString() || Math.random().toString(),
    artist: {
      username: apiPost.author_name || apiPost.author?.username || "Membre",
      avatar: apiPost.author_avatar || apiPost.author?.avatar_url || "",
      location: apiPost.author?.city || "Kivu",
      isVerified: !!(apiPost.author?.is_verified || apiPost.is_verified)
    },
    author: {
      name: apiPost.author_name || apiPost.author?.username || "Membre",
      avatar: apiPost.author_avatar || apiPost.author?.avatar_url || "",
      isVerified: !!(apiPost.author?.is_verified || apiPost.is_verified)
    },
    content: apiPost.content || "",
    caption: apiPost.content || apiPost.title || "",
    image: imageItem?.url || null,
    coverImage: imageItem?.url || "",
    video: videoItem?.url || null,
    audio: audioItem?.url || null,
    likes: apiPost.like_count || 0,
    comments: apiPost.comment_count || 0,
    time: apiPost.created_at_human || "Récemment",
    timeAgo: apiPost.created_at_human || "Récemment",
    title: apiPost.title || "",
    duration: apiPost.duration || "0:00",
    tags: Array.isArray(apiPost.tags) ? apiPost.tags.map((t: any) => typeof t === 'string' ? t : (t.name || t.label)) : []
  };

  return {
    type: apiPost.post_type || "talent",
    data: data
  };
}

export function mapApiReleaseToFeaturedRelease(apiRelease: any) {
  if (!apiRelease) return null;
  const date = apiRelease.release_date ? new Date(apiRelease.release_date) : new Date();
  return {
    id: apiRelease.slug || apiRelease.id?.toString(),
    title: apiRelease.title || "Nouvelle sortie",
    coverImage: apiRelease.cover_url || "",
    releaseDate: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
    month: date.toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase(),
    day: date.getDate().toString().padStart(2, '0'),
    isPremiere: !!apiRelease.is_premiere,
    format: apiRelease.format?.toUpperCase() || "SINGLE",
    description: apiRelease.description || "",
    releaseInfo: apiRelease.artist_name || "Artiste",
    releaseIcon: "person"
  };
}

// ── Home page mappers ──────────────────────────────────────────────────────

import type { Hero, Track, MagazineArticle, NewsCard } from "@/types";

/**
 * Maps API banner object → Hero type used by HeroSection.
 * API shape: { image_url, title, subtitle, cta_label, cta_url }
 */
export function mapApiBannerToHero(apiBanner: any, fallback: Hero): Hero {
  if (!apiBanner) return fallback;
  return {
    title: apiBanner.title || fallback.title,
    titleHighlight: apiBanner.title_highlight || fallback.titleHighlight,
    subtitle: apiBanner.subtitle || fallback.subtitle,
    backgroundImage: apiBanner.image_url || fallback.backgroundImage,
    ctaPrimary: {
      label: apiBanner.cta_label || fallback.ctaPrimary.label,
      href: apiBanner.cta_url || fallback.ctaPrimary.href,
    },
    ctaSecondary: fallback.ctaSecondary,
  };
}

/**
 * Maps a single API hits_du_mois track → Track type used by HitsList.
 * API shape: { id, slug, title, artist_name, cover_url, rank }
 */
export function mapApiHitToTrack(apiHit: any, index: number): Track {
  const rank = (apiHit.rank ?? index + 1).toString().padStart(2, "0");
  return {
    rank,
    title: apiHit.title || "–",
    artist: apiHit.artist_name || apiHit.artist || "–",
    image: apiHit.cover_url || apiHit.image_url || "",
    featured: index === 0,
    href: apiHit.slug ? `/live-music` : "/live-music",
  };
}

/**
 * Maps a single API magazine article → MagazineArticle type.
 * API shape: { id, slug, title, featured_image_url, category, excerpt, is_featured }
 */
export function mapApiMagazineArticle(apiArticle: any): MagazineArticle {
  return {
    id: apiArticle.slug || apiArticle.id?.toString() || Math.random().toString(),
    title: apiArticle.title || "Article",
    image: apiArticle.featured_image_url || apiArticle.image_url || "",
    category: apiArticle.category?.name || apiArticle.category || "Magazine",
    featured: !!apiArticle.is_featured,
    href: `/magazine/${apiArticle.slug || apiArticle.id}`,
    excerpt: apiArticle.excerpt || "",
  };
}

/**
 * Maps the API a_la_une object → array of NewsCard for NewsCarousel.
 * a_la_une: { artist_of_month, featured_podcast, featured_event }
 */
export function mapApiALaUneToNewsCards(aLaUne: any): NewsCard[] {
  if (!aLaUne) return [];
  const cards: NewsCard[] = [];

  if (aLaUne.artist_of_month) {
    const a = aLaUne.artist_of_month;
    cards.push({
      id: a.slug || "artist-of-month",
      title: a.name || a.title || "Artiste du Mois",
      subtitle: a.genre_names?.[0] || a.city || "Kivu",
      image: a.photo_url || a.cover_url || a.image_url || "",
      badge: "Artiste du Mois",
      badgeVariant: "primary",
      href: a.slug ? `/artistes/${a.slug}` : "/artistes",
      actionIcon: "arrow_forward",
      actionColor: "primary",
    });
  }

  if (aLaUne.featured_podcast) {
    const p = aLaUne.featured_podcast;
    cards.push({
      id: p.slug || "featured-podcast",
      title: p.title || "Podcast à la Une",
      subtitle: p.series_name || p.host_name || "Podcast",
      image: p.image_url || p.cover_url || "",
      badge: "Podcast à la Une",
      badgeVariant: "teal",
      href: p.slug ? `/podcasts/${p.slug}` : "/podcasts",
      actionIcon: "play_arrow",
      actionColor: "teal",
    });
  }

  if (aLaUne.featured_event) {
    const e = aLaUne.featured_event;
    const dateStr = e.date
      ? new Date(e.date).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })
      : "";
    cards.push({
      id: e.slug || "featured-event",
      title: e.title || "Événement",
      subtitle: dateStr ? `Bientôt — ${dateStr}` : e.venue_name || "Kivu",
      image: e.image_url || e.cover_url || "",
      badge: "Événement",
      badgeVariant: "navy",
      href: e.slug ? `/evenements/${e.slug}` : "/evenements",
      actionIcon: "calendar_month",
      actionColor: "teal",
    });
  }

  return cards;
}

/**
 * Routes a `/api/v1/search/` result (`{type, id, slug, title, ...}`) to its real detail page.
 * `podcast_series`/`releases`/`community_posts` have no per-item detail route today — they fall
 * back to the relevant section's list page.
 */
export function typeToHref(type: string, slug: string | null | undefined, id: string | number): string {
  const key = slug || id;
  switch (type) {
    case "artists":
      return `/artistes/${key}`;
    case "articles":
      return `/blog/${key}`;
    case "events":
      return `/evenements/${key}`;
    case "podcast_episodes":
      return `/podcasts/${key}`;
    case "podcast_series":
      return "/podcasts";
    case "webtv_videos":
      return `/web-tv/${key}`;
    case "releases":
      return "/sorties-premieres";
    case "community_posts":
      return "/communaute";
    default:
      return "/";
  }
}

// Real badges (`GET /gamification/badges/`) have no `color`/`glowColor` — cycled by catalog
// order so unlocked badges still get a distinct look, matching the existing visual contract.
const BADGE_PALETTE = [
  { color: "text-yellow-400", glowColor: "rgba(250,204,21,0.2)" },
  { color: "text-primary", glowColor: "rgba(0,178,161,0.25)" },
  { color: "text-pink-500", glowColor: "rgba(236,72,153,0.2)" },
  { color: "text-blue-400", glowColor: "rgba(96,165,250,0.2)" },
  { color: "text-emerald-400", glowColor: "rgba(52,211,153,0.2)" },
];

export function mapApiBadgeToBadge(apiBadge: any, unlocked: boolean, index: number) {
  const palette = BADGE_PALETTE[index % BADGE_PALETTE.length];
  return {
    id: apiBadge.slug || apiBadge.id?.toString(),
    icon: "military_tech",
    iconUrl: apiBadge.icon_url || null,
    label: apiBadge.name || "",
    color: palette.color,
    glowColor: palette.glowColor,
    unlocked,
  };
}

function formatSecondsAsDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  if (hours > 0) return `${hours}h`;
  const minutes = Math.floor(totalSeconds / 60);
  return `${minutes}m`;
}

// Matches ConsumptionLog.CONTENT_TYPE_CHOICES (backend `apps/gamification/models.py`).
const CONTENT_TYPE_ICON: Record<string, { icon: string; accentColor: string; iconColor: string }> = {
  radio: { icon: "radio", accentColor: "bg-orange-500/20", iconColor: "text-orange-500" },
  podcast: { icon: "podcasts", accentColor: "bg-purple-500/20", iconColor: "text-purple-400" },
  webtv: { icon: "tv", accentColor: "bg-blue-500/20", iconColor: "text-blue-400" },
  live_music: { icon: "graphic_eq", accentColor: "bg-teal-500/20", iconColor: "text-teal-400" },
  release: { icon: "album", accentColor: "bg-pink-500/20", iconColor: "text-pink-400" },
};

export function mapApiMediaRankingToListenHistoryItem(apiItem: any) {
  const style = CONTENT_TYPE_ICON[apiItem.content_type] || {
    icon: "graphic_eq",
    accentColor: "bg-white/10",
    iconColor: "text-white/60",
  };
  return {
    id: `${apiItem.content_type}-${apiItem.object_id}`,
    status: "idle" as const,
    title: apiItem.title || "",
    subtitle: formatSecondsAsDuration(apiItem.total_seconds || 0),
    totalSeconds: apiItem.total_seconds || 0,
    coverImage: apiItem.cover_url || "",
    accentColor: style.accentColor,
    iconColor: style.iconColor,
    icon: style.icon,
  };
}

// `profile_services._resolve_target`'s `kind` values (webtv/podcast/release/community/article)
// are shorter aliases of `typeToHref`'s `/search/`-shaped types — map between them here.
const SAVED_KIND_TO_SEARCH_TYPE: Record<string, string> = {
  webtv: "webtv_videos",
  podcast: "podcast_episodes",
  release: "releases",
  community: "community_posts",
  article: "articles",
};

export function mapApiSavedItemToSavedEntry(apiItem: any) {
  return {
    id: `${apiItem.kind}-${apiItem.id}`,
    title: apiItem.title || "",
    coverImage: apiItem.cover_url || "",
    href: typeToHref(SAVED_KIND_TO_SEARCH_TYPE[apiItem.kind] || apiItem.kind, apiItem.slug, apiItem.id),
  };
}
