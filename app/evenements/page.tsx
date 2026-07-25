import { upcomingEvents as mockedUpcoming, eventCities as mockedCities } from "@/data/evenements";
import EventsPageClient from "@/components/evenements/EventsPageClient";
import { apiFetch, PaginatedResponse } from "@/lib/api-client";
import { mapApiEventToEvent } from "@/lib/mappers";
import { fetchFeaturedEvent } from "@/lib/services/events";
import EmptyState from "@/components/ui/EmptyState";

// ISR — refetches at most every 60s instead of freezing at build time forever.
export const revalidate = 60;

interface CityApiItem {
  name?: string;
}

async function getFeaturedEvent() {
  try {
    return await fetchFeaturedEvent();
  } catch {
    // No curated featured event (or the endpoint failed) — EventsPageClient falls back to its
    // own `isFeatured`/first-result heuristic over the general list.
    return null;
  }
}

export default async function EvenementsPage() {
  let events: ReturnType<typeof mapApiEventToEvent>[] = [];
  let cities: string[] = mockedCities;
  let hasMore = false;

  try {
    const [eventData, cityData] = await Promise.all([
      apiFetch<PaginatedResponse<Parameters<typeof mapApiEventToEvent>[0]>>("/api/v1/events/?page_size=15"),
      apiFetch<CityApiItem[] | PaginatedResponse<CityApiItem>>("/api/v1/events/cities/"),
    ]);

    events = eventData.results.map(mapApiEventToEvent);
    hasMore = !!eventData.next;

    const cityResults = Array.isArray(cityData) ? cityData : cityData.results || [];
    cities = cityResults.map((c) => (typeof c === "string" ? c : c.name) || "").filter(Boolean);
  } catch (error) {
    console.error("Failed to fetch events initial data:", error);
    events = mockedUpcoming as unknown as ReturnType<typeof mapApiEventToEvent>[];
    cities = mockedCities;
  }

  const featuredEvent = await getFeaturedEvent();

  if (events.length === 0) {
    return (
      <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto w-full">
        <EmptyState
          message="Pas d'événements à l'horizon"
          description="La scène culturelle du Kivu reprend son souffle. De nouveaux événements seront annoncés très prochainement."
          icon="calendar_today"
        />
      </div>
    );
  }

  return (
    <EventsPageClient
      cities={cities.length > 0 ? cities : mockedCities}
      initialEvents={events}
      initialHasMore={hasMore}
      initialFeatured={featuredEvent}
    />
  );
}
