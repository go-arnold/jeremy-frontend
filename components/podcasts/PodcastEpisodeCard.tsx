"use client";
import Link from "next/link";
import type { PodcastListItem } from "@/types/podcasts";
import ContentImage from "@/components/ui/ContentImage";

function seasonEpisodeLabel(episode: PodcastListItem): string | null {
  if (episode.seasonNumber && episode.episodeNumber) return `S${episode.seasonNumber} · Ép. ${episode.episodeNumber}`;
  if (episode.episodeNumber) return `Ép. ${episode.episodeNumber}`;
  if (episode.seasonNumber) return `Saison ${episode.seasonNumber}`;
  return null;
}

/** Shared horizontal episode row — photo, category/season-episode, title, guest, duration, play
 * button. Used both for the mobile carousel slides and the vertical "Tout voir" list, so the two
 * views read identically once expanded. */
export default function PodcastEpisodeCard({ episode }: { episode: PodcastListItem }) {
  const seasonEp = seasonEpisodeLabel(episode);

  return (
    <Link
      href={`/podcasts/${episode.slug}`}
      className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/8 transition-colors"
    >
      <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-surface-dark">
        <ContentImage src={episode.image} alt={episode.title} className="absolute inset-0" />
      </div>
      <div className="flex flex-col justify-between min-w-0 flex-1">
        <div>
          <div className="flex items-center gap-1.5 text-[9px] text-primary font-bold uppercase tracking-wide mb-0.5">
            {seasonEp && <span className="shrink-0">{seasonEp}</span>}
            {seasonEp && episode.category && <span className="text-[#4A443E]">•</span>}
            <span className="truncate">{episode.category}</span>
          </div>
          <p className="text-white text-xs font-bold leading-tight line-clamp-2">{episode.title}</p>
          {episode.guestNames && (
            <p className="text-[#8A8178] text-[10px] mt-0.5 truncate">{episode.guestNames}</p>
          )}
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[#8A8178] text-[10px]">{episode.duration}</span>
          <button
            onClick={(e) => e.preventDefault()} // évite de naviguer lors du clic sur play
            className="flex size-8 items-center justify-center rounded-full bg-primary/20 text-primary border border-primary/20 hover:bg-primary/30 transition-colors"
          >
            <span className="material-symbols-outlined text-base">play_arrow</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
