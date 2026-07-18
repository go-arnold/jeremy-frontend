"use client";

import Image from "next/image";
import Link from "next/link";
import type { Track } from "@/types";

interface Props {
  tracks: Track[];
  title?: string;
  subtitle?: string;
  seeAllHref?: string;
  seeAllLabel?: string;
}

export default function HitsList({
  tracks,
  title = "Hits du Mois",
  subtitle = "Goma Vibes",
  seeAllHref = "/live-music",
  seeAllLabel = "Voir tout",
}: Props) {
  return (
    // Sur desktop, ce composant est dans une colonne — le wrapper 2 colonnes est dans page.tsx
    <div className="flex flex-col gap-3 w-full">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#F0EDE8] uppercase tracking-wider">{title}</h2>
          <p className="text-sm text-[#E63012] font-medium">{subtitle}</p>
        </div>
        <Link href={seeAllHref} className="text-xs font-bold text-[#8A8178] hover:text-[#F0EDE8] transition-colors">
          {seeAllLabel}
        </Link>
      </div>

      {tracks.map((track) => (
        <Link
          key={track.rank}
          href={track.href}
          className={`group relative flex items-center gap-4 rounded-xl border p-3 pr-4 transition-all hover:border-[#ffffff]/30 ${
            track.featured
              ? "border-[#ffffff]/20 bg-[#0d172fd1] inner-glow"
              : "border-[#ffffff]/5 bg-[#0d172fd1]"
          }`}
        >
          <span className={`flex h-8 w-8 shrink-0 items-center justify-center text-xl font-black ${track.featured ? "text-[#E63012]" : "text-[#4A443E]"}`}>
            {track.rank}
          </span>
          <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-[#221E1B]">
            <Image fill sizes="48px" className="object-cover" alt={track.title} src={track.image} />
          </div>
          <div className="flex flex-1 flex-col justify-center overflow-hidden">
            <h4 className="truncate text-base font-bold text-[#F0EDE8]">{track.title}</h4>
            <p className="truncate text-xs font-medium text-[#8A8178]">{track.artist}</p>
          </div>
          <button
            onClick={(e) => e.preventDefault()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F0EDE8]/5 text-[#4A443E] transition hover:bg-[#E63012] hover:text-white"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>thumb_up</span>
          </button>
        </Link>
      ))}
    </div>
  );
}
