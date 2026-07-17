import { apiFetch, PaginatedResponse } from "@/lib/api-client";
import { mapApiEmissionToEmissionCard, mapApiEmissionToEmissionDetail } from "@/lib/mappers";

export async function fetchEmissions(page = 1) {
  const data = await apiFetch<PaginatedResponse<any>>(`/api/v1/emissions/?page=${page}`);
  return { ...data, results: data.results.map(mapApiEmissionToEmissionCard) };
}

export async function fetchLiveEmission() {
  try {
    const data = await apiFetch<any>("/api/v1/emissions/live/");
    return mapApiEmissionToEmissionDetail(data);
  } catch {
    return null; // 404 = nothing currently live, not an error
  }
}

export async function fetchEmission(slug: string) {
  const data = await apiFetch<any>(`/api/v1/emissions/${slug}/`);
  return mapApiEmissionToEmissionDetail(data);
}
