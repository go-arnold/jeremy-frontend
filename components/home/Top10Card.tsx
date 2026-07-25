"use client";

import Link from "next/link";
import type { Track } from "@/types";

interface Props {
  tracks: Track[];
  period?: string;
  seeAllHref?: string;
}

export default function Top10Card({
  tracks,
  period = "JUIN 2026",
  seeAllHref = "/live-music",
}: Props) {
  return (
    // lg:sticky lg:top-24 → colle dans la colonne droite pendant le scroll
    <div className="bg-[#0d172fd1] rounded-2xl m-4 p-3 lg:p-6 border border-[#E63012]/10 shadow-2xl lg:sticky lg:top-24">
      <div className="flex items-center justify-between mb-3 lg:mb-6">
        <h3 className="text-base lg:text-2xl font-black tracking-tighter uppercase text-[#F0EDE8]">
          Top <span className="text-[#E63012]">10</span>
        </h3>
        <span className="text-[10px] lg:text-xs font-bold text-[#8A8178] border border-[#E63012]/20 px-1.5 py-0.5 lg:px-2 lg:py-1 rounded-md">
          {period}
        </span>
      </div>

      <div className="space-y-1.5 lg:space-y-3">
        {tracks.map((track) => (
          <Link
            key={track.rank}
            href={track.href}
            className="flex items-center gap-2 lg:gap-3 p-1.5 lg:p-2 rounded-lg hover:bg-[#F0EDE8]/5 transition-colors group"
          >
            <span className={`text-xs lg:text-xl font-black w-5 lg:w-7 shrink-0 ${track.featured ? "text-[#E63012]/60" : "text-[#4A443E]"}`}>
              {track.rank}
            </span>
            <div className="w-8 h-8 lg:w-11 lg:h-11 rounded-md overflow-hidden shrink-0 shadow-lg">
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${track.image}')` }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#F0EDE8] font-bold truncate text-xs lg:text-sm">{track.title}</p>
              <p className="text-[#8A8178] text-[10px] lg:text-xs truncate">{track.artist}</p>
            </div>
            {track.likes && (
              <button onClick={(e) => e.preventDefault()} className="flex flex-col items-center gap-0.5 shrink-0 group-hover:scale-110 transition-transform">
                <span className={`material-symbols-outlined text-xs lg:text-sm ${track.featured ? "text-[#E63012]" : "text-[#4A443E]"}`}>favorite</span>
                <span className="text-[8px] lg:text-[9px] font-bold text-[#8A8178]">{track.likes}</span>
              </button>
            )}
          </Link>
        ))}
      </div>

      <Link href={seeAllHref} className="hidden lg:block w-full mt-6 py-3 text-center text-xs font-bold uppercase tracking-widest text-[#8A8178] border-t border-[#E63012]/10 hover:text-[#E63012] transition-colors">
        Voir le classement complet
      </Link>
    </div>
  );
}
