import Link from "next/link";
import type { PodcastEpisode } from "@/types/podcasts";
import ContentImage from "@/components/ui/ContentImage";

export default function EpisodeHero({ episode }: { episode: PodcastEpisode }) {
  return (
    <div className="relative w-full h-[55vh] overflow-hidden">

      {/* Cover */}
      <ContentImage src={episode.coverImage} alt={episode.title} className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#12223ce6] via-[#12223ce6]/40 to-transparent" />

      {/* Bouton retour */}
      <div className="absolute top-0 left-0 w-full z-20 flex items-center px-4 pt-14">
        <Link
          href="/podcasts"
          className="flex items-center justify-center size-9 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </Link>
      </div>

      {/* Infos bas */}
      <div className="absolute bottom-0 left-0 w-full px-5 pb-6">
        <div className="flex items-center gap-2 mb-3">
          {episode.badge && (
            <span className="px-2 py-0.5 border border-accent-danger text-accent-danger text-xs font-bold tracking-widest uppercase rounded">
              {episode.badge}
            </span>
          )}
          <span className="text-gray-300 text-xs font-medium tracking-wide">
            ÉP {episode.episodeNumber} • {episode.publishedAt}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold leading-[1.1] tracking-tight mb-2 text-white">
          {episode.title}
          {episode.subtitle && (
            <>
              <br />
              <span className="text-white/70 italic font-semibold text-2xl">
                {episode.subtitle}
              </span>
            </>
          )}
        </h1>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {episode.tags.map((tag) => (
            <div
              key={tag}
              className="flex h-7 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm px-3 border border-white/5"
            >
              <span className="text-white text-xs font-medium">{tag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
