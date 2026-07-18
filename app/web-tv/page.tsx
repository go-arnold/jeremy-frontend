import { apiFetch, PaginatedResponse } from "@/lib/api-client";
import { mapApiVideoToWebTVVideo } from "@/lib/mappers";
import WebTVPageClient from "./WebTVPageClient";
import type { ApiVideo } from "@/lib/api-types";

type WebTVVideo = ReturnType<typeof mapApiVideoToWebTVVideo>;

export default async function WebTVPage() {
  let videos: WebTVVideo[] = [];
  let premiers: WebTVVideo[] = [];
  let liveVideo: WebTVVideo | null = null;
  let hasMore = false;

  try {
    const [videoData, premierData, live] = await Promise.all([
      apiFetch<PaginatedResponse<ApiVideo>>("/api/v1/webtv/videos/?page_size=15"),
      apiFetch<PaginatedResponse<ApiVideo> | ApiVideo[]>("/api/v1/webtv/videos/premiers/"),
      // 404 means "nothing is live right now" — not an error, so it's caught locally
      // instead of failing the whole Promise.all.
      apiFetch<ApiVideo>("/api/v1/webtv/videos/live/").catch(() => null),
    ]);

    videos = videoData.results.map(mapApiVideoToWebTVVideo);
    hasMore = !!videoData.next;

    const premierResults = Array.isArray(premierData) ? premierData : premierData.results || [];
    premiers = premierResults.map(mapApiVideoToWebTVVideo);

    liveVideo = live ? mapApiVideoToWebTVVideo(live) : null;
  } catch (error) {
    console.error("Failed to fetch WebTV initial data:", error);
  }

  return (
    <WebTVPageClient
      initialVideos={videos}
      initialPremiers={premiers}
      initialLiveVideo={liveVideo}
      initialHasMore={hasMore}
    />
  );
}
