import { Artiste, ArtisteDetail, Release, VideoItem, GalleryPhoto } from "@/types/artistes";
import { BlogPost, BlogCard, BlogCategory, ArticleBlock, Comment } from "@/types/blog";
import { PodcastEpisode, PodcastListItem, PodcastShow } from "@/types/podcasts"
import type { HeroArticle, NewsArticle } from "@/types/magazine";
import type { EmissionStatus } from "@/types/emissions";
import type { EventDetail } from "@/types/evenements";
import { sanitizeArticleHtml } from "@/lib/sanitize-html";
import type {
  ApiArtistList,
  ApiArtistDetail,
  ApiGenre,
  ApiRelease as ApiArtistRelease,
  ApiArtistVideo,
  ApiArtistPhoto,
  ApiArticleList,
  ApiArticleDetail,
  ApiTag,
  ApiComment,
  ApiEvent,
  ApiEventSchedule,
  ApiEpisode,
  ApiEpisodeGuest,
  ApiPodcastSeries,
  ApiVideo,
  ApiRadioOrLiveProgram,
  ApiCommunityPost,
  ApiRelease,
  ApiHeroBanner,
  ApiHit,
  ApiALaUne,
  ApiContentAUneItem,
  ApiBadge,
  ApiMediaRankingItem,
  ApiSavedItem,
  ApiActivityEntry,
  ApiEmission,
} from "@/lib/api-types";

/** Magazine article list shape — close to `ApiArticleList` but `category` is read as either the
 * nested `{name}` object (real serializer shape) or a raw string (defensive fallback already
 * present in the existing mapper logic below). */
export interface ApiMagazineArticle {
  id?: number | string;
  slug?: string;
  title: string;
  excerpt?: string;
  featured_image_url?: string;
  image_url?: string;
  category?: { name?: string } | string;
  read_time?: number;
  is_featured?: boolean;
  published_at?: string | null;
  author_name?: string;
  author?: { username?: string; avatar_url?: string };
}

/** Several serializers (podcasts, emissions) only return a raw ISO `published_at`/`created_at`,
 * no `*_human` companion field — this covers those cases with the same relative-time convention
 * used elsewhere (`Récemment` fallback, day-granularity beyond a week). */
