"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Release } from "@/types/artistes";
import ArtisteSectionEmptyState from "./ArtisteSectionEmptyState";

const PAGE_SIZE = 6;

export default function LatestReleasesDesktop({ releases }: { releases: Release[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visible = releases.slice(0, visibleCount);
  const hasMore = visibleCount < releases.length;

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl font-bold text-white tracking-tight">
          Dernières Sorties
        </h3>
        <Link href="/sorties-premieres" className="text-primary text-sm font-bold hover:text-[#F0EDE8] transition-colors flex items-center gap-1">
          Voir tout
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>

      {releases.length === 0 ? (
        <ArtisteSectionEmptyState icon="album" message="Aucune sortie pour le moment. Revenez bientôt !" />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            {visible.map((release) => (
              <Link
                key={release.id}
                href={release.href}
                className="group flex rounded-xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-300"
                style={{ background: "rgba(18,34,60,0.7)" }}
              >
                <div className="relative w-28 shrink-0 bg-black/30">
                  {release.coverImage && (
                    <Image src={release.coverImage} alt={release.title} fill sizes="112px" className="object-cover" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-[#12223cd9]/20 group-hover:bg-[#12223cd9]/0 transition-all">
                    <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      <span className="material-symbols-outlined text-white text-xl ml-0.5">play_arrow</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center p-4 flex-1 min-w-0">
                  <span className="text-primary text-[10px] font-bold tracking-wider mb-1">
                    {release.year} · {release.type}
                  </span>
                  <h4 className="text-white font-bold text-base leading-tight truncate group-hover:text-primary transition-colors">
                    {release.title}
                  </h4>
                  <p className="text-[#8A8178] text-sm truncate mt-0.5">
                    {release.featuring ?? release.producer}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          {hasMore && (
            <button
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="self-center px-6 h-10 rounded-xl border border-white/10 text-xs font-bold text-[#8A8178] hover:text-white hover:bg-white/5 transition-colors"
            >
              Voir plus
            </button>
          )}
        </>
      )}
    </section>
  );
}
