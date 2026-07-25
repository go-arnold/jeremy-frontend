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
import LiveVideosCarousel from "@/components/webTv/LiveVideosCarousel";
import StudioSessionsSection from "@/components/webTv/StudioSessionsSection";
import FreestylesSection from "@/components/webTv/FreestylesSection";
import DocsSection from "@/components/webTv/DocsSection";
import InterviewsSection from "@/components/webTv/InterviewsSection";
import ConcertsSection from "@/components/webTv/ConcertsSection";
import { apiFetch, PaginatedResponse } from "@/lib/api-client";
import { mapApiVideoToWebTVVideo } from "@/lib/mappers";
import EmptyState from "@/components/ui/EmptyState";
import VoirPlusPagination from "@/components/ui/VoirPlusPagination";
import type { ApiVideo } from "@/lib/api-types";
import type { FreestyleVideo } from "@/types/webtv";

type WebTVVideo = ReturnType<typeof mapApiVideoToWebTVVideo>;

// FreestyleVideo requires an `aspect` ratio the shared WebTVVideo mapper shape doesn't carry
// (purely a display heuristic, no backend equivalent — same pattern as mappers.ts NEWS_VARIANTS).
const FREESTYLE_ASPECTS: FreestyleVideo["aspect"][] = ["3/4", "square", "9/16"];
function toFreestyleVideo(video: WebTVVideo, index: number): FreestyleVideo {
  return { ...video, aspect: FREESTYLE_ASPECTS[index % FREESTYLE_ASPECTS.length] };
}

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
      const data = await apiFetch<PaginatedResponse<ApiVideo>>(`/api/v1/webtv/videos/?page=${page}&page_size=15`);
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

  // Several videos can be live at once (each carries its own `is_live` in the general list) even
  // though the dedicated `/webtv/videos/live/` endpoint only ever surfaces a single "the" live
  // video — merge both sources so none is missed, then hand them all to the hero slot. More than
  // one live video pages through as a carousel; exactly one renders exactly as before.
  const liveVideos = videos.filter((v) => v.isLive);
  if (liveVideo && !liveVideos.some((v) => v.id === liveVideo.id)) liveVideos.unshift(liveVideo);

  // No live video at all → falls back to the VOD "premier" concept for the hero slot, same as
  // before (premiers/videos/live/ are three separate, unrelated backend endpoints).
  const nonLiveFallback = premiers[0] || videos.find((v) => v.isPremier) || mockedPremier;
  const heroVideos = liveVideos.length > 0 ? liveVideos : [nonLiveFallback];
  // Real category values are snake_case (WebTVVideo.CATEGORY_CHOICES: freestyles,
  // studio_sessions, docs, interviews, premiers, concerts) — not the Title-Case strings these
  // filters used to compare against, which never matched real API data.
  const studioSessions = videos.filter((v) => v.category === "studio_sessions");
  const freestyleVideos = videos.filter((v) => v.category === "freestyles");
  const docVideos = videos.filter((v) => v.category === "docs");
  const interviewVideos = videos.filter((v) => v.category === "interviews");
  const concertVideos = videos.filter((v) => v.category === "concerts");

  // Both the fixed site header (h-16 = 64px) and this sticky FilterBar sit on top of the
  // viewport once scrolled — a raw `#anchor`/`scrollIntoView` jump ignores them entirely and
  // lands each section's heading right underneath, looking like the click did nothing.
  // `scroll-mt-*` compensates so the section actually clears both bars.
  const SCROLL_MT = "scroll-mt-32 lg:scroll-mt-28";

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
            <div id="top" className={SCROLL_MT}>
              <LiveVideosCarousel videos={heroVideos} />
            </div>
            <LiveVsVideosSeparator isLive={liveVideos.length > 0} />
            <div id="studio-sessions" className={SCROLL_MT}><StudioSessionsSection variant="mobile" sessions={studioSessions.length > 0 ? studioSessions : mockedStudio} /></div>
            <div id="freestyles" className={SCROLL_MT}><FreestylesSection videos={freestyleVideos.length > 0 ? freestyleVideos.map(toFreestyleVideo) : mockedFreestyles} /></div>
            <div id="docs" className={SCROLL_MT}><DocsSection variant="mobile" docs={docVideos.length > 0 ? docVideos : mockedDocs} /></div>
            <div id="interviews" className={SCROLL_MT}><InterviewsSection variant="mobile" interviews={interviewVideos.length > 0 ? interviewVideos : mockedInterviews} /></div>
            <div id="concerts" className={SCROLL_MT}><ConcertsSection variant="mobile" concerts={concertVideos.length > 0 ? concertVideos : mockedConcerts} /></div>
            <VoirPlusPagination
              onLoadMore={loadMore}
              hasMore={hasMore}
              isLoading={loadingMore}
            />
          </main>

          {/* DESKTOP */}
          <main className="hidden lg:flex lg:flex-col mt-20 gap-10 pb-16 pt-6 max-w-[1800px] mx-auto w-full px-8">
            <div id="top" className={`grid grid-cols-[3fr_2fr] gap-6 items-start ${SCROLL_MT}`}>
              <LiveVideosCarousel videos={heroVideos} variant="desktop" />
              <div id="studio-sessions" className={SCROLL_MT}>
                <StudioSessionsSection variant="desktop" sessions={studioSessions.length > 0 ? studioSessions : mockedStudio} />
              </div>
            </div>
            <LiveVsVideosSeparator isLive={liveVideos.length > 0} />
            <div id="freestyles" className={SCROLL_MT}><FreestylesSection videos={freestyleVideos.length > 0 ? freestyleVideos.map(toFreestyleVideo) : mockedFreestyles} /></div>
            <div id="docs" className={SCROLL_MT}><DocsSection variant="desktop" docs={docVideos.length > 0 ? docVideos : mockedDocs} /></div>
            <div id="interviews" className={SCROLL_MT}><InterviewsSection variant="desktop" interviews={interviewVideos.length > 0 ? interviewVideos : mockedInterviews} /></div>
            <div id="concerts" className={SCROLL_MT}><ConcertsSection variant="desktop" concerts={concertVideos.length > 0 ? concertVideos : mockedConcerts} /></div>
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
        <span className="flex items-center gap-1.5 bg-primary text-white text-[9px] lg:text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider shrink-0 shadow-[0_0_16px_rgba(230,48,18,0.35)]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
          </span>
          En direct
        </span>
      )}
      <div className="kivu-divider flex-1" />
      <span className="text-[#8A8178] text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] shrink-0">
        Toutes les vidéos
      </span>
      <div className="kivu-divider flex-1" />
    </div>
  );
}
