"use client";

import { useState } from "react";
import Image from "next/image";
import type { GalleryPhoto } from "@/types/artistes";
import ArtisteSectionEmptyState from "./ArtisteSectionEmptyState";

interface Props {
  photos: GalleryPhoto[];
  variant?: "mobile" | "desktop";
}

export default function PhotoGallery({ photos, variant = "mobile" }: Props) {
  const pageSize = variant === "desktop" ? 9 : 6;
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const visible = photos.slice(0, visibleCount);
  const hasMore = visibleCount < photos.length;

  if (variant === "desktop") {
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
                onClick={() => setVisibleCount((c) => c + pageSize)}
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

  return (
    <section className="flex flex-col px-5 py-5 mx-4 bg-[#12223ce6] rounded-xl">
      <h3 className="font-display text-lg font-bold text-white tracking-tight mb-3">
        Galerie
      </h3>

      {photos.length === 0 ? (
        <ArtisteSectionEmptyState icon="photo_library" message="Aucune photo disponible pour le moment." />
      ) : (
        <>
          {/* Grille masonry 2 colonnes */}
          <div className="columns-2 gap-3 space-y-3">
            {visible.map((photo) => (
              <div
                key={photo.id}
                className="break-inside-avoid relative aspect-[4/3] rounded-xl overflow-hidden group"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
          {hasMore && (
            <button
              onClick={() => setVisibleCount((c) => c + pageSize)}
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
