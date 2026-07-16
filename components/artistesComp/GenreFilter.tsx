"use client";
import { useState } from "react";
import type { Artiste, GenreItem } from "@/types/artistes";
import ArtisteCard from "./ArtisteCard";

interface Props {
  genres: GenreItem[];
  selectedGenreSlug: string;
  onGenreChange: (slug: string) => void;
  artistes: Artiste[];
  genreCounts: Record<string, number>;
}

export default function GenreFilter({
  genres,
  selectedGenreSlug,
  onGenreChange,
  artistes,
  genreCounts,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const activeGenre = genres.find((g) => g.slug === selectedGenreSlug) || genres[0] || { name: "Tous", slug: "" };
  const activeCount = genreCounts[activeGenre.slug] ?? 0;

  return (
    <div className="w-full">
      {/* Dropdown Button */}
      <div className="relative mt-2 mb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-[#F0EDE8] hover:bg-white/10 transition-all active:scale-98"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">filter_list</span>
            <span>
              Genre: <span className="text-primary">{activeGenre.name}</span>
              <span className="ml-1 text-xs text-[#8A8178] font-medium">({activeCount})</span>
            </span>
          </div>
          <span className={`material-symbols-outlined transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
            expand_more
          </span>
        </button>

        {isOpen && (
          <>
            {/* Backdrop overlay for closing dropdown on click outside */}
            <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            
            {/* Dropdown Menu */}
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
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-left transition-all ${
                      isSelected
                        ? "bg-primary/10 text-primary"
                        : "text-[#8A8178] hover:text-[#F0EDE8] hover:bg-white/5"
                    }`}
                  >
                    <span>{g.name}</span>
                    <span className={`text-xs font-black rounded-full px-2 py-0.5 ${
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

      {/* Grille filtrée */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {artistes.map((artiste) => (
          <ArtisteCard key={artiste.id} artiste={artiste} />
        ))}
      </div>
    </div>
  );
}
