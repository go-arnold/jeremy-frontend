"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  formatFilters as mockedFilters,
  featuredRelease as mockedFeatured,
  mockReleaseDates,
  upcomingReleases as mockedUpcoming,
} from "@/data/sortiesPremieres";
import FormatFilters       from "@/components/sortiesPremieres/FormatFilters";
import FeaturedReleaseHero from "@/components/sortiesPremieres/FeaturedReleaseHero";
import ReleaseCalendar     from "@/components/sortiesPremieres/ReleaseCalendar";
import UpcomingReleaseCard from "@/components/sortiesPremieres/UpcomingReleaseCard";
import { apiFetch } from "@/lib/api-client";
import { mapApiReleaseToFeaturedRelease } from "@/lib/mappers";
import { fetchFeaturedRelease, fetchReleaseCalendar } from "@/lib/services/releases";
import EmptyState from "@/components/ui/EmptyState";
import VoirPlusPagination from "@/components/ui/VoirPlusPagination";
import type {
  FeaturedRelease,
  UpcomingRelease,
  FormatFilter,
} from "@/types/sortiesPremieres";

export default function SortiesPremieresPage() {
  const [releases, setReleases] = useState<any[]>([]);
  const [featured, setFeatured] = useState<FeaturedRelease | null>(null);
  const [calendarDates, setCalendarDates] = useState<string[]>(mockReleaseDates);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const data = await apiFetch<any>("/api/v1/releases/?page_size=15");
        const results = data.results || (Array.isArray(data) ? data : []);
        setReleases(results.map(mapApiReleaseToFeaturedRelease));
        setHasMore(!!data.next);
      } catch (error) {
        console.error("Failed to fetch releases initial data:", error);
        setReleases(mockedUpcoming as any);
      }

      const featuredResult = await fetchFeaturedRelease();
      if (featuredResult) setFeatured(featuredResult as any);

      try {
        const calendarReleases = await fetchReleaseCalendar();
        const dates = calendarReleases.map((r: any) => r?.rawDate).filter(Boolean);
        if (dates.length > 0) setCalendarDates(dates);
      } catch (error) {
        console.error("Failed to fetch release calendar:", error);
      }

      setLoading(false);
      setInitialDataLoaded(true);
    }
    init();
  }, []);

  const loadMore = async (page: number) => {
    setLoadingLoadingMore(true);
    try {
      const data = await apiFetch<any>(`/api/v1/releases/?page=${page}&page_size=15`);
      const results = data.results || (Array.isArray(data) ? data : []);
      const newReleases = results.map(mapApiReleaseToFeaturedRelease);
      setReleases(prev => [...prev, ...newReleases]);
      setHasMore(!!data.next);
    } catch (error) {
      console.error("Failed to load more releases:", error);
      setHasMore(false);
    } finally {
      setLoadingLoadingMore(false);
    }
  };

  const showEmptyState = initialDataLoaded && releases.length === 0;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const featuredRelease = featured || releases.find(r => r.isPremiere) || releases[0] || mockedFeatured;
  const upcomingReleases = releases;

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">

      {/* MOBILE */}
      <main className="lg:hidden max-w-md mx-auto px-4 py-6 pb-24">
        <div className="mb-8">
          <h2 className="text-4xl font-extrabold tracking-tight mb-2 leading-none">
            Sorties &amp; Premières
          </h2>
          <p className="text-slate-400 font-medium">
            Les nouveautés musicales, clips et documentaires du Kivu
          </p>
        </div>
        <FormatFilters filters={mockedFilters} />
        {showEmptyState ? (
          <EmptyState 
            message="Aucune sortie prévue" 
            description="Le calme avant la tempête musicale. Les premières du Kivu arrivent bientôt."
            icon="release_alert"
          />
        ) : (
          <>
            <FeaturedReleaseHero release={featuredRelease as any} />
            <ReleaseCalendar releaseDates={calendarDates} />
            <div className="space-y-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">event_upcoming</span>
                À ne pas manquer
              </h3>
              {upcomingReleases.map((release) => (
                <UpcomingReleaseCard key={release.id} release={release as any} />
              ))}
            </div>
            <VoirPlusPagination 
              onLoadMore={loadMore} 
              hasMore={hasMore} 
              isLoading={loadingMore} 
            />
          </>
        )}
      </main>

      {/* DESKTOP */}
      <div className="hidden lg:block w-full pb-16">
        <div className="max-w-7xl mx-auto px-8 w-full">

          <div className="flex items-end justify-between py-10 border-b border-white/10 mb-10">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-primary mb-2">
                Art du Kivu
              </p>
              <h1 className="text-5xl font-black text-[#F0EDE8] leading-tight">
                Sorties &amp; <span className="text-primary">Premières</span>
              </h1>
              <p className="text-[#8A8178] mt-2 text-base">
                Les nouveautés musicales, clips et documentaires du Kivu
              </p>
            </div>
            <FormatFiltersDesktop filters={mockedFilters} />
          </div>

          {showEmptyState ? (
            <EmptyState 
              message="Pas de sorties pour le moment" 
              description="Nos artistes sont en studio. Revenez bientôt pour découvrir les pépites du Kivu."
            />
          ) : (
            <>
              <div className="grid grid-cols-[420px_1fr] gap-10 items-start">
                <div className="sticky top-24">
                  <FeaturedReleaseHeroDesktop release={featuredRelease as any} />
                </div>
                <div className="flex flex-col gap-8">
                  <ReleaseCalendar releaseDates={calendarDates} />
                  <UpcomingReleasesDesktop releases={upcomingReleases as any} />
                </div>
              </div>
              <VoirPlusPagination 
                onLoadMore={loadMore} 
                hasMore={hasMore} 
                isLoading={loadingMore} 
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}


/* ════════════════════════════════════════════════════
   VARIANTES DESKTOP
════════════════════════════════════════════════════ */

function FormatFiltersDesktop({ filters }: { filters: FormatFilter[] }) {
  return (
    <div className="flex items-center gap-2">
      {filters.map((f, i) => (
        <button
          key={f.id}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            i === 0
              ? "bg-primary text-white shadow-lg shadow-primary/20"
              : "bg-white/5 border border-white/10 text-[#8A8178] hover:text-[#F0EDE8] hover:bg-white/10"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

function FeaturedReleaseHeroDesktop({ release }: { release: FeaturedRelease }) {
  return (
    <div className="flex flex-col">
      <div
        className="relative w-full rounded-t-2xl overflow-hidden group"
        style={{ aspectRatio: "3/4" }}
      >
        <img
          alt={release.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={release.coverImage}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />

        {release.isPremiere && (
          <div className="absolute top-4 left-4">
            <div className="bg-primary px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              <span className="text-[10px] font-black uppercase text-white tracking-widest">
                Première
              </span>
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-primary font-bold text-sm mb-1">{release.month}</p>
          <h2 className="text-3xl font-black text-white leading-tight mb-2">{release.title}</h2>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <span className="material-symbols-outlined text-sm">calendar_today</span>
            <span>{release.releaseDate}</span>
          </div>
        </div>
      </div>

      <div
        className="rounded-b-2xl px-6 py-5"
        style={{
          background: "rgba(18,34,60,0.9)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderTop: "none",
        }}
      >
        <Link
          href={release.href || "/sorties-premieres"}
          className="w-full bg-primary hover:bg-[#B8240C] text-white font-black py-3.5 rounded-xl text-sm uppercase tracking-wider transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">open_in_new</span>
          Voir la sortie
        </Link>
        <p className="text-center text-[#8A8178] text-xs mt-3">
          Sortie le {release.releaseDate}
        </p>
      </div>
    </div>
  );
}

function UpcomingReleasesDesktop({ releases }: { releases: UpcomingRelease[] }) {
  return (
    <section className="flex flex-col gap-5">
      <h3 className="text-xl font-black text-[#F0EDE8] flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-xl">event_upcoming</span>
        À ne pas manquer
      </h3>

      <div className="grid grid-cols-2 gap-5">
        {releases.map((release) => (
          <div
            key={release.id}
            className="group flex flex-col rounded-2xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-300"
            style={{ background: "rgba(18,34,60,0.5)" }}
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                alt={release.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                src={release.coverImage}
              />
              <div className="absolute top-3 left-3 bg-white text-[#12100F] p-2 rounded-xl text-center min-w-[46px] shadow-lg">
                <span className="block text-lg font-black leading-none">{release.day}</span>
                <span className="block text-[9px] font-black uppercase">{release.month}</span>
              </div>
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">
                <span className="text-[10px] font-black text-primary uppercase tracking-wider">
                  {release.format}
                </span>
              </div>
            </div>

            <div className="p-4 flex flex-col gap-2 flex-1">
              <h4 className="text-[#F0EDE8] font-bold text-base leading-snug group-hover:text-primary transition-colors line-clamp-1">
                {release.title}
              </h4>
              <p className="text-[#8A8178] text-xs leading-relaxed line-clamp-2 flex-1">
                {release.description}
              </p>
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                <div className="flex items-center gap-1 text-[#8A8178] text-xs">
                  <span className="material-symbols-outlined text-xs">{release.releaseIcon}</span>
                  <span>{release.releaseInfo}</span>
                </div>
                <Link
                  href={(release as any).href || "/sorties-premieres"}
                  className="text-primary text-xs font-bold flex items-center gap-1 hover:text-[#F0EDE8] transition-colors"
                >
                  Détails
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
