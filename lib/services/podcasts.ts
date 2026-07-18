import { apiFetch, PaginatedResponse } from "@/lib/api-client";
import { mapApiPodcastToEpisode, mapApiEpisodeToPodcastEpisode } from "@/lib/mappers";
import type { ApiEpisode } from "@/lib/api-types";

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
