import { feedItems as mockedFeed, mockChallenges, mockPolls } from "@/data/communaute";
import { apiFetch, PaginatedResponse } from "@/lib/api-client";
import { mapApiPostToCommunityItem } from "@/lib/mappers";
import { fetchChallenges, fetchPolls } from "@/lib/services/community";
import type { ApiChallenge, ApiPoll } from "@/types/communaute";
import type { ApiCommunityPost } from "@/lib/api-types";
import CommunautePageClient from "./CommunautePageClient";

function buildEndpoint(filter: string, page: number): string {
  const params = new URLSearchParams({ page: String(page), page_size: "15" });
  if (filter === "goma" || filter === "bukavu") params.set("city", filter);
  else if (filter !== "tous") params.set("post_type", filter);
  return `/api/v1/community/posts/?${params.toString()}`;
}

type MappedPost = ReturnType<typeof mapApiPostToCommunityItem>;

async function getInitialData() {
  let posts: MappedPost[] = [];
  let hasMore = false;

  try {
    const data = await apiFetch<PaginatedResponse<ApiCommunityPost>>(buildEndpoint("tous", 1));
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

  return { posts, hasMore, challenges, polls };
}

export default async function CommunautePage() {
  const { posts, hasMore, challenges, polls } = await getInitialData();

  return (
    <CommunautePageClient
      initialPosts={posts}
      initialHasMore={hasMore}
      initialChallenges={challenges}
      initialPolls={polls}
    />
  );
}
