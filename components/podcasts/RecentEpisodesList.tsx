"use client"
import Link from "next/link";
import type { RecentEpisode } from "@/types/podcasts";

export default function RecentEpisodesList({ episodes }: { episodes: RecentEpisode[] }) {
  return (
    <section className="px-4 mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-xl font-extrabold leading-tight tracking-[-0.015em]">
          Récents
        </h2>
        <button className="text-primary text-sm font-bold">Tout voir</button>
      </div>

      <div className="flex flex-col gap-4">
        {episodes.map((ep) => (
          <Link
            key={ep.id}
            href={`/podcasts/${ep.slug}`}
            className="p-4 rounded-2xl bg-white/5 border border-white/5 block hover:bg-white/8 transition-colors"
          >
            <div className="flex flex-col gap-4 sm:flex-row">
              {/* Vignette */}
              <div
                className="w-full sm:w-32 aspect-square bg-center bg-cover rounded-xl shrink-0"
                style={{ backgroundImage: `url('${ep.image}')` }}
              />

              {/* Infos */}
              <div className="flex flex-col justify-between grow">
                <div>
                  <p className="text-primary text-[10px] font-bold tracking-widest uppercase mb-1">
                    {ep.category}
                  </p>
                  <p className="text-white text-lg font-bold leading-tight mb-1">{ep.title}</p>
                  <p className="text-[#b4a6a2] text-sm font-medium">{ep.guest}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-[#b4a6a2] text-[11px]">
                    {ep.duration} • {ep.language}
                  </p>
                  <button
                    onClick={(e) => e.preventDefault()} // évite de naviguer lors du clic sur play
                    className="flex size-10 items-center justify-center rounded-full bg-primary/20 text-primary border border-primary/20 hover:bg-primary/30 transition"
                  >
                    <span className="material-symbols-outlined">play_arrow</span>
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
