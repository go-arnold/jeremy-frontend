import { apiFetch, PaginatedResponse } from "@/lib/api-client";
import type { ApiChallenge, ApiPoll, ApiCommunityPost } from "@/lib/api-types";

export async function fetchChallenges(page = 1) {
  return apiFetch<PaginatedResponse<ApiChallenge>>(`/api/v1/community/challenges/?page=${page}`);
}

// Submitting a response to a challenge (media + title + description) goes through
// useMediaSubmission → POST /community/challenges/{slug}/participate/ directly (see
// ChallengeResponseModal), not through this service file — it needs upload-progress callbacks
// that a plain service function doesn't carry.

// Participations render as posts (post_type "challenge_response") — see
// docs/COMMUNAUTE_BACKEND_REQUIREMENTS.md §3.2/§3.4. Not live on the backend yet; callers should
// treat an empty/erroring result as "no participations to show yet", not a hard failure.
export async function fetchChallengeParticipations(slug: string, page = 1) {
  const params = new URLSearchParams({
    page: String(page),
    page_size: "15",
    post_type: "challenge_response",
    challenge: slug,
  });
  return apiFetch<PaginatedResponse<ApiCommunityPost>>(`/api/v1/community/posts/?${params.toString()}`);
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
