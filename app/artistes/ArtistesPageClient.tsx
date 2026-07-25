"use client";

import { useState } from "react";
import GenreFilter from "@/components/artistesComp/GenreFilter";
import { fetchArtists } from "@/lib/services/artists";
import { artistes as mockedArtistes } from "@/data/artistes";
import EmptyState from "@/components/ui/EmptyState";
import VoirPlusPagination from "@/components/ui/VoirPlusPagination";
import type { Artiste, GenreItem } from "@/types/artistes";

interface ArtistesPageClientProps {
  initialArtistes: Artiste[];
  initialGenres: GenreItem[];
  initialGenreCounts: Record<string, number>;
  initialTotalArtistsCount: number;
  initialHasMore: boolean;
}

export default function ArtistesPageClient({
  initialArtistes,
  initialGenres,
  initialGenreCounts,
  initialTotalArtistsCount,
  initialHasMore,
}: ArtistesPageClientProps) {
  const [artistes, setArtistes] = useState<Artiste[]>(initialArtistes);
  const [genres] = useState<GenreItem[]>(initialGenres);
  const [selectedGenreSlug, setSelectedGenreSlug] = useState<string>("");
  const [totalArtistsCount, setTotalArtistsCount] = useState<number>(initialTotalArtistsCount);
  const [genreCounts, setGenreCounts] = useState<Record<string, number>>(initialGenreCounts);

  const [loadingMore, setLoadingLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);

  const handleGenreChange = async (genreSlug: string) => {
    setSelectedGenreSlug(genreSlug);
    setLoadingLoadingMore(true);
    try {
      const data = await fetchArtists(1, 15, genreSlug || undefined);
      setArtistes(data.results);
      setHasMore(!!data.next);
      setTotalArtistsCount(data.count);

      // Keep counts updated dynamically
      setGenreCounts((prev) => ({
        ...prev,
        [genreSlug]: data.count,
      }));
    } catch (error) {
      console.error("Failed to filter artists by genre:", error);
      // Fallback filtering locally if API fails
      if (genreSlug === "") {
        setArtistes(mockedArtistes);
        setTotalArtistsCount(mockedArtistes.length);
        setHasMore(false);
      } else {
        const filtered = mockedArtistes.filter((a) =>
          a.genres.some((genre) => genre.toLowerCase().includes(genreSlug))
        );
        setArtistes(filtered);
        setTotalArtistsCount(filtered.length);
        setHasMore(false);
      }
    } finally {
      setLoadingLoadingMore(false);
    }
  };

  const loadMore = async (page: number) => {
    setLoadingLoadingMore(true);
    try {
      const data = await fetchArtists(page, 15, selectedGenreSlug || undefined);
      setArtistes((prev) => [...prev, ...data.results]);
      setHasMore(!!data.next);
      setTotalArtistsCount(data.count);
    } catch (error) {
      console.error("Failed to load more artists:", error);
      setHasMore(false);
    } finally {
      setLoadingLoadingMore(false);
    }
  };

  const showEmptyState = artistes.length === 0;

  // Calculate stats based on overall data from API that does not change with pagination
  const totalAllArtists = genreCounts[""] ?? totalArtistsCount;
  const totalGenresCount = genres.length > 0 ? genres.length - 1 : 0;

  return (
    <div className="relative flex min-h-screen w-full flex-col pt-0 kivu-texture">

      {/* MOBILE — en-tête */}
      <section className="lg:hidden px-4">
        <div className="px-1 pt-7 pb-1">
          <h2 className="text-xl font-black leading-tight">
            Découvrez les talents du Kivu
          </h2>
          <p className="text-xs text-white/60 mt-1.5 mb-3">
            Parcours rapides, profils complets et nouveautés.
          </p>
        </div>
      </section>

      {/* DESKTOP — en-tête */}
      <div className="hidden lg:flex flex-col w-full mx-auto px-8">
        <div className="pt-2 pb-8 flex items-end justify-between border-b border-white/10 mb-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-primary mb-2">
              Artistes du Kivu
            </p>
            <h1 className="text-5xl font-black leading-tight text-[#F0EDE8]">
              Découvrez les<br />
              <span className="text-primary">talents du Kivu</span>
            </h1>
            <p className="text-[#8A8178] mt-3 text-base max-w-md leading-relaxed">
              Parcours rapides, profils complets et nouveautés —
              toute la scène musicale du Kivu en un seul endroit.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-10 pb-1">
            {[
              { value: `${totalAllArtists}`, label: "Artistes" },
              { value: `${totalGenresCount}`, label: "Genres" },
              { value: "Goma • Bukavu", label: "Villes" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-end">
                <span className="text-3xl font-black text-[#F0EDE8]">{stat.value}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8A8178]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filtre par genre + grille — rendu responsive unique (mobile dropdown / desktop sidebar) */}
      <div className="px-4 lg:px-8 lg:mx-auto lg:pb-16 w-full">
        {showEmptyState ? (
          <EmptyState
            message="Pas d'artistes trouvés"
            description="La scène locale se prépare. Revenez bientôt pour découvrir de nouveaux talents."
          />
        ) : (
          <>
            <GenreFilter
              genres={genres}
              selectedGenreSlug={selectedGenreSlug}
              onGenreChange={handleGenreChange}
              artistes={artistes}
              genreCounts={genreCounts}
              totalArtistsCount={totalArtistsCount}
            />
            <VoirPlusPagination
              key={selectedGenreSlug}
              onLoadMore={loadMore}
              hasMore={hasMore}
              isLoading={loadingMore}
            />
          </>
        )}
      </div>

    </div>
  );
}
