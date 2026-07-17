import Link from "next/link";
import type { FeaturedRelease } from "@/types/sortiesPremieres";

export default function FeaturedReleaseHero({ release }: { release: FeaturedRelease }) {
  return (
    <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden mb-10 group shadow-2xl">
      {release.coverImage && (
        <img
          alt={release.title}
          className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] transition-transform duration-700 group-hover:scale-110"
          src={release.coverImage}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-black/20" />

      {/* Premiere badge */}
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

      {/* Info overlay */}
      <div className="absolute bottom-0 left-0 p-6 w-full">
        <p className="text-primary font-bold text-sm mb-1">{release.month}</p>
        <h2 className="text-3xl font-black text-white leading-tight mb-2">{release.title}</h2>
        <div className="flex items-center gap-2 text-white/80 text-sm mb-4">
          <span className="material-symbols-outlined text-sm">calendar_today</span>
          <span>{release.releaseDate}</span>
        </div>
        <Link
          href={release.href || "/sorties-premieres"}
          className="block text-center w-full bg-white text-background-dark font-extrabold py-3.5 rounded-lg text-sm uppercase tracking-wider transition-colors active:bg-primary active:text-white"
        >
          Voir la sortie
        </Link>
      </div>
    </div>
  );
}
