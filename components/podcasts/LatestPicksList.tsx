"use client"
import Link from "next/link";
import type { LatestPickEpisode } from "@/types/podcasts";

export default function LatestPicksList({ episodes }: { episodes: LatestPickEpisode[] }) {
  return (
    <section className="flex flex-col gap-4 px-4 mt-8">
      <h2 className="text-lg font-bold tracking-tight px-1">Sélection récente</h2>

      {episodes.map((ep) => (
        <Link
          key={ep.id}
          href={`/podcasts/${ep.slug}`}
          className="flex flex-col sm:flex-row gap-4 bg-[#12223ce6]  p-4 rounded-2xl border border-white/5 active:bg-[#12223ce6] transition-colors cursor-pointer"
        >
          {/* Vignette avec play hover */}
          <div className="shrink-0 relative">
            <div
              className="size-24 sm:size-28 rounded-xl bg-cover bg-center shadow-inner"
              style={{ backgroundImage: `url('${ep.image}')` }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-white drop-shadow-md">play_circle</span>
            </div>
          </div>

          {/* Infos */}
          <div className="flex flex-1 flex-col justify-between py-1">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary uppercase tracking-wide">
                  {ep.category}
                </span>
                <span className="text-xs text-gray-400">{ep.publishedAt}</span>
              </div>
              <h4 className="text-base font-bold leading-tight text-white line-clamp-2">
                {ep.title}
              </h4>
              <p className="text-sm text-[#b4a6a2] font-normal line-clamp-1">{ep.guest}</p>
            </div>

            <div className="flex items-end justify-between mt-2 sm:mt-0">
              <span className="text-xs font-medium text-gray-400 bg-white/5 px-2 py-1 rounded-md">
                {ep.duration}
              </span>
              <button
                onClick={(e) => e.preventDefault()}
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>
                  add_circle
                </span>
              </button>
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
}
