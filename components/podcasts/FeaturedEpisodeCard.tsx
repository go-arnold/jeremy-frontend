import Link from "next/link";
import type { FeaturedEpisode } from "@/types/podcasts";

export default function FeaturedEpisodeCard({ episode }: { episode: FeaturedEpisode }) {
  return (
    <section className="px-4 pt-2">
      <h2 className="text-white text-xl font-extrabold leading-tight tracking-[-0.015em] mb-4">
        À la une
      </h2>
      <Link href={`/podcasts/${episode.slug}`} className="block">
        <div className="relative group overflow-hidden rounded-2xl aspect-[16/10] shadow-2xl">

          {/* Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url('${episode.image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12223ce6] via-[#12223ce6]/40 to-transparent" />

          {/* Contenu bas */}
          <div className="absolute bottom-0 left-0 p-5 w-full">
            <span className="inline-block px-2 py-1 bg-primary text-[10px] font-bold text-white rounded-md mb-2 tracking-wider uppercase">
              Nouveau
            </span>
            <h3 className="text-2xl font-bold text-white mb-1">{episode.title}</h3>
            <p className="text-white/80 text-sm mb-4">{episode.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-white/60 text-sm">schedule</span>
                <span className="text-xs text-white/60">{episode.duration}</span>
              </div>
              <button className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-base">play_arrow</span>
                Écouter
              </button>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
