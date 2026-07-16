import Link from "next/link";
import type { SelectionEpisode } from "@/types/podcasts";

export default function SelectionEpisodeCard({ episode }: { episode: SelectionEpisode }) {
  return (
    <section className="px-4 mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-xl font-extrabold">Sélection</h2>
      </div>

      <Link href={`/podcasts/${episode.slug}`} className="group relative rounded-2xl overflow-hidden block">
        <div
          className="relative w-full h-[300px] bg-cover bg-center"
          style={{ backgroundImage: `url('${episode.image}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#12223ce6]/95 via-[#12223ce6]/80 to-black/20" />

          <div className="absolute inset-0 flex flex-col justify-end p-8 text-white z-10">
            <div className="flex items-center gap-2 text-sm mb-3">
              <span className="text-primary font-bold uppercase">{episode.category}</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-300">{episode.duration}</span>
            </div>

            <h3 className="text-3xl font-bold leading-tight">{episode.title}</h3>
            <p className="text-gray-200 mt-3 max-w-2xl">{episode.description}</p>

            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-2 text-gray-300">
                <span className="material-symbols-outlined text-sm">mic</span>
                <span>Hôte : {episode.host}</span>
              </div>
              <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-semibold transition active:scale-95">
                <span className="material-symbols-outlined">play_arrow</span>
                Écouter
              </button>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
