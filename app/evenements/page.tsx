"use client";

import React, { useState, useEffect } from "react";
import { featuredEvent as mockedFeatured, upcomingEvents as mockedUpcoming, eventCities as mockedCities } from "@/data/evenements";
import EventsPageClient from "@/components/evenements/EventsPageClient";
import { apiFetch, PaginatedResponse } from "@/lib/api-client";
import { mapApiEventToEvent } from "@/lib/mappers";
import EmptyState from "@/components/ui/EmptyState";
import VoirPlusPagination from "@/components/ui/VoirPlusPagination";

export default function EvenementsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const [eventData, cityData] = await Promise.all([
          apiFetch<PaginatedResponse<any>>("/api/v1/events/?page_size=15"),
          apiFetch<any>("/api/v1/events/cities/")
        ]);

        setEvents(eventData.results.map(mapApiEventToEvent));
        setHasMore(!!eventData.next);

        const cityResults = cityData.results || (Array.isArray(cityData) ? cityData : []);
        setCities(cityResults.map((c: any) => c.name || c));
      } catch (error) {
        console.error("Failed to fetch events initial data:", error);
        setEvents(mockedUpcoming as any);
        setCities(mockedCities);
      } finally {
        setLoading(false);
        setInitialDataLoaded(true);
      }
    }
    init();
  }, []);

  const loadMore = async (page: number) => {
    setLoadingLoadingMore(true);
    try {
      const data = await apiFetch<PaginatedResponse<any>>(`/api/v1/events/?page=${page}&page_size=15`);
      const newEvents = data.results.map(mapApiEventToEvent);
      setEvents(prev => [...prev, ...newEvents]);
      setHasMore(!!data.next);
    } catch (error) {
      console.error("Failed to load more events:", error);
      setHasMore(false);
    } finally {
      setLoadingLoadingMore(false);
    }
  };

  const showEmptyState = initialDataLoaded && events.length === 0;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const featured = events.find(e => e.isFeatured) || events[0] || mockedFeatured;
  const upcoming = events.filter(e => e.id !== featured?.id);

  if (showEmptyState) {
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
    <>
      <EventsPageClient
        cities={cities.length > 0 ? cities : mockedCities}
        featured={featured as any}
        upcoming={upcoming as any}
      />
      <div className="max-w-7xl mx-auto px-8 pb-16">
        <VoirPlusPagination 
          onLoadMore={loadMore} 
          hasMore={hasMore} 
          isLoading={loadingMore} 
        />
      </div>
    </>
  );
}