export function formatRelativeDate(iso: string | null | undefined): string {
  if (!iso) return "Récemment";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Récemment";
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return "À l'instant";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Il y a ${days} j`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

/** `guests` on a podcast episode is a genuinely free-form JSONField (no fixed shape enforced
 * server-side) — accepts either a plain string name or an object with at least a `name`, and
 * never invents fields (avatar/bio/website/...) the API doesn't actually provide. */
function parseEpisodeGuests(
  guests: (string | ApiEpisodeGuest)[] | null | undefined
): { name: string; title: string; avatar: string; bio: string; website?: string; twitter?: string }[] {
  if (!Array.isArray(guests)) return [];
  return guests.map((g) => {
    if (typeof g === "string") return { name: g, title: "", avatar: "", bio: "" };
    return {
      name: g?.name || g?.title || "Invité",
      title: g?.role || g?.title_role || "",
      avatar: g?.avatar || g?.avatar_url || "",
      bio: g?.bio || "",
      website: g?.website,
      twitter: g?.twitter,
    };
  });
}

export function mapApiArtistToArtiste(apiArtist: ApiArtistList): Artiste {
  //const genreNames = typeof apiArtist.genre_names === 'string' ? apiArtist.genre_names : "";
  //const genresArray = genreNames.split(',').map(g => g.trim()).filter(Boolean);

  const genresArray = apiArtist.genre_names || [];

  return {
    id: apiArtist.slug || apiArtist.id?.toString(),
    name: apiArtist.name || "Artiste",
    city: apiArtist.city || "Kivu",
    genres: genresArray.length > 0 ? genresArray : ["Tous"],
    image: apiArtist.photo_url || "",
    href: `/artistes/${apiArtist.slug}`,
  };
}

export function mapApiArtistDetailToArtisteDetail(apiDetail: ApiArtistDetail): ArtisteDetail {
  return {
    id: apiDetail.slug || apiDetail.id?.toString(),
    artistId: apiDetail.id ?? null,
    name: apiDetail.name || "Artiste",
    city: apiDetail.city || "Kivu",
    country: apiDetail.country || "RD Congo",
    genres: apiDetail.genres?.map((g: ApiGenre) => g.name) || [],
    bio: apiDetail.bio || "",
    coverImage: apiDetail.cover_url || apiDetail.photo_url || "",
    releases: apiDetail.releases?.map((r: ApiArtistRelease): Release => ({
      id: r.slug || r.id?.toString() || "",
      title: r.title || "",
      year: r.release_date ? new Date(r.release_date).getFullYear().toString() : "",
      type: (r.format?.toUpperCase() as Release["type"]) || "SINGLE",
      coverImage: r.cover_url || "",
      // Releases only ever have a detail page under /sorties-premieres/[slug] — /releases/[slug]
      // was never a real route, so every release link from an artist's page was a dead link.
      href: r.slug ? `/sorties-premieres/${r.slug}` : "/sorties-premieres",
    })) || [],
    videos: apiDetail.videos?.map((v: ApiArtistVideo): VideoItem => ({
      id: v.id?.toString() || Math.random().toString(),
      title: v.title || "",
      thumbnail: v.thumbnail_url || "",
      duration: v.duration || "",
      views: "",
      publishedAt: v.published_at_human || "",
      href: v.video_url || "#"
    })) || [],
    gallery: apiDetail.gallery?.map((p: ApiArtistPhoto): GalleryPhoto => ({
      id: p.id?.toString() || Math.random().toString(),
      src: p.image_url || "",
      alt: p.caption || apiDetail.name
    })) || [],
    likeCount: Number(apiDetail.like_count) || 0,
    commentCount: Number(apiDetail.comment_count) || 0,
  };
}

export function mapApiBlogToBlogCard(apiArticle: ApiArticleList): BlogCard {
  return {
    id: apiArticle.slug || apiArticle.id?.toString(),
    slug: apiArticle.slug,
    title: apiArticle.title,
    excerpt: apiArticle.excerpt,
    image: apiArticle.featured_image_url || apiArticle.image_url || "",
    category: (apiArticle.category?.name as BlogCategory) || "Tous",
    readTime: apiArticle.read_time ? `${apiArticle.read_time} min` : "5 min",
    // No `published_at_human` field exists on Article(List|Detail)Serializer at all — only
    // raw `published_at`.
    publishedAt: formatRelativeDate(apiArticle.published_at),
    featured: apiArticle.is_featured || false,
  };
}

export function mapApiArticleToBlogPost(apiArticle: ApiArticleDetail): BlogPost {
  const rawContent = apiArticle.content?.trim() || "";
  const containsHtml = /<\/?[a-z][\s\S]*>/i.test(rawContent);
  const blocks: ArticleBlock[] = containsHtml
    ? [{ type: "html", content: sanitizeArticleHtml(rawContent) }]
    : rawContent
      .split("\n\n")
      .map((p: string) => p.trim())
      .filter(Boolean)
      .map((content) => ({ type: "paragraph", content }));

  return {
    id: apiArticle.slug || apiArticle.id?.toString(),
    slug: apiArticle.slug,
    title: apiArticle.title,
    coverImage: apiArticle.featured_image_url || "",
    categories: apiArticle.category ? [apiArticle.category.name as BlogCategory] : ["Tous"],
    author: {
      name: apiArticle.author?.username || "Rédaction",
      avatar: apiArticle.author?.avatar_url || "",
      publishedAt: formatRelativeDate(apiArticle.published_at)
    },
    readTime: apiArticle.read_time ? `${apiArticle.read_time} min` : "5 min",
    blocks: blocks,
    tags: apiArticle.tags?.map((t: ApiTag) => t.name) || [],
    relatedPosts: [],
    likeCount: apiArticle.like_count || 0,
    // Real CommentSerializer fields: {id, author_name, author_avatar, content, like_count,
    // created_at} — flat, no nested `user`, no `created_at_human`.
    comments: apiArticle.comments?.map((c: ApiComment): Comment => ({
      id: c.id?.toString() || Math.random().toString(),
      author: c.author_name || "Anonyme",
      avatar: c.author_avatar || "",
      content: c.content,
      publishedAt: formatRelativeDate(c.created_at),
      likes: c.like_count || 0
    })) || []
  };
}

// Cycled by list position for masonry variety — the real EventSerializer has no per-event layout
// hint (`aspectRatio` never existed on the API response), matching the NEWS_VARIANTS pattern used
// for magazine articles below.
const EVENT_ASPECT_RATIOS = ["aspect-[3/4]", "aspect-[4/3]", "aspect-[3/5]", "aspect-square"];

function capitalizeFirst(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function shortDayMonth(d: Date): string {
  return capitalizeFirst(d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }).replace('.', ''));
}

export function mapApiEventToEvent(apiEvent: ApiEvent, index = 0) {
  const eventDate = apiEvent.date ? new Date(apiEvent.date) : new Date();
  const endDate = apiEvent.end_date ? new Date(apiEvent.end_date) : null;

  const day = eventDate.getDate().toString().padStart(2, '0');
  const monthStr = eventDate.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '').toUpperCase();
  const fullDate = eventDate.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // "18 Fév" for single-day events, "20 Fév - 05 Mar" for multi-day ones.
  const dateLabel = endDate && endDate.getTime() !== eventDate.getTime()
    ? `${shortDayMonth(eventDate)} - ${shortDayMonth(endDate)}`
    : shortDayMonth(eventDate);

  return {
    // `|| ""` guarantees a plain `string` (not `string | undefined`) — this feeds FeaturedEvent/
    // EventGridItem directly now, both of which require non-optional string fields.
    id: apiEvent.slug || apiEvent.id?.toString() || "",
    slug: apiEvent.slug,
    title: apiEvent.title,
    image: apiEvent.image_url || "",
    date: fullDate,
    dateShort: {
      day: day,
      month: monthStr
    },
    dateLabel,
    aspectRatio: EVENT_ASPECT_RATIOS[index % EVENT_ASPECT_RATIOS.length],
    location: apiEvent.venue_name || apiEvent.city?.name || "Kivu",
    venue: apiEvent.venue_name || "",
    // Real EventSerializer returns `city: null` far more often than a populated `{name}` — default
    // to "Kivu" like `location` above instead of leaving the city badge/filter blank.
    city: apiEvent.city?.name || apiEvent.city_name || "Kivu",
    category: apiEvent.category_name || apiEvent.category || "Événement",
    description: apiEvent.description || "",
    isFeatured: apiEvent.is_featured,
    time: apiEvent.date ? new Date(apiEvent.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : "18:00",
    // Stable key/label for the month filter — matching against the abbreviated `dateLabel` was
    // fragile (locale-dependent casing/accents); this doesn't depend on display formatting.
    monthKey: `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}`,
    monthLabel: capitalizeFirst(eventDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })),
  };
}

// `ticket_price` is a raw decimal string (e.g. "20000.00") — real events are priced in Congolese
// Francs, not USD, so this groups thousands the local way and appends "FC" instead of "$".
function formatCdf(amount: string): string {
  const value = Number.parseFloat(amount);
  if (Number.isNaN(value)) return amount;
  return `${Math.round(value).toLocaleString("fr-FR")} FC`;
}

export function mapApiEventDetailToEventDetail(apiDetail: ApiEvent): EventDetail {
  const base = mapApiEventToEvent(apiDetail);
  return {
    ...base,
    coverImage: apiDetail.image_url || "",
    about: apiDetail.description || "",
    price: apiDetail.ticket_price ? formatCdf(apiDetail.ticket_price) : "Gratuit",
    venue: {
      name: apiDetail.venue_name || "Lieu secret",
      address: apiDetail.venue_address || "Goma, Kivu",
      image: apiDetail.image_url || ""
    },
    schedule: apiDetail.schedule?.map((s: ApiEventSchedule) => ({
      date: s.date ? new Date(s.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : "Aujourd'hui",
      time: s.start_time || "18:00",
      label: s.title || s.activity || "Programme"
    })) || [],
    similarEvents: []
  };
}

export function mapApiPodcastToEpisode(apiEpisode: ApiEpisode): PodcastListItem {
  const guests = parseEpisodeGuests(apiEpisode.guests);
  return {
    id: apiEpisode.slug || apiEpisode.id?.toString() || "",
    slug: apiEpisode.slug,
    title: apiEpisode.title,
    // Real EpisodeListSerializer/EpisodeDetailSerializer only ever return `cover_url` —
    // `image_url` never exists on the response, so every real episode's thumbnail was blank.
    image: apiEpisode.cover_url || "",
    duration: apiEpisode.duration || "00:00",
    publishedAt: formatRelativeDate(apiEpisode.published_at),
    category: apiEpisode.series_title || "Podcast",
    guestNames: guests.map((g) => g.name).filter(Boolean).join(", "),
    episodeNumber: apiEpisode.episode_number,
    seasonNumber: apiEpisode.season_number,
    isFeatured: !!apiEpisode.is_featured,
    seriesSlug: apiEpisode.series_slug || apiEpisode.series?.slug,
  };
}

export function mapApiEpisodeToPodcastEpisode(apiEpisode: ApiEpisode): PodcastEpisode {
  const guests = parseEpisodeGuests(apiEpisode.guests);
  return {
    id: apiEpisode.slug || apiEpisode.id?.toString(),
    numericId: apiEpisode.id ?? null,
    slug: apiEpisode.slug,
    episodeNumber: apiEpisode.episode_number || 1,
    publishedAt: formatRelativeDate(apiEpisode.published_at),
    title: apiEpisode.title,
    // Neither `subtitle` nor `tags` nor `is_exclusive` exist on the real serializer at all —
    // left blank rather than reading fields that were never actually there.
    subtitle: apiEpisode.series?.title || "",
    coverImage: apiEpisode.cover_url || "",
    tags: [],
    badge: apiEpisode.is_featured ? "À la une" : undefined,
    description: apiEpisode.description || "",
    duration: apiEpisode.duration || "00:00",
    currentTime: "00:00",
    progressPercent: 0,
    audioUrl: apiEpisode.audio_url || "",
    transcript: apiEpisode.transcript || "",
    likeCount: apiEpisode.like_count || 0,
    commentCount: apiEpisode.comment_count || 0,
    guest: guests[0] || { name: "Invité", title: "", avatar: "", bio: "" },
    guests,
    // No `related` field exists on EpisodeDetailSerializer at all — correctly always empty
    // until a "related episodes" backend feature exists (tracked as backlog in the PDF).
    relatedEpisodes: [],
    seriesSlug: apiEpisode.series_slug || apiEpisode.series?.slug,
  };
}

export function mapApiPodcastSeriesToPodcastShow(apiSeries: ApiPodcastSeries): PodcastShow {
  return {
    id: apiSeries.slug || apiSeries.id?.toString() || "",
    numericId: apiSeries.id ?? null,
    slug: apiSeries.slug,
    title: apiSeries.title || "",
    description: apiSeries.description || "",
    coverImage: apiSeries.cover_url || "",
    category: apiSeries.category || "Podcast",
    episodeCount: apiSeries.episode_count || 0,
  };
}

const WEBTV_CATEGORY_LABELS: Record<string, string> = {
  freestyles: "Freestyle",
  studio_sessions: "Studio",
  docs: "Doc",
  interviews: "Interview",
  premiers: "Première",
  concerts: "Concert",
};

export function mapApiVideoToWebTVVideo(apiVideo: ApiVideo) {
  return {
    id: apiVideo.slug || apiVideo.id?.toString(),
    // Real numeric DB id — `id` above is slug-based for routing; gamification's `consumption/`
    // endpoint needs the actual `object_id`.
    numericId: apiVideo.id ?? null,
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
    duration: apiVideo.duration || "",
    // Real backend field is `category` (snake_case values: freestyles, studio_sessions, docs,
    // interviews, premiers, concerts) — not `category_name`, which doesn't exist on the
    // serializer at all.
    category: apiVideo.category,
    // DocsSection/InterviewsSection/ConcertsSection all read `tag` as their card badge label —
    // the real serializer has no separate "tag" concept, just `category`.
    tag: WEBTV_CATEGORY_LABELS[apiVideo.category ?? ""] || apiVideo.category || "",
    isPremier: apiVideo.is_premier,
    isLive: apiVideo.is_live || false,
    likeCount: apiVideo.like_count || 0,
    commentCount: apiVideo.comment_count || 0,
    publishedAt: apiVideo.published_at_human || "",
    // Aliases consumed by StudioSession/DocVideo-shaped card components.
    author: apiVideo.artist_names?.[0] || "",
    date: apiVideo.published_at_human || "",
    href: apiVideo.slug ? `/web-tv/${apiVideo.slug}` : "/web-tv",
  };
}

// `artist_names` was historically typed as `string | string[]` but neither real schema
// (`MusicLiveSession`, `RadioProgram`) ever sends an array — both send a single comma-joined
// string. Kept defensive here rather than assuming the type comment's claim is accurate.
function normalizeArtistNames(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value.filter(Boolean).join(", ") || undefined;
  return value || undefined;
}

export function mapApiRadioToRadioProgram(apiProgram: ApiRadioOrLiveProgram) {
  // `MusicLiveSlot` (live-music's programme item) only ever sends `artist_name` (singular) —
  // `artist_names`/`presenter`/`host` don't exist on that shape at all, so the previous
  // `artist_names?.[0]` here always resolved to `undefined` for live-music (and would have
  // sliced the first *character* off a string even if it had matched).
  const artistName = apiProgram.artist_name || normalizeArtistNames(apiProgram.artist_names);
  return {
    id: apiProgram.slug || apiProgram.id?.toString(),
    // Real numeric DB id — `id` above is slug-based for routing; gamification's `consumption/`
    // endpoint needs the actual `object_id`. Shared by Radio (RadioProgram) and Live Music
    // (MusicLiveSession) — both have a real numeric `id`.
    numericId: apiProgram.id ?? null,
    slug: apiProgram.slug,
    title: apiProgram.title,
    description: apiProgram.description || "",
    presenter: apiProgram.presenter || apiProgram.host || artistName,
    host: apiProgram.presenter || apiProgram.host || artistName || "",
    startTime: apiProgram.start_time,
    endTime: apiProgram.end_time,
    // A single clean start time, not a redundant "start - end" range — in a back-to-back
    // schedule this doubles as "when the previous slot ends", so one timestamp per slot is
    // enough to read the whole timeline.
    time: apiProgram.start_time || '',
    day: apiProgram.day_name,
    dayOfWeek: apiProgram.day_of_week,
    image: apiProgram.cover_url || apiProgram.image_url || "",
    streamUrl: apiProgram.stream_url,
    // Real RadioProgramSerializer/MusicLiveSessionSerializer only ever return
    // `playback_hls_url` — the `cf_` prefix was dropped in the Cloudflare→MediaMTX migration
    // but this mapper (shared by Radio and Live Music) was never updated, so live audio could
    // never actually play for either surface.
    hlsUrl: apiProgram.playback_hls_url || null,
    dashUrl: null,
    isLive: apiProgram.status === 'live',
    listenerCount: apiProgram.listener_count || apiProgram.online_followers || 0,
    status: (apiProgram.status === 'live' ? 'now' : (apiProgram.status === 'upcoming' ? 'next' : 'later')) as 'now' | 'next' | 'later',
    // Only present on MusicLiveSessionSerializer (Live Music) — RadioProgram has no
    // EngagementActionsMixin/like-comment support server-side, so these default to 0 there.
    likeCount: apiProgram.like_count || 0,
    commentCount: apiProgram.comment_count || 0,
    messages: []
  };
}

const EMPTY_COMMUNITY_POST_DATA = {
  id: "",
  artist: { username: "Membre", avatar: "", location: "Kivu", isVerified: false },
  author: { name: "Membre", avatar: "", isVerified: false },
  content: "",
  caption: "",
  image: null as string | null,
  coverImage: "",
  video: null as string | null,
  audio: null as string | null,
  likes: 0,
  comments: 0,
  time: "Récemment",
  timeAgo: "Récemment",
  title: "",
  duration: "0:00",
  tags: [] as string[],
  isPinnedResult: false,
  challengeTitle: undefined as string | undefined,
};

export function mapApiPostToCommunityItem(apiPost: ApiCommunityPost | null | undefined) {
  if (!apiPost) return { type: "talent", data: EMPTY_COMMUNITY_POST_DATA };

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
    // `submit_talent` (apps.community.views.CommunityPostViewSet) copies the submission's title
    // straight into `content` (that form has no separate caption field) — rendering both a bold
    // title line and an identical caption line under it would visibly duplicate the same text.
    caption: apiPost.content && apiPost.content !== apiPost.title ? apiPost.content : "",
    image: imageItem?.url || null,
    coverImage: imageItem?.url || "",
    video: videoItem?.url || null,
    audio: audioItem?.url || null,
    likes: apiPost.like_count || 0,
    comments: apiPost.comment_count || 0,
    // CommunityPostSerializer only ever returns a raw `created_at`, never a `created_at_human`
    // companion field — the latter always read undefined and fell straight to the fallback.
    time: formatRelativeDate(apiPost.created_at),
    timeAgo: formatRelativeDate(apiPost.created_at),
    title: apiPost.title || "",
    duration: apiPost.duration || "0:00",
    tags: Array.isArray(apiPost.tags) ? apiPost.tags.map((t) => typeof t === 'string' ? t : (t.name || t.label || "")) : [],
    // Both fields are live on the backend now (confirmed 2026-07-25, see BACKEND_GAPS.md).
    isPinnedResult: !!apiPost.is_pinned_result,
    // `challenge` may come back as `{id, slug, title}` or as a plain slug string — the real
    // shape hasn't been confirmed yet (no real challenge_response post existed to inspect at
    // the time this was written). Handling both rather than assuming one.
    challengeTitle:
      typeof apiPost.challenge === "object" && apiPost.challenge
        ? apiPost.challenge.title
        : typeof apiPost.challenge === "string"
        ? apiPost.challenge
        : undefined,
  };

  return {
    type: apiPost.post_type || "talent",
    data: data
  };
}

export function mapApiReleaseToFeaturedRelease(apiRelease: ApiRelease | null | undefined) {
  if (!apiRelease) return null;
  const date = apiRelease.release_date ? new Date(apiRelease.release_date) : new Date();
  return {
    id: apiRelease.slug || apiRelease.id?.toString(),
    slug: apiRelease.slug,
    href: apiRelease.slug ? `/sorties-premieres/${apiRelease.slug}` : "/sorties-premieres",
    title: apiRelease.title || "Nouvelle sortie",
    coverImage: apiRelease.cover_url || "",
    releaseDate: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
    rawDate: apiRelease.release_date || "",
    month: date.toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase(),
    day: date.getDate().toString().padStart(2, '0'),
    isPremiere: !!apiRelease.is_premiere,
    format: apiRelease.format?.toUpperCase() || "SINGLE",
    description: apiRelease.description || "",
    releaseInfo: apiRelease.artist_name || "Artiste",
    releaseIcon: "person",
    artistName: apiRelease.artist_name || "",
    // Only present on ReleaseDetailSerializer responses (retrieve/featured) — list responses
    // never include these (would be an N+1 per item), so they default to 0 there.
    likeCount: apiRelease.like_count || 0,
    commentCount: apiRelease.comment_count || 0,
    streamingLinks: apiRelease.streaming_links || {},
    previewUrl: apiRelease.preview_url || null,
  };
}

import type { CalendarMonth } from "@/types/sortiesPremieres";

/** Builds a full month grid for `ReleaseCalendar` from real release dates (`/releases/calendar/`
 * only returns a flat list of upcoming releases, not a pre-built grid) — `monthDate` can be any
 * day within the target month; `releaseDates` are raw ISO `release_date` strings. */
export function buildCalendarMonth(monthDate: Date, releaseDates: string[]): CalendarMonth {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay(); // 0 = Dimanche .. 6 = Samedi

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const monthStart = new Date(year, month, 1).getTime();
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1).getTime();
  const monthIsPast = monthStart < currentMonthStart;

  const eventDays = new Set(
    releaseDates
      .map((d) => new Date(d))
      .filter((d) => d.getFullYear() === year && d.getMonth() === month)
      .map((d) => d.getDate())
  );

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    return {
      day,
      colStart: day === 1 ? firstWeekday + 1 : undefined,
      isToday: isCurrentMonth && today.getDate() === day,
      isPast: monthIsPast || (isCurrentMonth && day < today.getDate()),
      hasEvent: eventDays.has(day),
    };
  });

  const label = monthDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  return { label: label.charAt(0).toUpperCase() + label.slice(1), days };
}

// ── Home page mappers ──────────────────────────────────────────────────────

import type { Hero, Track, MagazineArticle, NewsCard, ContentCard } from "@/types";

/**
 * Maps API banner object → Hero type used by HeroSection.
 * API shape: { image_url, title, subtitle, cta_label, cta_url }
 */
export function mapApiBannerToHero(apiBanner: ApiHeroBanner | null | undefined, fallback: Hero): Hero {
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
export function mapApiHitToTrack(apiHit: ApiHit, index: number): Track {
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
export function mapApiMagazineArticle(apiArticle: ApiMagazineArticle): MagazineArticle {
  return {
    id: apiArticle.slug || apiArticle.id?.toString() || Math.random().toString(),
    title: apiArticle.title || "Article",
    image: apiArticle.featured_image_url || apiArticle.image_url || "",
    category: (typeof apiArticle.category === "string" ? apiArticle.category : apiArticle.category?.name) || "Magazine",
    featured: !!apiArticle.is_featured,
    href: `/magazine/${apiArticle.slug || apiArticle.id}`,
    excerpt: apiArticle.excerpt || "",
  };
}

/**
 * Maps the API a_la_une object → array of NewsCard for NewsCarousel.
 * a_la_une: { artist_of_month, featured_podcast, featured_event }
 */
export function mapApiALaUneToNewsCards(aLaUne: ApiALaUne | null | undefined): NewsCard[] {
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

const CONTENT_A_UNE_STYLE: Record<
  string,
  { badge: string; badgeVariant: ContentCard["badgeVariant"]; ctaLabel: string; ctaVariant: ContentCard["ctaVariant"]; hrefBase: string }
> = {
  artist: { badge: "Artiste", badgeVariant: "primary", ctaLabel: "Voir le profil", ctaVariant: "primary", hrefBase: "/artistes" },
  emission: { badge: "Émission", badgeVariant: "teal", ctaLabel: "Regarder", ctaVariant: "teal", hrefBase: "/emissions" },
  article: { badge: "Article", badgeVariant: "navy", ctaLabel: "Lire l'article", ctaVariant: "primary", hrefBase: "/blog" },
};

/**
 * Maps a single API `contenus_a_la_une` item → ContentCard used by ContentCarousel.
 * API shape: { type: "artist"|"emission"|"article", id, slug, title, description, image_url }
 */
export function mapApiContentAUneToContentCard(item: ApiContentAUneItem): ContentCard {
  const style = CONTENT_A_UNE_STYLE[item.type || ""] || CONTENT_A_UNE_STYLE.article;
  const slug = item.slug || item.id?.toString() || "";
  return {
    id: `${item.type || "content"}-${item.id ?? slug}`,
    title: item.title || "",
    description: item.description || "",
    image: item.image_url || "",
    badge: style.badge,
    badgeVariant: style.badgeVariant,
    ctaLabel: style.ctaLabel,
    ctaVariant: style.ctaVariant,
    href: slug ? `${style.hrefBase}/${slug}` : style.hrefBase,
  };
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

export function mapApiBadgeToBadge(apiBadge: ApiBadge, unlocked: boolean, index: number) {
  const palette = BADGE_PALETTE[index % BADGE_PALETTE.length];
  return {
    id: apiBadge.slug || apiBadge.id?.toString() || Math.random().toString(),
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

export function mapApiMediaRankingToListenHistoryItem(apiItem: ApiMediaRankingItem) {
  const style = CONTENT_TYPE_ICON[apiItem.content_type ?? ""] || {
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

export function mapApiSavedItemToSavedEntry(apiItem: ApiSavedItem) {
  return {
    id: `${apiItem.kind}-${apiItem.id}`,
    title: apiItem.title || "",
    coverImage: apiItem.cover_url || "",
    href: typeToHref(SAVED_KIND_TO_SEARCH_TYPE[apiItem.kind ?? ""] || apiItem.kind || "", apiItem.slug, apiItem.id),
  };
}

// `GET /users/{id}/activity/` shares the exact same `_resolve_target()` `kind` vocabulary as
// `saved/` (both backed by `apps.accounts.profile_services`) — same href mapping applies.
export function mapApiActivityEntryToActivityEntry(apiEntry: ApiActivityEntry) {
  const target = apiEntry.target || {};
  return {
    id: `${apiEntry.action}-${target.kind}-${target.id}-${apiEntry.created_at}`,
    action: (apiEntry.action as "like" | "comment") || "like",
    createdAt: formatRelativeDate(apiEntry.created_at),
    excerpt: apiEntry.excerpt || undefined,
    targetTitle: target.title || "",
    targetCoverImage: target.cover_url || "",
    targetHref: typeToHref(SAVED_KIND_TO_SEARCH_TYPE[target.kind ?? ""] || target.kind || "", target.slug, target.id ?? ""),
  };
}

export function mapApiEmissionToEmissionCard(apiEmission: ApiEmission) {
  // No `ended_at`/`started_at` field exists on the backend — `endedAt` is the best available
  // estimate of when a recorded emission's original broadcast finished, derived from
  // `scheduled_at + duration_minutes`. `null` when `scheduled_at` is missing (never computed
  // from `created_at`, which is when the DB row was created, not when the show aired).
  const scheduledAt = apiEmission.scheduled_at;
  let endedAt: string | null = null;
  if (scheduledAt) {
    const start = new Date(scheduledAt);
    if (!Number.isNaN(start.getTime())) {
      endedAt = new Date(start.getTime() + (apiEmission.duration_minutes || 0) * 60000).toISOString();
    }
  }

  return {
    id: apiEmission.slug || apiEmission.id?.toString(),
    slug: apiEmission.slug,
    title: apiEmission.title,
    coverImage: apiEmission.cover_url || "",
    status: (apiEmission.status as EmissionStatus) || "recorded",
    isLive: apiEmission.status === "live",
    scheduledAt: apiEmission.scheduled_at || null,
    durationMinutes: apiEmission.duration_minutes || 0,
    viewerCount: apiEmission.viewer_count || 0,
    totalViews: apiEmission.total_views || 0,
    href: apiEmission.slug ? `/emissions/${apiEmission.slug}` : "/emissions",
    endedAt,
  };
}

export function mapApiEmissionToEmissionDetail(apiEmission: ApiEmission) {
  return {
    ...mapApiEmissionToEmissionCard(apiEmission),
    description: apiEmission.description || "",
    streamUrl: apiEmission.stream_url || "",
    hlsUrl: apiEmission.playback_hls_url || null,
    videoUrl: apiEmission.video_url || "",
    hostNames: apiEmission.host_names || [],
    likeCount: apiEmission.like_count || 0,
    commentCount: apiEmission.comment_count || 0,
  };
}

// The Magazine page was 100% hardcoded (no API call anywhere) — these two map real
// `/api/v1/articles/` data onto its Hero/News sections. `NewsArticle.variant` (tall-image /
// square-image / text-only / short-image) has no backend equivalent — it's a pure display
// heuristic, cycled by position so a real article list still gets the intended masonry variety.
const NEWS_VARIANTS: NewsArticle["variant"][] = ["tall-image", "square-image", "text-only", "short-image"];

export function mapApiArticleToMagazineHero(apiArticle: ApiMagazineArticle): HeroArticle {
  return {
    id: apiArticle.slug || apiArticle.id?.toString() || Math.random().toString(),
    slug: apiArticle.slug,
    tag: "À la une",
    readTime: apiArticle.read_time || 5,
    title: apiArticle.title,
    excerpt: apiArticle.excerpt || "",
    imageUrl: apiArticle.featured_image_url || "",
    imageAlt: apiArticle.title || "",
    author: {
      name: apiArticle.author_name || apiArticle.author?.username || "Rédaction",
      role: "Art du Kivu",
      avatarUrl: apiArticle.author?.avatar_url,
    },
  };
}

export function mapApiArticleToNewsArticle(apiArticle: ApiMagazineArticle, index: number): NewsArticle {
  const imageUrl = apiArticle.featured_image_url || "";
  const variant = imageUrl ? NEWS_VARIANTS[index % 3] : "text-only";
  return {
    id: apiArticle.slug || apiArticle.id?.toString() || Math.random().toString(),
    slug: apiArticle.slug,
    category: (typeof apiArticle.category === "string" ? apiArticle.category : apiArticle.category?.name) || "Culture",
    title: apiArticle.title,
    subtitle: apiArticle.excerpt || "",
    imageUrl,
    imageAlt: apiArticle.title || "",
    author: apiArticle.author_name ? { name: apiArticle.author_name } : undefined,
    date: formatRelativeDate(apiArticle.published_at),
    quote: variant === "text-only" ? apiArticle.excerpt || "" : undefined,
    variant,
  };
}
