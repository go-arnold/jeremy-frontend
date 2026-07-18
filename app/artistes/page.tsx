import { artistes as mockedArtistes, genres as mockedGenresStatic } from "@/data/artistes";
import { apiFetch, PaginatedResponse } from "@/lib/api-client";
import { mapApiArtistToArtiste } from "@/lib/mappers";
import ArtistesPageClient from "./ArtistesPageClient";
import type { GenreItem } from "@/types/artistes";
import type { ApiArtistList, ApiGenre } from "@/lib/api-types";

async function getInitialData() {
  try {
    const [artistData, genreData] = await Promise.all([
      apiFetch<PaginatedResponse<ApiArtistList>>("/api/v1/artists/?page_size=15"),
      apiFetch<ApiGenre[] | PaginatedResponse<ApiGenre>>("/api/v1/artists/genres/"),
    ]);

    const artistes = artistData.results.map(mapApiArtistToArtiste);
    const hasMore = !!artistData.next;
    const totalArtistsCount = artistData.count;

    const results = Array.isArray(genreData) ? genreData : genreData.results || [];
    const mappedGenres: GenreItem[] = results.map((g) => ({
      id: g.id,
      name: g.name,
      slug: g.slug || g.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
    }));

    const genres: GenreItem[] = [{ name: "Tous", slug: "" }, ...mappedGenres];

    // Fetch counts for each genre
    const countsResults = await Promise.all(
      mappedGenres.map(async (g) => {
        try {
          const data = await apiFetch<PaginatedResponse<ApiArtistList>>(
            `/api/v1/artists/?genre=${g.slug}&page_size=1`
          );
          return { slug: g.slug, count: data.count };
        } catch {
          return { slug: g.slug, count: 0 };
        }
      })
    );
    const genreCounts: Record<string, number> = { "": totalArtistsCount };
    countsResults.forEach((item) => {
      genreCounts[item.slug] = item.count;
    });

    return { artistes, genres, genreCounts, totalArtistsCount, hasMore };
  } catch (error) {
    console.error("Failed to fetch artistes initial data:", error);
    // Fallback to mocked data on error
    const artistes = mockedArtistes;
    const totalArtistsCount = artistes.length;

    const genres: GenreItem[] = mockedGenresStatic.map((name) =>
      name === "Tous" ? { name: "Tous", slug: "" } : { name, slug: name.toLowerCase().replace(/[^a-z0-9]/g, "-") }
    );

    const genreCounts: Record<string, number> = { "": totalArtistsCount };
    genres.forEach((g) => {
      if (g.slug !== "") {
        genreCounts[g.slug] = artistes.filter((a) =>
          a.genres.some((genre) => genre.toLowerCase().includes(g.slug))
        ).length;
      }
    });

    return { artistes, genres, genreCounts, totalArtistsCount, hasMore: false };
  }
}

export default async function ArtistesPage() {
  const { artistes, genres, genreCounts, totalArtistsCount, hasMore } = await getInitialData();

  return (
    <ArtistesPageClient
      initialArtistes={artistes}
      initialGenres={genres}
      initialGenreCounts={genreCounts}
      initialTotalArtistsCount={totalArtistsCount}
      initialHasMore={hasMore}
    />
  );
}
