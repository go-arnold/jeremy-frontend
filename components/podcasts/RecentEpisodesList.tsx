"use client";

import { useEffect, useRef, useState } from "react";
import type { PodcastListItem } from "@/types/podcasts";
import PodcastEpisodeCard from "./PodcastEpisodeCard";
import EmptyState from "@/components/ui/EmptyState";

interface Props {
  episodes: PodcastListItem[];
  expanded: boolean;
  onToggleExpanded: () => void;
}

/** "Récents" preview on mobile — one episode per slide, auto-advancing every few seconds (same
 * carousel pattern used for Communauté défis and the Événements "Prochainement" preview). Stays
 * visible even once expanded — the parent appends the rest of the list right below it instead of
 * replacing this preview. */
export default function RecentEpisodesList({ episodes, expanded, onToggleExpanded }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const safeIndex = episodes.length > 0 ? activeIndex % episodes.length : 0;
  const showCarousel = episodes.length > 1;

  useEffect(() => {
    if (!showCarousel) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % episodes.length);
    }, 4500);
    return () => clearInterval(id);
  }, [showCarousel, episodes.length]);

  useEffect(() => {
    if (!showCarousel) return;
    const child = scrollRef.current?.children[safeIndex] as HTMLElement | undefined;
    child?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }, [safeIndex, showCarousel]);

  return (
    <section className="px-4 mt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white text-base font-extrabold leading-tight tracking-[-0.015em]">
          Récents
        </h2>
        {episodes.length > 0 && (
          <button onClick={onToggleExpanded} className="text-primary text-xs font-bold">
            {expanded ? "Réduire" : "Tout voir"}
          </button>
        )}
      </div>

      {episodes.length === 0 ? (
        <EmptyState
          message="Aucun épisode dans cette catégorie"
          description="Essayez une autre catégorie."
          icon="mic_off"
        />
      ) : (
        <>
          <div ref={scrollRef} className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1 -mx-1 px-1">
            {episodes.map((ep) => (
              <div key={ep.id} className="min-w-full snap-center">
                <PodcastEpisodeCard episode={ep} />
              </div>
            ))}
          </div>
          {episodes.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-3">
              {episodes.map((ep, i) => (
                <span
                  key={ep.id}
                  className={`h-1.5 rounded-full transition-all ${i === safeIndex ? "w-4 bg-primary" : "w-1.5 bg-white/20"}`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
