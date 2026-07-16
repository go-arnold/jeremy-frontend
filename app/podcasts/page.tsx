"use client";

import React, { useState, useEffect } from "react";
import {
  podcastCategories as mockedCategories,
  featuredEpisode as mockedFeatured,
  selectionEpisode as mockedSelection,
  recentEpisodes as mockedRecent,
  latestPickEpisodes as mockedLatest,
} from "@/data/podcasts";

import PodcastCategoryFilter from "@/components/podcasts/PodcastCategoryFilter";
import FeaturedEpisodeCard   from "@/components/podcasts/FeaturedEpisodeCard";
import SelectionEpisodeCard  from "@/components/podcasts/SelectionEpisodeCard";
import RecentEpisodesList    from "@/components/podcasts/RecentEpisodesList";
import LatestPicksList       from "@/components/podcasts/LatestPicksList";
import Link from "next/link";
import { apiFetch, PaginatedResponse } from "@/lib/api-client";
import { mapApiPodcastToEpisode } from "@/lib/mappers";
import EmptyState from "@/components/ui/EmptyState";
import VoirPlusPagination from "@/components/ui/VoirPlusPagination";
import type { FeaturedEpisode, SelectionEpisode, RecentEpisode, LatestPickEpisode } from "@/types/podcasts";

export default function PodcastsPage() {
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const [epData, catData] = await Promise.all([
          apiFetch<PaginatedResponse<any>>("/api/v1/podcasts/episodes/?page_size=15"),
          apiFetch<any>("/api/v1/podcasts/categories/")
        ]);

        setEpisodes(epData.results.map(mapApiPodcastToEpisode));
        setHasMore(!!epData.next);

        const catResults = catData.results || (Array.isArray(catData) ? catData : []);
        const mappedCats = catResults.map((c: any) => typeof c === 'string' ? c : (c.label || c.title || c.name || "Podcast"));
        setCategories(["Tout", ...mappedCats]);
      } catch (error) {
        console.error("Failed to fetch podcasts initial data:", error);
        setEpisodes(mockedRecent as any);
        setCategories(mockedCategories as any);
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
      const data = await apiFetch<PaginatedResponse<any>>(`/api/v1/podcasts/episodes/?page=${page}&page_size=15`);
      const newEps = data.results.map(mapApiPodcastToEpisode);
      setEpisodes(prev => [...prev, ...newEps]);
      setHasMore(!!data.next);
    } catch (error) {
      console.error("Failed to load more podcasts:", error);
      setHasMore(false);
    } finally {
      setLoadingLoadingMore(false);
    }
  };

  const showEmptyState = initialDataLoaded && episodes.length === 0;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const featuredEpisode = episodes.find(e => e.id) || mockedFeatured;
  const selectionEpisode = episodes[1] || mockedSelection;
  const recentEpisodes = episodes.slice(0, 5);
  const latestPickEpisodes = episodes.slice(5);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">

      {showEmptyState ? (
        <main className="flex-1 flex items-center justify-center p-8">
          <EmptyState 
            message="Aucun podcast disponible" 
            description="Nos micros sont ouverts, les épisodes arrivent. Restez à l'écoute !"
            icon="mic_off"
          />
        </main>
      ) : (
        <>
          {/* MOBILE */}
          <main className="lg:hidden pb-14">
            <PodcastCategoryFilter categories={categories as any} />
            <FeaturedEpisodeCard episode={featuredEpisode as any} />
            <SelectionEpisodeCard episode={selectionEpisode as any} />
            <RecentEpisodesList episodes={recentEpisodes as any} />
            <LatestPicksList episodes={latestPickEpisodes as any} />
            <VoirPlusPagination 
              onLoadMore={loadMore} 
              hasMore={hasMore} 
              isLoading={loadingMore} 
            />
          </main>

          {/* DESKTOP */}
          <main className="hidden lg:flex flex-col pb-16">

            <div className="max-w-7xl mx-auto px-8 w-full">
              <div className="flex items-end justify-between py-10 border-b border-white/10 mb-8">
                <div>
                  <h1 className="text-5xl font-black text-[#F0EDE8] leading-tight">
                    Podcasts
                  </h1>
                  <p className="text-[#8A8178] mt-2 text-base">
                    Interviews, culture et sons du Kivu
                  </p>
                </div>
                <PodcastFilterDesktop categories={categories as any} />
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 w-full flex flex-col gap-12">
              <div className="grid grid-cols-[11fr_9fr] gap-8 items-start">
                <div className="flex flex-col gap-6">
                  <FeaturedEpisodeDesktop episode={featuredEpisode as any} />
                  <SelectionEpisodeDesktop episode={selectionEpisode as any} />
                </div>
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-[#F0EDE8] uppercase tracking-wide">
                      Récents
                    </h2>
                    <Link href="/podcasts" className="text-primary text-sm font-bold hover:text-[#F0EDE8] transition-colors">
                      Tout voir
                    </Link>
                  </div>
                  <div className="flex flex-col gap-3">
                    {recentEpisodes.map((ep) => (
                      <RecentEpisodeRowDesktop key={ep.id} episode={ep as any} />
                    ))}
                  </div>
                </div>
              </div>

              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-[#F0EDE8]">Sélection récente</h2>
                  <Link href="/podcasts" className="text-primary text-sm font-bold hover:text-[#F0EDE8] transition-colors">
                    Tout voir
                  </Link>
                </div>
                <div className="grid grid-cols-3 gap-5">
                  {latestPickEpisodes.map((ep) => (
                    <LatestPickCardDesktop key={ep.id} episode={ep as any} />
                  ))}
                </div>
              </section>

              <VoirPlusPagination 
                onLoadMore={loadMore} 
                hasMore={hasMore} 
                isLoading={loadingMore} 
              />
            </div>
          </main>
        </>
      )}
    </div>
  );
}

