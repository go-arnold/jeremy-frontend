"use client";

import { useRef, useState } from "react";
import Link from "next/link";

import PodcastCategoryFilter from "@/components/podcasts/PodcastCategoryFilter";
import FeaturedEpisodeCard   from "@/components/podcasts/FeaturedEpisodeCard";
import RecentEpisodesList    from "@/components/podcasts/RecentEpisodesList";
import PodcastEpisodeCard    from "@/components/podcasts/PodcastEpisodeCard";
import ContentImage from "@/components/ui/ContentImage";
import { apiFetch, PaginatedResponse } from "@/lib/api-client";
import { mapApiPodcastToEpisode } from "@/lib/mappers";
import EmptyState from "@/components/ui/EmptyState";
import VoirPlusPagination from "@/components/ui/VoirPlusPagination";
import type { PodcastListItem } from "@/types/podcasts";
import type { ApiEpisode } from "@/lib/api-types";

const MOBILE_PREVIEW_LIMIT = 3;
const DESKTOP_PREVIEW_LIMIT = 5;

interface PodcastsPageClientProps {
  initialEpisodes: PodcastListItem[];
  initialCategories: string[];
  initialCategoryIdByLabel: Record<string, string>;
  initialHasMore: boolean;
}

export default function PodcastsPageClient({
  initialEpisodes,
  initialCategories,
  initialCategoryIdByLabel,
  initialHasMore,
}: PodcastsPageClientProps) {
  const [episodes, setEpisodes] = useState<PodcastListItem[]>(initialEpisodes);
  const [categories] = useState<string[]>(initialCategories);
  const [categoryIdByLabel] = useState<Record<string, string>>(initialCategoryIdByLabel);
  const [activeCategory, setActiveCategory] = useState("Tout");
  const [showAll, setShowAll] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [loadingMore, setLoadingLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const mobileResultsRef = useRef<HTMLDivElement>(null);
  const desktopResultsRef = useRef<HTMLDivElement>(null);

  // Stable regardless of category filtering — computed once from the initial unfiltered load so
  // "À la une" doesn't change or disappear just because the user picked a category below it.
  const [featuredEpisode] = useState<PodcastListItem | null>(
    () => initialEpisodes.find((e) => e.isFeatured) || initialEpisodes[0] || null
  );

  const buildEpisodesUrl = (category: string, page: number) => {
    const params = new URLSearchParams({ page: String(page), page_size: "15" });
    const categoryId = categoryIdByLabel[category];
    if (category !== "Tout" && categoryId) params.set("category", categoryId);
    return `/api/v1/podcasts/episodes/?${params.toString()}`;
  };

  const handleCategoryChange = async (category: string) => {
    if (category === activeCategory) return;
    setActiveCategory(category);
    setListLoading(true);
    try {
      const data = await apiFetch<PaginatedResponse<ApiEpisode>>(buildEpisodesUrl(category, 1));
      setEpisodes(data.results.map(mapApiPodcastToEpisode));
      setHasMore(!!data.next);
    } catch (error) {
      console.error("Failed to filter podcasts by category:", error);
      setEpisodes([]);
      setHasMore(false);
    } finally {
      setListLoading(false);
    }
  };

  const loadMore = async (page: number) => {
    setLoadingLoadingMore(true);
    try {
      const data = await apiFetch<PaginatedResponse<ApiEpisode>>(buildEpisodesUrl(activeCategory, page));
      const newEps = data.results.map(mapApiPodcastToEpisode);
      setEpisodes((prev) => [...prev, ...newEps]);
      setHasMore(!!data.next);
    } catch (error) {
      console.error("Failed to load more podcasts:", error);
      setHasMore(false);
    } finally {
      setLoadingLoadingMore(false);
    }
  };

  const isFiltering = activeCategory !== "Tout";
  const expanded = showAll || isFiltering;

  const handleToggleExpanded = () => {
    if (expanded) {
      if (isFiltering) handleCategoryChange("Tout");
      setShowAll(false);
    } else {
      setShowAll(true);
      requestAnimationFrame(() => {
        mobileResultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        desktopResultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  // Everything except the pinned "À la une" pick — the same list backs both the compact preview
  // (mobile carousel / desktop sidebar) and the expanded/filtered view.
  const others = episodes.filter((e) => e.id !== featuredEpisode?.id);
  // Mobile keeps its 3-card preview visible and appends the rest below on "Tout voir" instead of
  // replacing it; desktop keeps its own 5-card sidebar cap.
  const mobilePreview = others.slice(0, MOBILE_PREVIEW_LIMIT);
  const mobileRemaining = others.slice(MOBILE_PREVIEW_LIMIT);
  const desktopPreview = others.slice(0, DESKTOP_PREVIEW_LIMIT);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">

      {/* MOBILE */}
      <main className="lg:hidden pb-14">
        <PodcastCategoryFilter categories={categories} active={activeCategory} onChange={handleCategoryChange} />
        {featuredEpisode && <FeaturedEpisodeCard episode={featuredEpisode} />}

        {/* Le carrousel des 3 premiers reste visible ; "Tout voir" ajoute le reste juste en
         * dessous au lieu de le remplacer. */}
        <RecentEpisodesList
          episodes={mobilePreview}
          expanded={expanded}
          onToggleExpanded={handleToggleExpanded}
        />

        {listLoading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : expanded && mobilePreview.length > 0 ? (
          <div ref={mobileResultsRef} className="px-4 mt-3 flex flex-col gap-3">
            {mobileRemaining.map((ep) => (
              <PodcastEpisodeCard key={ep.id} episode={ep} />
            ))}
            <VoirPlusPagination onLoadMore={loadMore} hasMore={hasMore} isLoading={loadingMore} />
          </div>
        ) : null}
      </main>

      {/* DESKTOP */}
      <main className="hidden lg:flex flex-col pb-16">

        <div className="max-w-[1600px] mx-auto px-8 w-full">
          <div className="flex items-end justify-between py-10 border-b border-white/10 mb-8">
            <div>
              <h1 className="text-4xl font-black text-[#F0EDE8] leading-tight">
                Podcasts
              </h1>
              <p className="text-[#8A8178] mt-2 text-sm">
                Interviews, culture et sons du Kivu
              </p>
            </div>
            <PodcastFilterDesktop
              categories={categories}
              active={activeCategory}
              onChange={handleCategoryChange}
            />
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-8 w-full flex flex-col gap-12">
          <div className="grid grid-cols-[11fr_9fr] gap-8 items-start">
            {featuredEpisode && <FeaturedEpisodeDesktop episode={featuredEpisode} />}

            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-[#F0EDE8] uppercase tracking-wide">
                  Récents
                </h2>
                {others.length > 0 && (
                  <button
                    onClick={handleToggleExpanded}
                    className="text-primary text-sm font-bold hover:text-[#F0EDE8] transition-colors"
                  >
                    {expanded ? "Réduire" : "Tout voir"}
                  </button>
                )}
              </div>

              {expanded ? (
                <p className="flex items-center gap-2 text-[#8A8178] text-sm py-6">
                  <span className="material-symbols-outlined text-primary text-lg">arrow_downward</span>
                  Résultats affichés ci-dessous
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {desktopPreview.map((ep) => (
                    <RecentEpisodeRowDesktop key={ep.id} episode={ep} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {expanded && (
            <div ref={desktopResultsRef} className="pt-2 pb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-black text-[#F0EDE8] uppercase tracking-wide">
                  {isFiltering ? "Résultats" : "Tous les épisodes"}
                </h2>
                <button
                  onClick={handleToggleExpanded}
                  className="text-sm font-bold text-primary hover:text-[#F0EDE8] transition-colors"
                >
                  Réduire
                </button>
              </div>

              {listLoading ? (
                <div className="flex justify-center py-16">
                  <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              ) : others.length === 0 ? (
                <EmptyState
                  message="Aucun épisode dans cette catégorie"
                  description="Essayez une autre catégorie."
                  icon="mic_off"
                />
              ) : (
                <div className="grid grid-cols-4 gap-5">
                  {others.map((ep) => (
                    <PodcastGridCardDesktop key={ep.id} episode={ep} />
                  ))}
                </div>
              )}

              <div className="mt-8">
                <VoirPlusPagination onLoadMore={loadMore} hasMore={hasMore} isLoading={loadingMore} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ── Components defined in same file (moved below page for clarity) ──

function PodcastFilterDesktop({
  categories,
  active,
  onChange,
}: {
  categories: string[];
  active: string;
  onChange: (cat: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2 max-w-md">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            cat === active
              ? "bg-primary text-white shadow-lg shadow-primary/20"
              : "bg-white/5 border border-white/10 text-[#8A8178] hover:text-[#F0EDE8] hover:bg-white/10"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

function seasonEpisodeLabel(episode: PodcastListItem): string | null {
  if (episode.seasonNumber && episode.episodeNumber) return `S${episode.seasonNumber} · Ép. ${episode.episodeNumber}`;
  if (episode.episodeNumber) return `Ép. ${episode.episodeNumber}`;
  if (episode.seasonNumber) return `Saison ${episode.seasonNumber}`;
  return null;
}

// Image only carries the "Nouveau" badge — title/duration/guest(s)/button sit below in a plain
// text block instead of overlaid on a gradient, so they stay legible no matter the cover photo
// (same principle as the mobile FeaturedEpisodeCard).
function FeaturedEpisodeDesktop({ episode }: { episode: PodcastListItem }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary">À la une</h2>
      <Link href={`/podcasts/${episode.slug}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl" style={{ height: "280px" }}>
          <ContentImage
            src={episode.image}
            alt={episode.title}
            className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 bg-primary text-white text-[10px] font-black rounded-lg tracking-wider uppercase">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
            </span>
            Nouveau
          </span>
        </div>

        <div className="pt-4 flex flex-col gap-2">
          <h3 className="text-2xl font-black text-[#F0EDE8] leading-tight truncate">{episode.title}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-[#8A8178] text-sm min-w-0">
              <span className="flex items-center gap-1.5 shrink-0">
                <span className="material-symbols-outlined text-sm">schedule</span>
                {episode.duration}
              </span>
              {episode.guestNames && (
                <span className="flex items-center gap-1.5 truncate">
                  <span className="material-symbols-outlined text-sm shrink-0">mic</span>
                  <span className="truncate">{episode.guestNames}</span>
                </span>
              )}
            </div>
            <span className="shrink-0 flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full font-black text-sm group-hover:scale-105 transition-all">
              <span className="material-symbols-outlined text-base">play_arrow</span>
              Écouter
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}

function RecentEpisodeRowDesktop({ episode }: { episode: PodcastListItem }) {
  const seasonEp = seasonEpisodeLabel(episode);
  return (
    <Link href={`/podcasts/${episode.slug}`} className="group flex items-center gap-4 p-4 rounded-2xl border border-white/5 hover:border-primary/25 transition-all duration-200" style={{ background: "rgba(18,34,60,0.4)" }}>
      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-surface-dark">
        <ContentImage src={episode.image} alt={episode.title} className="absolute inset-0" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-primary text-[10px] font-black uppercase tracking-wider mb-0.5">
          {seasonEp ? `${seasonEp} · ${episode.category}` : episode.category}
        </p>
        <p className="text-[#F0EDE8] text-sm font-bold leading-snug line-clamp-1 group-hover:text-primary transition-colors">{episode.title}</p>
        {episode.guestNames && <p className="text-[#8A8178] text-xs mt-0.5 truncate">{episode.guestNames}</p>}
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

function PodcastGridCardDesktop({ episode }: { episode: PodcastListItem }) {
  const seasonEp = seasonEpisodeLabel(episode);
  return (
    <Link href={`/podcasts/${episode.slug}`} className="group flex flex-col rounded-2xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-300" style={{ background: "rgba(18,34,60,0.5)" }}>
      <div className="relative aspect-square overflow-hidden">
        <ContentImage src={episode.image} alt={episode.title} className="absolute inset-0 transition-transform duration-500 group-hover:scale-110" />
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
          <span className="text-[#8A8178] text-[10px]">{seasonEp || episode.publishedAt}</span>
        </div>
        <h4 className="text-[#F0EDE8] font-bold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">{episode.title}</h4>
        {episode.guestNames && <p className="text-[#8A8178] text-xs line-clamp-1">{episode.guestNames}</p>}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
          <span className="text-[10px] font-medium text-[#4A443E] bg-white/5 px-2 py-1 rounded-lg">{episode.duration}</span>
          <div className="p-1.5 rounded-full hover:bg-white/10 text-[#8A8178] hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-lg">play_arrow</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
