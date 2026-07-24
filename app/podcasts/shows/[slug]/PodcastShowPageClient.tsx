"use client";

import { useState } from "react";
import Link from "next/link";
import ContentImage from "@/components/ui/ContentImage";
import PodcastEpisodeCard from "@/components/podcasts/PodcastEpisodeCard";
import VoirPlusPagination from "@/components/ui/VoirPlusPagination";
import EmptyState from "@/components/ui/EmptyState";
import { fetchPodcastShowEpisodes } from "@/lib/services/podcasts";
import type { PodcastShow, PodcastListItem } from "@/types/podcasts";

interface Props {
  show: PodcastShow;
  initialEpisodes: PodcastListItem[];
  initialHasMore: boolean;
}

export default function PodcastShowPageClient({ show, initialEpisodes, initialHasMore }: Props) {
  const [episodes, setEpisodes] = useState(initialEpisodes);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadMore = async (page: number) => {
    setLoadingMore(true);
    try {
      const data = await fetchPodcastShowEpisodes(show.slug, page, 15);
      setEpisodes((prev) => [...prev, ...data.results]);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error(`Failed to load more episodes for podcast show ${show.slug}:`, error);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 lg:px-8 max-w-4xl mx-auto flex flex-col gap-6">
      <Link
        href="/podcasts"
        className="inline-flex items-center gap-2 self-start px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors font-bold text-sm"
      >
        <span className="material-symbols-outlined text-lg">arrow_back</span>
        Podcasts
      </Link>

      {/* En-tête du podcast */}
      <div className="flex flex-col sm:flex-row gap-5 items-start">
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden shrink-0 bg-surface-dark">
          <ContentImage src={show.coverImage} alt={show.title} className="absolute inset-0" sizes="160px" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-primary text-[10px] font-black uppercase tracking-widest">
            {show.category}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F0EDE8] leading-tight">{show.title}</h1>
          {show.description && (
            <p className="text-[#8A8178] text-sm leading-relaxed">{show.description}</p>
          )}
          <p className="text-[#4A443E] text-xs font-medium">
            {show.episodeCount} {show.episodeCount > 1 ? "épisodes" : "épisode"}
          </p>
        </div>
      </div>

      {/* Liste des épisodes */}
      <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
        {episodes.length === 0 ? (
          <EmptyState
            icon="mic_off"
            message="Aucun épisode pour le moment"
            description="Revenez bientôt pour découvrir les épisodes de ce podcast."
          />
        ) : (
          episodes.map((episode) => <PodcastEpisodeCard key={episode.id} episode={episode} />)
        )}
      </div>

      <VoirPlusPagination onLoadMore={loadMore} hasMore={hasMore} isLoading={loadingMore} />
    </div>
  );
}
