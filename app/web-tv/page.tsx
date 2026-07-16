"use client";

import React, { useState, useEffect } from "react";
import { 
  filterTabs as mockedFilterTabs, 
  premierVideo as mockedPremier, 
  studioSessions as mockedStudio, 
  freestyleVideos as mockedFreestyles, 
  docVideos as mockedDocs 
} from "@/data/webtv";
import FilterBar from "@/components/webTv/FilterBar";
import PremierSection from "@/components/webTv/PremierSection";
import PremierSectionDesktop from "@/components/webTv/PremierSectionDesktop";
import StudioSessionsSection from "@/components/webTv/StudioSessionsSection";
import StudioSessionsDesktop from "@/components/webTv/StudioSessionsDesktop";
import FreestylesSection from "@/components/webTv/FreestylesSection";
import FreestylesSectionDesktop from "@/components/webTv/FreestylesSectionDesktop";
import DocsSection from "@/components/webTv/DocsSection";
import DocsSectionDesktop from "@/components/webTv/DocsSectionDesktop";
import { apiFetch, PaginatedResponse } from "@/lib/api-client";
import { mapApiVideoToWebTVVideo } from "@/lib/mappers";
import EmptyState from "@/components/ui/EmptyState";
import VoirPlusPagination from "@/components/ui/VoirPlusPagination";

export default function WebTVPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [premiers, setPremiers] = useState<any[]>([]);
  const [liveVideo, setLiveVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const [videoData, premierData, live] = await Promise.all([
          apiFetch<PaginatedResponse<any>>("/api/v1/webtv/videos/?page_size=15"),
          apiFetch<any>("/api/v1/webtv/videos/premiers/"),
          // 404 means "nothing is live right now" — not an error, so it's caught locally
          // instead of failing the whole Promise.all.
          apiFetch<any>("/api/v1/webtv/videos/live/").catch(() => null),
        ]);

        setVideos(videoData.results.map(mapApiVideoToWebTVVideo));
        setHasMore(!!videoData.next);

        const premierResults = Array.isArray(premierData) ? premierData : (premierData.results || []);
        setPremiers(premierResults.map(mapApiVideoToWebTVVideo));

        setLiveVideo(live ? mapApiVideoToWebTVVideo(live) : null);
      } catch (error) {
        console.error("Failed to fetch WebTV initial data:", error);
        setVideos([]);
        setPremiers([]);
      } finally {
        setLoading(false);
        setInitialDataLoaded(true);
      }
    }
    init();
  }, []);

  const loadMore = async (page: number) => {
    setLoadingLoadingMore(true);
    try {
      const data = await apiFetch<PaginatedResponse<any>>(`/api/v1/webtv/videos/?page=${page}&page_size=15`);
      const newVideos = data.results.map(mapApiVideoToWebTVVideo);
      setVideos(prev => [...prev, ...newVideos]);
      setHasMore(!!data.next);
    } catch (error) {
      console.error("Failed to load more WebTV videos:", error);
      setHasMore(false);
    } finally {
      setLoadingLoadingMore(false);
    }
  };

  const showEmptyState = initialDataLoaded && videos.length === 0 && premiers.length === 0;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // A currently-live video takes priority over the VOD "premier" concept for the hero slot —
  // they're unrelated (premiers/videos/live/ are three separate backend endpoints).
  const premierVideo = liveVideo || premiers[0] || videos.find(v => v.isPremier) || mockedPremier;
  // Real category values are snake_case (WebTVVideo.CATEGORY_CHOICES: freestyles,
  // studio_sessions, docs, interviews, premiers, concerts) — not the Title-Case strings these
  // filters used to compare against, which never matched real API data.
  const studioSessions = videos.filter(v => v.category === "studio_sessions");
  const freestyleVideos = videos.filter(v => v.category === "freestyles");
  const docVideos = videos.filter(v => v.category === "docs");

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
            <div id="studio-sessions"><StudioSessionsSection sessions={studioSessions.length > 0 ? studioSessions as any : mockedStudio} /></div>
            <div id="freestyles"><FreestylesSection videos={freestyleVideos.length > 0 ? freestyleVideos as any : mockedFreestyles} /></div>
            <div id="docs"><DocsSection docs={docVideos.length > 0 ? docVideos as any : mockedDocs} /></div>
            <VoirPlusPagination 
              onLoadMore={loadMore} 
              hasMore={hasMore} 
              isLoading={loadingMore} 
            />
          </main>

          {/* DESKTOP */}
          <main className="hidden lg:flex lg:flex-col mt-20 gap-10 pb-16 pt-6 max-w-7xl mx-auto w-full px-8">
            <div className="grid grid-cols-[3fr_2fr] gap-6 items-start">
              <PremierSectionDesktop video={premierVideo as any} />
              <div id="studio-sessions"><StudioSessionsDesktop sessions={studioSessions.length > 0 ? studioSessions as any : mockedStudio} /></div>
            </div>
            <div id="freestyles"><FreestylesSectionDesktop videos={freestyleVideos.length > 0 ? freestyleVideos as any : mockedFreestyles} /></div>
            <div id="docs"><DocsSectionDesktop docs={docVideos.length > 0 ? docVideos as any : mockedDocs} /></div>
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


