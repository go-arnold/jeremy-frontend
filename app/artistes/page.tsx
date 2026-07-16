"use client";

import React, { useState, useEffect } from "react";
import { artistes as mockedArtistes, genres as mockedGenresStatic } from "@/data/artistes";
import GenreFilter from "@/components/artistesComp/GenreFilter";
import GenreGridDesktop from "@/components/artistesComp/GenreGridDesktop";
import { apiFetch, PaginatedResponse } from "@/lib/api-client";
import { mapApiArtistToArtiste } from "@/lib/mappers";
import EmptyState from "@/components/ui/EmptyState";
import VoirPlusPagination from "@/components/ui/VoirPlusPagination";
import type { Artiste, GenreItem } from "@/types/artistes";

export default function ArtistesPage() {
  const [artistes, setArtistes] = useState<Artiste[]>([]);
  const [genres, setGenres] = useState<GenreItem[]>([]);
  const [selectedGenreSlug, setSelectedGenreSlug] = useState<string>("");
  const [totalArtistsCount, setTotalArtistsCount] = useState<number>(0);
  const [genreCounts, setGenreCounts] = useState<Record<string, number>>({});

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  // Fetch initial data
  useEffect(() => {
    async function init() {
      try {
        const [artistData, genreData] = await Promise.all([
          apiFetch<PaginatedResponse<any>>("/api/v1/artists/?page_size=15"),
          apiFetch<any>("/api/v1/artists/genres/")
        ]);

        const mappedArtistes = artistData.results.map(mapApiArtistToArtiste);
        setArtistes(mappedArtistes);
        setHasMore(!!artistData.next);
        setTotalArtistsCount(artistData.count);

        const results = Array.isArray(genreData) ? genreData : (genreData.results || []);
        const mappedGenres: GenreItem[] = results.map((g: any) => {
          if (typeof g === 'string') {
            return { name: g, slug: g.toLowerCase().replace(/[^a-z0-9]/g, "-") };
          }
          return {
            id: g.id,
            name: g.name || g.label,
            slug: g.slug || (g.name || g.label || "").toLowerCase().replace(/[^a-z0-9]/g, "-")
          };
        });

        const fullGenresList: GenreItem[] = [{ name: "Tous", slug: "" }, ...mappedGenres];
        setGenres(fullGenresList);

        // Fetch counts for each genre
        const countsPromises = mappedGenres.map(async (g) => {
          try {
            const data = await apiFetch<PaginatedResponse<any>>(`/api/v1/artists/?genre=${g.slug}&page_size=1`);
            return { slug: g.slug, count: data.count };
          } catch {
            return { slug: g.slug, count: 0 };
          }
        });
        const countsResults = await Promise.all(countsPromises);
        const countsMap: Record<string, number> = {
          "": artistData.count
        };
        countsResults.forEach(item => {
          countsMap[item.slug] = item.count;
        });
        setGenreCounts(countsMap);

      } catch (error) {
        console.error("Failed to fetch artistes initial data:", error);
        // Fallback to mocked data on error
        const fallbackArtistes = mockedArtistes;
        setArtistes(fallbackArtistes);
        setTotalArtistsCount(fallbackArtistes.length);

        const fallbackMappedGenres: GenreItem[] = mockedGenresStatic.map((name) => {
          if (name === "Tous") return { name: "Tous", slug: "" };
          return {
            name: name,
            slug: name.toLowerCase().replace(/[^a-z0-9]/g, "-")
          };
        });
        setGenres(fallbackMappedGenres);

        const fallbackCounts: Record<string, number> = {
          "": fallbackArtistes.length
        };
        fallbackMappedGenres.forEach(g => {
          if (g.slug !== "") {
            fallbackCounts[g.slug] = fallbackArtistes.filter(a => a.genres.some(genre => genre.toLowerCase().includes(g.slug))).length;
          }
        });
        setGenreCounts(fallbackCounts);
      } finally {
        setLoading(false);
        setInitialDataLoaded(true);
      }
    }
    init();
  }, []);

  const handleGenreChange = async (genreSlug: string) => {
    setSelectedGenreSlug(genreSlug);
    setLoadingLoadingMore(true);
    try {
      const url = genreSlug 
        ? `/api/v1/artists/?genre=${genreSlug}&page=1&page_size=15`
        : `/api/v1/artists/?page=1&page_size=15`;
      const data = await apiFetch<PaginatedResponse<any>>(url);
      const mapped = data.results.map(mapApiArtistToArtiste);
      setArtistes(mapped);
      setHasMore(!!data.next);
      setTotalArtistsCount(data.count);

      // Keep counts updated dynamically
      setGenreCounts(prev => ({
        ...prev,
        [genreSlug]: data.count
      }));
    } catch (error) {
      console.error("Failed to filter artists by genre:", error);
      // Fallback filtering locally if API fails
      if (genreSlug === "") {
        setArtistes(mockedArtistes);
        setTotalArtistsCount(mockedArtistes.length);
        setHasMore(false);
      } else {
        const filtered = mockedArtistes.filter(a => a.genres.some(genre => genre.toLowerCase().includes(genreSlug)));
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
      const url = selectedGenreSlug 
        ? `/api/v1/artists/?genre=${selectedGenreSlug}&page=${page}&page_size=15`
        : `/api/v1/artists/?page=${page}&page_size=15`;
      const data = await apiFetch<PaginatedResponse<any>>(url);
      const newArtistes = data.results.map(mapApiArtistToArtiste);
      setArtistes(prev => [...prev, ...newArtistes]);
      setHasMore(!!data.next);
      setTotalArtistsCount(data.count);
    } catch (error) {
      console.error("Failed to load more artists:", error);
      setHasMore(false);
    } finally {
      setLoadingLoadingMore(false);
    }
  };

  const showEmptyState = initialDataLoaded && artistes.length === 0;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate stats based on overall data from API that does not change with pagination
  const totalAllArtists = genreCounts[""] ?? totalArtistsCount;
  const totalGenresCount = genres.length > 0 ? genres.length - 1 : 0;

  return (
    <div className="relative flex min-h-screen w-full flex-col pt-0 kivu-texture">

      {/* MOBILE */}
      <section className="lg:hidden px-4">
        <div className="rounded-2xl px-5 pt-2 pb-5">
          <h2 className="text-2xl font-black leading-tight">
            Découvrez les talents du Kivu
          </h2>
          <p className="text-sm text-white/60 mt-2 mb-4">
            Parcours rapides, profils complets et nouveautés.
          </p>
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
      </section>

      {/* DESKTOP */}
      <div className="hidden lg:flex flex-col w-full max-w-7xl mx-auto px-8 pb-16">

        {/* Hero header */}
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

        {/* Sidebar + Grille */}
        {showEmptyState ? (
          <EmptyState 
            message="Aucun artiste disponible" 
            description="Nous mettons à jour notre base de données. Les talents du Kivu arrivent bientôt !"
          />
        ) : (
          <>
            <GenreGridDesktop 
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
