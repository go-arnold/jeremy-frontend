"use client";

import { useState } from "react";
import {
  filterTabs as mockedFilterTabs,
  premierVideo as mockedPremier,
  studioSessions as mockedStudio,
  freestyleVideos as mockedFreestyles,
  docVideos as mockedDocs,
  interviewVideos as mockedInterviews,
  concertVideos as mockedConcerts,
} from "@/data/webtv";
import FilterBar from "@/components/webTv/FilterBar";
import PremierSection from "@/components/webTv/PremierSection";
import StudioSessionsSection from "@/components/webTv/StudioSessionsSection";
import FreestylesSection from "@/components/webTv/FreestylesSection";
import DocsSection from "@/components/webTv/DocsSection";
import InterviewsSection from "@/components/webTv/InterviewsSection";
import ConcertsSection from "@/components/webTv/ConcertsSection";
import { apiFetch, PaginatedResponse } from "@/lib/api-client";
import { mapApiVideoToWebTVVideo } from "@/lib/mappers";
import EmptyState from "@/components/ui/EmptyState";
import VoirPlusPagination from "@/components/ui/VoirPlusPagination";

type WebTVVideo = ReturnType<typeof mapApiVideoToWebTVVideo>;

interface WebTVPageClientProps {
  initialVideos: WebTVVideo[];
  initialPremiers: WebTVVideo[];
  initialLiveVideo: WebTVVideo | null;
  initialHasMore: boolean;
}

export default function WebTVPageClient({
  initialVideos,
  initialPremiers,
  initialLiveVideo,
  initialHasMore,
}: WebTVPageClientProps) {
  const [videos, setVideos] = useState<WebTVVideo[]>(initialVideos);
  const [loadingMore, setLoadingLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);

  const premiers = initialPremiers;
  const liveVideo = initialLiveVideo;

  const loadMore = async (page: number) => {
    setLoadingLoadingMore(true);
    try {
      const data = await apiFetch<PaginatedResponse<any>>(`/api/v1/webtv/videos/?page=${page}&page_size=15`);
      const newVideos = data.results.map(mapApiVideoToWebTVVideo);
      setVideos((prev) => [...prev, ...newVideos]);
      setHasMore(!!data.next);
    } catch (error) {
      console.error("Failed to load more WebTV videos:", error);
      setHasMore(false);
    } finally {
      setLoadingLoadingMore(false);
    }
  };

  const showEmptyState = videos.length === 0 && premiers.length === 0;

  // A currently-live video takes priority over the VOD "premier" concept for the hero slot —
  // they're unrelated (premiers/videos/live/ are three separate backend endpoints).
  const premierVideo = liveVideo || premiers[0] || videos.find((v) => v.isPremier) || mockedPremier;
  // Real category values are snake_case (WebTVVideo.CATEGORY_CHOICES: freestyles,
  // studio_sessions, docs, interviews, premiers, concerts) — not the Title-Case strings these
  // filters used to compare against, which never matched real API data.
  const studioSessions = videos.filter((v) => v.category === "studio_sessions");
  const freestyleVideos = videos.filter((v) => v.category === "freestyles");
  const docVideos = videos.filter((v) => v.category === "docs");
  const interviewVideos = videos.filter((v) => v.category === "interviews");
  const concertVideos = videos.filter((v) => v.category === "concerts");

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">

      {/* FilterBar sticky — full width */}
      <FilterBar tabs={mockedFilterTabs} />

      {showEmptyState ? (
        <main className="flex-1 flex items-center justify-center p-8">
          <EmptyState
            message="WebTV en cours de production"
            description="Nos caméras tournent ! De nouvelles vidéos et documentaires arrivent très bientôt."
            icon="videocam_off"
          />
        </main>
      ) : (
        <>
          {/* MOBILE */}
          <main className="lg:hidden flex flex-col gap-8 pb-8 pt-4 mx-5">
            <PremierSection video={premierVideo as any} />
            <LiveVsVideosSeparator isLive={!!liveVideo} />
            <div id="studio-sessions"><StudioSessionsSection variant="mobile" sessions={studioSessions.length > 0 ? studioSessions as any : mockedStudio} /></div>
            <div id="freestyles"><FreestylesSection videos={freestyleVideos.length > 0 ? freestyleVideos as any : mockedFreestyles} /></div>
            <div id="docs"><DocsSection variant="mobile" docs={docVideos.length > 0 ? docVideos as any : mockedDocs} /></div>
            <div id="interviews"><InterviewsSection variant="mobile" interviews={interviewVideos.length > 0 ? interviewVideos as any : mockedInterviews} /></div>
            <div id="concerts"><ConcertsSection variant="mobile" concerts={concertVideos.length > 0 ? concertVideos as any : mockedConcerts} /></div>
            <VoirPlusPagination
              onLoadMore={loadMore}
              hasMore={hasMore}
              isLoading={loadingMore}
            />
          </main>

          {/* DESKTOP */}
          <main className="hidden lg:flex lg:flex-col mt-20 gap-10 pb-16 pt-6 max-w-7xl mx-auto w-full px-8">
            <div className="grid grid-cols-[3fr_2fr] gap-6 items-start">
              <PremierSection video={premierVideo as any} variant="desktop" />
              <StudioSessionsSection variant="desktop" sessions={studioSessions.length > 0 ? studioSessions as any : mockedStudio} />
            </div>
            <LiveVsVideosSeparator isLive={!!liveVideo} />
            <div id="freestyles"><FreestylesSection videos={freestyleVideos.length > 0 ? freestyleVideos as any : mockedFreestyles} /></div>
            <div id="docs"><DocsSection variant="desktop" docs={docVideos.length > 0 ? docVideos as any : mockedDocs} /></div>
            <div id="interviews"><InterviewsSection variant="desktop" interviews={interviewVideos.length > 0 ? interviewVideos as any : mockedInterviews} /></div>
            <div id="concerts"><ConcertsSection variant="desktop" concerts={concertVideos.length > 0 ? concertVideos as any : mockedConcerts} /></div>
            <VoirPlusPagination
              onLoadMore={loadMore}
              hasMore={hasMore}
              isLoading={loadingMore}
            />
          </main>
        </>
      )}
    </div>
  );
}

// ── Séparateur live / vidéos — distingue clairement le direct (le cas échéant) du reste ──
function LiveVsVideosSeparator({ isLive }: { isLive: boolean }) {
  return (
    <div className="flex items-center gap-3">
      {isLive && (
        <span className="flex items-center gap-1.5 bg-primary text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shrink-0">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
          </span>
          En direct
        </span>
      )}
      <div className="kivu-divider flex-1" />
      <span className="text-[#8A8178] text-xs font-black uppercase tracking-[0.2em] shrink-0">
        Toutes les vidéos
      </span>
      <div className="kivu-divider flex-1" />
    </div>
  );
}
