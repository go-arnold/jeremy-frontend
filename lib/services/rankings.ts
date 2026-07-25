import { apiFetch, PaginatedResponse } from "@/lib/api-client";
import { mapApiArtistToArtiste, mapApiReleaseToFeaturedRelease } from "@/lib/mappers";
import type { ApiArtistList, ApiRelease } from "@/lib/api-types";
import type { TopArtistItem, TopReleaseItem } from "@/types/rankings";

function toTopArtistItem(artist: ApiArtistList): TopArtistItem {
  const mapped = mapApiArtistToArtiste(artist);
  return {
    id: artist.id.toString(),
    slug: artist.slug,
    name: mapped.name,
    bio: artist.bio || "",
    image: mapped.image,
    href: mapped.href,
  };
}

function toTopReleaseItem(release: ApiRelease): TopReleaseItem {
  const mapped = mapApiReleaseToFeaturedRelease(release);
  return {
    id: (release.id?.toString() || release.slug || "").toString(),
    slug: release.slug || "",
    title: release.title || "Morceau",
    image: mapped?.coverImage || release.cover_url || "",
    artists: release.artist_name || "Artiste inconnu",
    listens: release.listen_count || 0,
    href: mapped?.href || "/sorties-premieres",
  };
}

export async function fetchTopArtists(pageSize = 50) {
  const data = await apiFetch<PaginatedResponse<ApiArtistList>>(
    `/api/v1/artists/?is_featured=true&page_size=${pageSize}`,
    { next: { revalidate: 3600 } }
  );
  return data.results.map(toTopArtistItem);
}

export async function fetchTopReleases(pageSize = 100) {
  const data = await apiFetch<PaginatedResponse<ApiRelease>>(
    `/api/v1/releases/?ordering=-listen_count&page_size=${pageSize}`,
    { next: { revalidate: 3600 } }
  );
  return data.results.map(toTopReleaseItem);
}
