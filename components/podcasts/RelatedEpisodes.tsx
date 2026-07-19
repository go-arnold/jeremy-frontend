import Link from "next/link";
import type { RelatedEpisode } from "@/types/podcasts";
import ContentImage from "@/components/ui/ContentImage";

export default function RelatedEpisodes({ episodes }: { episodes: RelatedEpisode[] }) {
  if (!episodes?.length) return null;

  return (
    <div className="mb-4">
      <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
        Plus sur la Culture Kivu
        <span className="material-symbols-outlined text-primary">arrow_forward</span>
      </h3>

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-5 px-5">
        {episodes.map((ep) => (
          <Link
            key={ep.id}
            href={`/podcasts/${ep.slug}`}
            className="w-40 shrink-0 group cursor-pointer"
          >
            <div className="aspect-square rounded-lg bg-surface-dark relative overflow-hidden mb-2 border border-white/5">
              <ContentImage src={ep.image} alt={ep.title} className="absolute inset-0" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition duration-300" />
              <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                {ep.duration}
              </span>
            </div>
            <p className="text-gray-400 text-xs mb-1">Épisode {ep.episodeNumber}</p>
            <h4 className="text-white text-sm font-bold leading-tight line-clamp-2 group-hover:text-primary transition">
              {ep.title}
            </h4>
          </Link>
        ))}
      </div>
    </div>
  );
}
