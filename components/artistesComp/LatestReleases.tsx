"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Release } from "@/types/artistes";
import ArtisteSectionEmptyState from "./ArtisteSectionEmptyState";

const PAGE_SIZE = 4;

interface Props {
  releases: Release[];
}

export default function LatestReleases({ releases }: Props) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visibleReleases = releases.slice(0, visibleCount);
  const hasMore = visibleCount < releases.length;

  return (
    <section className="flex flex-col px-5">
      <div className="flex items-center justify-between pb-3 pt-8">
        <h3 className="font-display text-lg font-bold text-white tracking-tight">
          Dernières Sorties
        </h3>
        <Link href="/sorties-premieres" className="text-secondary-accent text-xs font-bold">
          Voir tout
        </Link>
      </div>

      {releases.length === 0 ? (
        <ArtisteSectionEmptyState icon="album" message="Aucune sortie pour le moment. Revenez bientôt !" />
      ) : (
        <>
          <div className="flex flex-col gap-2.5">
            {visibleReleases.map((release) => (
              <ReleaseRow key={release.id} release={release} />
            ))}
          </div>
          {hasMore && (
            <button
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="mt-3 w-full h-10 rounded-xl border border-white/10 text-xs font-bold text-[#8A8178] hover:text-white hover:bg-white/5 transition-colors"
            >
              Voir plus
            </button>
          )}
        </>
      )}
    </section>
  );
}

function ReleaseRow({ release }: { release: Release }) {
  return (
    <Link
      href={release.href}
      className="group flex items-center gap-3 rounded-xl p-2 bg-surface-dark border border-white/5 hover:border-white/10 transition-colors"
    >
      <div className="relative size-16 shrink-0 rounded-lg overflow-hidden bg-black/30">
        {release.coverImage && (
          <Image src={release.coverImage} alt={release.title} fill sizes="64px" className="object-cover" />
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity">
            play_circle
          </span>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <span className="text-secondary-accent text-[10px] font-bold tracking-wider">
          {release.year} • {release.type}
        </span>
        <h4 className="font-display text-white text-sm font-bold leading-tight truncate">
          {release.title}
        </h4>
        <p className="text-gray-400 text-xs truncate">
          {release.featuring ?? release.producer}
        </p>
      </div>

      <span className="material-symbols-outlined text-[#8A8178] text-lg shrink-0">chevron_right</span>
    </Link>
  );
}
