import { feedItems as mockedFeed, mockChallenges, mockPolls } from "@/data/communaute";
import { apiFetch, PaginatedResponse } from "@/lib/api-client";
import { mapApiPostToCommunityItem } from "@/lib/mappers";
import { fetchChallenges, fetchPolls } from "@/lib/services/community";
import type { ApiChallenge, ApiPoll, ApiCommunityPost } from "@/lib/api-types";
import CommunautePageClient from "./CommunautePageClient";

// ISR — refetches at most every 60s instead of freezing at build time forever.
export const revalidate = 60;

type MappedPost = ReturnType<typeof mapApiPostToCommunityItem>;

async function getInitialData() {
  let posts: MappedPost[] = [];
  let hasMore = false;

  try {
    // Initial load is always the unfiltered "Tous" feed — CommunautePageClient's own
    // buildEndpoint() takes over for every filter change after that.
    const data = await apiFetch<PaginatedResponse<ApiCommunityPost>>(
      `/api/v1/community/posts/?page=1&page_size=15`
    );
    posts = data.results.map(mapApiPostToCommunityItem);
    hasMore = !!data.next;
  } catch (error) {
    console.error("Failed to fetch community feed:", error);
    posts = mockedFeed as unknown as MappedPost[];
  }

  let challenges: ApiChallenge[] = mockChallenges;
  try {
    const data = await fetchChallenges();
    challenges = data.results.length > 0 ? data.results : mockChallenges;
  } catch {
    challenges = mockChallenges;
  }

  let polls: ApiPoll[] = mockPolls;
  try {
    const data = await fetchPolls();
    polls = data.results.length > 0 ? data.results : mockPolls;
  } catch {
    polls = mockPolls;
  }

  // Real total count for the "Talents" stat — a `page_size=1` fetch only reads `.count` from
  // the response, never the actual post, so this stays cheap.
  let talentCount = 0;
  try {
    const data = await apiFetch<PaginatedResponse<ApiCommunityPost>>(
      `/api/v1/community/posts/?post_type=talent&page_size=1`
    );
    talentCount = data.count;
  } catch {
    talentCount = 0;
  }

  return { posts, hasMore, challenges, polls, talentCount };
}

export default async function CommunautePage() {
  const { posts, hasMore, challenges, polls, talentCount } = await getInitialData();

  return (
    <CommunautePageClient
      initialPosts={posts}
      initialHasMore={hasMore}
      initialChallenges={challenges}
      initialPolls={polls}
      initialTalentCount={talentCount}
    />
  );
}
