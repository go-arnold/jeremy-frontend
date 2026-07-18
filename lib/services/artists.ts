import { apiFetch } from "@/lib/api-client";
import { mapApiArtistToArtiste } from "@/lib/mappers";
import type { ApiArtistList } from "@/lib/api-types";

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