// ── Components defined in same file (moved below page for clarity) ──

function PodcastFilterDesktop({ categories }: { categories: string[] }) {
  return (
    <div className="flex items-center gap-2">
      {categories.map((cat, i) => (
        <div
          key={cat}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            i === 0
              ? "bg-primary text-white shadow-lg shadow-primary/20"
              : "bg-white/5 border border-white/10 text-[#8A8178] hover:text-[#F0EDE8] hover:bg-white/10"
          }`}
        >
          {cat}
        </div>
      ))}
    </div>
  );
}

function FeaturedEpisodeDesktop({ episode }: { episode: FeaturedEpisode }) {
  return (
    <section>
      <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4">À la une</h2>
      <Link href={`/podcasts/${episode.slug}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl shadow-2xl" style={{ height: "340px" }}>
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('${episode.image}')` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12223c] via-[#12223c]/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-7 flex flex-col gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-white text-[10px] font-black rounded-lg tracking-wider uppercase w-fit">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
              </span>
              Nouveau
            </span>
            <h3 className="text-3xl font-black text-white leading-tight">{episode.title}</h3>
            <p className="text-white/75 text-sm leading-relaxed line-clamp-2">{episode.description}</p>
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <span className="material-symbols-outlined text-sm">schedule</span>
                <span>{episode.duration}</span>
              </div>
              <div className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full font-black text-sm hover:scale-105 active:scale-95 transition-all cursor-pointer">
                <span className="material-symbols-outlined text-base">play_arrow</span>
                Écouter
              </div>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}

function SelectionEpisodeDesktop({ episode }: { episode: SelectionEpisode }) {
  return (
    <Link href={`/podcasts/${episode.slug}`} className="group block">
      <div className="flex gap-5 p-5 rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-300" style={{ background: "rgba(18,34,60,0.6)" }}>
        <div className="relative shrink-0 overflow-hidden rounded-xl" style={{ width: "120px", height: "120px" }}>
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url('${episode.image}')` }} />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xl ml-0.5">play_arrow</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between flex-1 min-w-0">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-primary text-[10px] font-black uppercase tracking-wider">{episode.category}</span>
              <span className="text-[#4A443E] text-[10px]">•</span>
              <span className="text-[#8A8178] text-[10px]">{episode.duration}</span>
            </div>
            <h3 className="text-[#F0EDE8] font-black text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">{episode.title}</h3>
            <p className="text-[#8A8178] text-sm mt-1 line-clamp-2 leading-relaxed">{episode.description}</p>
          </div>
          <div className="flex items-center gap-2 mt-2 text-[#8A8178] text-xs">
            <span className="material-symbols-outlined text-sm">mic</span>
            <span>Hôte : {episode.host}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function RecentEpisodeRowDesktop({ episode }: { episode: RecentEpisode }) {
  return (
    <Link href={`/podcasts/${episode.slug}`} className="group flex items-center gap-4 p-4 rounded-2xl border border-white/5 hover:border-primary/25 transition-all duration-200" style={{ background: "rgba(18,34,60,0.4)" }}>
      <div className="w-16 h-16 rounded-xl bg-cover bg-center shrink-0" style={{ backgroundImage: `url('${episode.image}')` }} />
      <div className="flex-1 min-w-0">
        <p className="text-primary text-[10px] font-black uppercase tracking-wider mb-0.5">{episode.category}</p>
        <p className="text-[#F0EDE8] text-sm font-bold leading-snug line-clamp-1 group-hover:text-primary transition-colors">{episode.title}</p>
        <p className="text-[#8A8178] text-xs mt-0.5">{episode.guest}</p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-[#8A8178] text-xs">{episode.duration}</span>
        <div className="w-9 h-9 flex items-center justify-center rounded-full bg-primary/15 text-primary border border-primary/20 hover:bg-primary/30 transition-colors">
          <span className="material-symbols-outlined text-lg">play_arrow</span>
        </div>
      </div>
    </Link>
  );
}

function LatestPickCardDesktop({ episode }: { episode: LatestPickEpisode }) {
  return (
    <Link href={`/podcasts/${episode.slug}`} className="group flex flex-col rounded-2xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-300" style={{ background: "rgba(18,34,60,0.5)" }}>
      <div className="relative aspect-square overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url('${episode.image}')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-xl">
            <span className="material-symbols-outlined text-white text-3xl ml-1">play_arrow</span>
          </div>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-primary text-[10px] font-black uppercase tracking-wider">{episode.category}</span>
          <span className="text-[#8A8178] text-[10px]">{episode.publishedAt}</span>
        </div>
        <h4 className="text-[#F0EDE8] font-bold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">{episode.title}</h4>
        <p className="text-[#8A8178] text-xs line-clamp-1">{episode.guest}</p>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
          <span className="text-[10px] font-medium text-[#4A443E] bg-white/5 px-2 py-1 rounded-lg">{episode.duration}</span>
          <div className="p-1.5 rounded-full hover:bg-white/10 text-[#8A8178] hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-lg">add_circle</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
