import { apiFetch, PaginatedResponse } from "@/lib/api-client";
import { mapApiPodcastToEpisode, mapApiEpisodeToPodcastEpisode, mapApiPodcastSeriesToPodcastShow } from "@/lib/mappers";
import type { ApiEpisode, ApiPodcastSeries } from "@/lib/api-types";

export async function fetchEpisodes(page = 1, pageSize = 15) {
  const data = await apiFetch<PaginatedResponse<ApiEpisode>>(
    `/api/v1/podcasts/episodes/?page=${page}&page_size=${pageSize}`
  );
  return { ...data, results: data.results.map(mapApiPodcastToEpisode) };
}

export async function fetchCategories() {
  return apiFetch<{ id: string; label: string }[]>("/api/v1/podcasts/categories/");
}

export async function fetchEpisode(slug: string) {
  const data = await apiFetch<ApiEpisode>(`/api/v1/podcasts/episodes/${slug}/`);
  return mapApiEpisodeToPodcastEpisode(data);
}

/** Play-count increment — call once when playback actually starts, not on every render. */
export async function recordEpisodePlay(slug: string) {
  return apiFetch<{ detail: string }>(`/api/v1/podcasts/episodes/${slug}/play/`, {
    method: "POST",
  });
}

// Likes/comments/share/save on an episode go through the generic engagement system —
// use `useEngagement("podcasts/episodes", slug)` / `<EngagementBar resourceType="podcasts/episodes" .../>`,
// not a dedicated function here.

export async function fetchPodcastShow(slug: string) {
  const data = await apiFetch<ApiPodcastSeries>(`/api/v1/podcasts/${slug}/`);
  return mapApiPodcastSeriesToPodcastShow(data);
}

// The spec declares this endpoint's response as `PodcastSeriesList` (a single show object) —
// almost certainly a drf-spectacular mis-detection (operationId has a stray `_2` suffix,
// suggesting an action-name collision during schema generation), since an "episodes" endpoint
// returning a show object wouldn't be useful. Treated as a paginated episode list, matching what
// the URL/action name implies and what `/podcasts/episodes/` (the flat list) actually returns —
// guarded at runtime in case the spec turns out to be right after all.
export async function fetchPodcastShowEpisodes(slug: string, page = 1, pageSize = 15) {
  const data = await apiFetch<PaginatedResponse<ApiEpisode> | ApiEpisode[]>(
    `/api/v1/podcasts/${slug}/episodes/?page=${page}&page_size=${pageSize}`
  );
  const results = Array.isArray(data) ? data : data.results || [];
  const hasMore = Array.isArray(data) ? false : !!data.next;
  return { results: results.map(mapApiPodcastToEpisode), hasMore };
}
