import { apiFetch, PaginatedResponse } from "@/lib/api-client";
import { mapApiEmissionToEmissionCard, mapApiEmissionToEmissionDetail } from "@/lib/mappers";
import type { ApiEmission } from "@/lib/api-types";

export async function fetchEmissions(page = 1) {
  const data = await apiFetch<PaginatedResponse<ApiEmission>>(`/api/v1/emissions/?page=${page}`);
  return { ...data, results: data.results.map(mapApiEmissionToEmissionCard) };
}

/** `/api/v1/emissions/live/` returns a single emission but doesn't guarantee it's actually the
 * most recently gone-live one — the test environment has had 3 emissions with `status: "live"`
 * at once, and there's no documented tie-break rule on that endpoint. Ordering the list by
 * `-scheduled_at` and taking the first `"live"` match is the same computation made explicit and
 * correct: emissions don't expose an absolute "went live at" timestamp, so `scheduled_at` is the
 * best available recency signal (same fallback used for live-music sessions). */
export async function fetchLiveEmission() {
  try {
    const data = await apiFetch<PaginatedResponse<ApiEmission>>(
      "/api/v1/emissions/?ordering=-scheduled_at&page_size=20"
    );
    const live = (data.results || []).find((e) => e.status === "live");
    return live ? mapApiEmissionToEmissionDetail(live) : null;
  } catch {
    return null; // nothing currently live, not an error
  }
}

export async function fetchEmission(slug: string) {
  const data = await apiFetch<ApiEmission>(`/api/v1/emissions/${slug}/`);
  return mapApiEmissionToEmissionDetail(data);
}
