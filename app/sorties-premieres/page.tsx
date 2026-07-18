import {
  mockReleaseDates,
  upcomingReleases as mockedUpcoming,
} from "@/data/sortiesPremieres";
import { apiFetch, PaginatedResponse } from "@/lib/api-client";
import { mapApiReleaseToFeaturedRelease } from "@/lib/mappers";
import { fetchFeaturedRelease, fetchReleaseCalendar } from "@/lib/services/releases";
import SortiesPremieresPageClient from "./SortiesPremieresPageClient";
import type { ApiRelease } from "@/lib/api-types";
import type { FeaturedRelease, ReleaseFormat } from "@/types/sortiesPremieres";

function buildReleasesUrl(format: ReleaseFormat, page: number) {
  const params = new URLSearchParams({ page: String(page), page_size: "15" });
  if (format !== "all") params.set("format", format);
  return `/api/v1/releases/?${params.toString()}`;
}

type MappedRelease = NonNullable<ReturnType<typeof mapApiReleaseToFeaturedRelease>>;

async function getInitialData() {
  let releases: MappedRelease[] = [];
  let hasMore = false;

  try {
    const data = await apiFetch<PaginatedResponse<ApiRelease>>(buildReleasesUrl("all", 1));
    releases = data.results.map(mapApiReleaseToFeaturedRelease).filter((r): r is MappedRelease => r !== null);
    hasMore = !!data.next;
  } catch (error) {
    console.error("Failed to fetch releases initial data:", error);
    releases = mockedUpcoming as unknown as MappedRelease[];
  }

  let featured: FeaturedRelease | null = null;
  const featuredResult = await fetchFeaturedRelease();
  if (featuredResult) featured = featuredResult as unknown as FeaturedRelease;

  let calendarDates: string[] = mockReleaseDates;
  try {
    const calendarReleases = await fetchReleaseCalendar();
    const dates = calendarReleases.map((r) => r?.rawDate).filter((d): d is string => Boolean(d));
    if (dates.length > 0) calendarDates = dates;
  } catch (error) {
    console.error("Failed to fetch release calendar:", error);
  }

  return { releases, featured, calendarDates, hasMore };
}

export default async function SortiesPremieresPage() {
  const { releases, featured, calendarDates, hasMore } = await getInitialData();

  return (
    <SortiesPremieresPageClient
      initialReleases={releases}
      initialFeatured={featured}
      initialCalendarDates={calendarDates}
      initialHasMore={hasMore}
    />
  );
}
