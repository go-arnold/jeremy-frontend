import { apiFetch, PaginatedResponse } from "@/lib/api-client";
import { mapApiReleaseToFeaturedRelease } from "@/lib/mappers";
import type { ApiRelease } from "@/lib/api-types";

export async function fetchReleases(page = 1, pageSize = 15) {
  const data = await apiFetch<PaginatedResponse<ApiRelease>>(
    `/api/v1/releases/?page=${page}&page_size=${pageSize}`
  );
  return { ...data, results: data.results.map(mapApiReleaseToFeaturedRelease) };
}

export async function fetchFeaturedRelease() {
  try {
    const data = await apiFetch<ApiRelease>("/api/v1/releases/featured/");
    return mapApiReleaseToFeaturedRelease(data);
  } catch {
    return null;
  }
}

export async function fetchReleaseCalendar() {
  const data = await apiFetch<ApiRelease[]>("/api/v1/releases/calendar/");
  return data.map(mapApiReleaseToFeaturedRelease);
}

/** No `/sorties-premieres/[slug]` detail page exists yet — this is here so Step 3 can build
 * one without a further round-trip through the backend inventory. */
export async function fetchRelease(slug: string) {
  const data = await apiFetch<ApiRelease>(`/api/v1/releases/${slug}/`);
  return mapApiReleaseToFeaturedRelease(data);
}
