"use client";
import { useState } from "react";
import Link from "next/link";
import type { Artiste, GenreItem } from "@/types/artistes";
import ArtisteCard from "./ArtisteCard";

interface Props {
  genres: GenreItem[];
  selectedGenreSlug: string;
  onGenreChange: (slug: string) => void;
  artistes: Artiste[];
  genreCounts: Record<string, number>;
  totalArtistsCount: number;
}

// ── ArtisteCard desktop — plus grande image, badge genre flottant ──
function ArtisteCardDesktop({ artiste }: { artiste: Artiste }) {
  return (
    <Link
      href={artiste.href}
      className="group rounded-2xl overflow-hidden border border-white/5 hover:border-primary/40 transition-all duration-300 flex flex-col"
      style={{ background: "rgba(16,34,60,0.7)" }}
    >
      <div className="relative overflow-hidden" style={{ height: "180px" }}>
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url('${artiste.image}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#10223c]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 left-3">
          <span className="bg-black/60 backdrop-blur-md text-primary text-[10px] font-black px-2 py-1 rounded-lg border border-primary/20 uppercase tracking-wider">
            {artiste.genres[0]}
          </span>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-1 flex-1">
        <h3 className="text-base font-bold text-[#F0EDE8] group-hover:text-primary transition-colors leading-tight">
          {artiste.name}
        </h3>
        <div className="flex items-center gap-1 text-[#8A8178]">
          <span className="material-symbols-outlined text-xs">location_on</span>
          <p className="text-[11px]">{artiste.city}</p>
        </div>
      </div>
    </Link>
  );
}

export default function GenreFilter({
  genres,
  selectedGenreSlug,
  onGenreChange,
  artistes,
  genreCounts,
  totalArtistsCount,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const activeGenre = genres.find((g) => g.slug === selectedGenreSlug) || genres[0] || { name: "Tous", slug: "" };
  const activeCount = genreCounts[activeGenre.slug] ?? 0;
  const activeGenreName = activeGenre.name;

  return (
    <div className="w-full">
      {/* ══════════════════════════════════════
          MOBILE — dropdown + grille 2 colonnes
      ══════════════════════════════════════ */}
      <div className="lg:hidden">
        <div className="relative mt-1 mb-5">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-[#F0EDE8] hover:bg-white/10 transition-all active:scale-98"
          >
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-base">filter_list</span>
              <span>
                Genre: <span className="text-primary">{activeGenre.name}</span>
                <span className="ml-1 text-[10px] text-[#8A8178] font-medium">({activeCount})</span>
              </span>
            </div>
            <span className={`material-symbols-outlined text-lg transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
              expand_more
            </span>
          </button>

          {isOpen && (
            <>
              <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
              <div className="absolute left-0 right-0 mt-2 z-50 bg-[#10223c]/95 backdrop-blur-lg border border-white/10 rounded-2xl max-h-72 overflow-y-auto shadow-2xl p-2 animate-fade-in">
                {genres.map((g) => {
                  const isSelected = g.slug === selectedGenreSlug;
                  const count = genreCounts[g.slug] ?? 0;
                  return (
                    <button
                      key={g.slug}
                      onClick={() => {
                        onGenreChange(g.slug);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
                        isSelected
                          ? "bg-primary/10 text-primary"
                          : "text-[#8A8178] hover:text-[#F0EDE8] hover:bg-white/5"
                      }`}
                    >
                      <span>{g.name}</span>
                      <span className={`text-[10px] font-black rounded-full px-2 py-0.5 ${
                        isSelected
                          ? "bg-primary/20 text-primary"
                          : "bg-white/5 text-[#4A443E]"
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5">
          {artistes.map((artiste) => (
            <ArtisteCard key={artiste.id} artiste={artiste} />
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          DESKTOP — sidebar verticale + grille 4 colonnes
      ══════════════════════════════════════ */}
      <div className="hidden lg:flex gap-8 items-start w-full">
        <aside className="sticky top-20 w-48 shrink-0 flex flex-col gap-1 z-30">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8A8178] px-3 mb-3">
            Filtrer par genre
          </p>

          {genres.map((g) => {
            const count = genreCounts[g.slug] ?? 0;
            const isActive = selectedGenreSlug === g.slug;

            return (
              <button
                key={g.slug}
                onClick={() => onGenreChange(g.slug)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 text-left ${
                  isActive
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "text-[#8A8178] hover:text-[#F0EDE8] hover:bg-white/5 border border-transparent"
                }`}
              >
                <span>{g.name}</span>
                <span className={`text-xs font-black rounded-full px-1.5 py-0.5 min-w-[22px] text-center ${
                  isActive
                    ? "bg-primary/20 text-primary"
                    : "bg-white/5 text-[#4A443E]"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-[#F0EDE8]">
                {selectedGenreSlug === "" ? "Tous les artistes" : activeGenreName}
              </h2>
              <span className="text-xs font-bold text-[#8A8178] bg-white/5 px-2 py-1 rounded-full">
                {totalArtistsCount} artiste{totalArtistsCount > 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-5">
            {artistes.map((artiste) => (
              <ArtisteCardDesktop key={artiste.id} artiste={artiste} />
            ))}
          </div>

          {artistes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <span className="material-symbols-outlined text-[#4A443E] text-5xl">
                person_search
              </span>
              <p className="text-[#8A8178] text-sm font-medium">
                Aucun artiste dans ce genre pour l&apos;instant.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
