import { apiFetch, PaginatedResponse } from "@/lib/api-client";
import { mapApiArtistToArtiste, mapApiArtistDetailToArtisteDetail } from "@/lib/mappers";
import type { ApiArtistList, ApiArtistDetail, ApiGenre } from "@/lib/api-types";

export async function fetchArtists(page = 1, pageSize = 15, genre?: string) {
  const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
  if (genre) params.set("genre", genre);
  const data = await apiFetch<PaginatedResponse<ApiArtistList>>(`/api/v1/artists/?${params.toString()}`);
  return { ...data, results: data.results.map(mapApiArtistToArtiste) };
}

export async function fetchArtistGenres() {
  return apiFetch<ApiGenre[] | PaginatedResponse<ApiGenre>>("/api/v1/artists/genres/");
}

export async function fetchArtist(slug: string) {
  const data = await apiFetch<ApiArtistDetail>(`/api/v1/artists/${slug}/`);
  return mapApiArtistDetailToArtisteDetail(data);
}

export async function fetchFavoriteArtists(userId: string | number) {
  const data = await apiFetch<ApiArtistList[]>(`/api/v1/users/${userId}/favorites/`);
  return data.map(mapApiArtistToArtiste);
}

/** Toggles favorite status for `artistId` — POSTing again on an already-favorited artist
 * un-favorites it (same endpoint, single toggle action, per `UserViewSet.favorites`). */
export async function toggleFavoriteArtist(userId: string | number, artistId: string | number) {
  return apiFetch<{ action: "added" | "removed"; artist_id: number }>(
    `/api/v1/users/${userId}/favorites/`,
    { method: "POST", body: JSON.stringify({ artist_id: artistId }) }
  );
}
