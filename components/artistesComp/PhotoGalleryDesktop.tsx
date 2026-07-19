"use client";

import { useState } from "react";
import Image from "next/image";
import type { GalleryPhoto } from "@/types/artistes";
import ArtisteSectionEmptyState from "./ArtisteSectionEmptyState";

const PAGE_SIZE = 9;

export default function PhotoGalleryDesktop({ photos }: { photos: GalleryPhoto[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visible = photos.slice(0, visibleCount);
  const hasMore = visibleCount < photos.length;

  return (
    <section className="flex flex-col gap-5">
      <h3 className="font-display text-2xl font-bold text-white tracking-tight">Galerie</h3>

      {photos.length === 0 ? (
        <ArtisteSectionEmptyState icon="photo_library" message="Aucune photo disponible pour le moment." />
      ) : (
        <>
          {/* Masonry 3 colonnes sur desktop */}
          <div className="columns-3 gap-4 space-y-4">
            {visible.map((photo) => (
              <div
                key={photo.id}
                className="break-inside-avoid relative rounded-xl overflow-hidden group cursor-pointer"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={800}
                  height={600}
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  style={{ width: "100%", height: "auto" }}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
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
