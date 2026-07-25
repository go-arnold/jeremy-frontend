import {
  podcastCategories as mockedCategories,
  mockPodcastEpisodes,
} from "@/data/podcasts";
import { apiFetch, PaginatedResponse } from "@/lib/api-client";
import { mapApiPodcastToEpisode } from "@/lib/mappers";
import PodcastsPageClient from "./PodcastsPageClient";
import type { ApiEpisode } from "@/lib/api-types";
import type { PodcastListItem } from "@/types/podcasts";

// ISR — refetches at most every 60s instead of freezing at build time forever.
export const revalidate = 60;

interface ApiPodcastCategory {
  id?: string | number;
  label?: string;
  title?: string;
  name?: string;
}

async function getInitialData() {
  try {
    const [epData, catData] = await Promise.all([
      apiFetch<PaginatedResponse<ApiEpisode>>("/api/v1/podcasts/episodes/?page_size=15"),
      apiFetch<ApiPodcastCategory[] | PaginatedResponse<ApiPodcastCategory>>(
        "/api/v1/podcasts/categories/"
      ),
    ]);

    const episodes = epData.results.map(mapApiPodcastToEpisode);
    const hasMore = !!epData.next;

    const catResults = Array.isArray(catData) ? catData : catData.results || [];
    const categoryIdByLabel: Record<string, string> = {};
    const mappedCategories = catResults.map((c) => {
      const label = c.label || c.title || c.name || "Podcast";
      if (c.id !== undefined) categoryIdByLabel[label] = String(c.id);
      return label;
    });

    return {
      episodes,
      categories: ["Tout", ...mappedCategories],
      categoryIdByLabel,
      hasMore,
    };
  } catch (error) {
    console.error("Failed to fetch podcasts initial data:", error);
    return {
      episodes: mockPodcastEpisodes as PodcastListItem[],
      categories: mockedCategories,
      categoryIdByLabel: {} as Record<string, string>,
      hasMore: false,
    };
  }
}

export default async function PodcastsPage() {
  const { episodes, categories, categoryIdByLabel, hasMore } = await getInitialData();

  return (
    <PodcastsPageClient
      initialEpisodes={episodes}
      initialCategories={categories}
      initialCategoryIdByLabel={categoryIdByLabel}
      initialHasMore={hasMore}
    />
  );
}
