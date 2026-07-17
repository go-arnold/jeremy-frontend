import { apiFetch, PaginatedResponse } from "@/lib/api-client";
import type { ApiChallenge, ApiPoll } from "@/types/communaute";

export async function fetchChallenges(page = 1) {
  return apiFetch<PaginatedResponse<ApiChallenge>>(`/api/v1/community/challenges/?page=${page}`);
}

export async function joinChallenge(slug: string) {
  return apiFetch<{ detail: string }>(`/api/v1/community/challenges/${slug}/join/`, {
    method: "POST",
  });
}

export async function fetchPolls(page = 1) {
  return apiFetch<PaginatedResponse<ApiPoll>>(`/api/v1/community/polls/?page=${page}`);
}

export async function voteOnPoll(pollId: number, optionId: number) {
  return apiFetch<ApiPoll>(`/api/v1/community/polls/${pollId}/vote/`, {
    method: "POST",
    body: JSON.stringify({ option_id: optionId }),
  });
}
