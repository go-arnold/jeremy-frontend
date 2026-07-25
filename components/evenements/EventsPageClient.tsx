"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { EventCity, FeaturedEvent, EventGridItem } from "@/types/evenements";
import { resolveShareUrl } from "@/lib/share";
import { apiFetch, PaginatedResponse } from "@/lib/api-client";
import { mapApiEventToEvent } from "@/lib/mappers";

import EventsHeader        from "./EventsHeader";
import FeaturedEventCard   from "./FeaturedEventCard";
import UpcomingEventsGrid  from "./UpcomingEventsGrid";
import MobileEventsCarousel from "./MobileEventsCarousel";
import WhatsAppNotifBanner from "./WhatsAppNotifBanner";
import MonthFilter, { type MonthOption } from "./MonthFilter";
import ContentImage from "@/components/ui/ContentImage";
import EmptyState from "@/components/ui/EmptyState";
import VoirPlusPagination from "@/components/ui/VoirPlusPagination";
import ShareMenu from "@/components/ui/ShareMenu";

type MappedEvent = ReturnType<typeof mapApiEventToEvent>;

// The compact preview (mobile carousel / desktop sidebar) always shows the same top N unfiltered
// upcoming events — filtering or clicking "Voir plus" switches to the full expanded section below
// the featured event instead of changing what the preview shows.
const PREVIEW_LIMIT = 4;

interface Props {
  cities: EventCity[];
  initialEvents: MappedEvent[];
  initialHasMore: boolean;
  /** The backend's actual curated pick (`GET /events/featured/`) — preferred over the
   * `isFeatured`/first-result heuristic below, which only sees whatever page of the general list
   * is currently loaded. */
  initialFeatured?: MappedEvent | null;
}

/** Distinct months actually present in the loaded events, sorted chronologically — drives
 * MonthFilter's options instead of a hardcoded "Février 2026". */
function useAvailableMonths(events: MappedEvent[]): MonthOption[] {
  return useMemo(() => {
    const seen = new Map<string, string>();
    for (const e of events) if (!seen.has(e.monthKey)) seen.set(e.monthKey, e.monthLabel);
    return Array.from(seen, ([key, label]) => ({ key, label })).sort((a, b) => a.key.localeCompare(b.key));
  }, [events]);
}

export default function EventsPageClient({ cities, initialEvents, initialHasMore, initialFeatured }: Props) {
  const [activeCity, setActiveCity] = useState<EventCity>("Tous");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [events, setEvents] = useState(initialEvents);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loadingMore, setLoadingMore] = useState(false);
  // Both mobile and desktop layouts are always mounted (toggled with CSS, not conditional
  // rendering) — a single shared ref would just get overwritten by whichever renders last, so
  // each breakpoint gets its own; scrolling the hidden one is a harmless no-op.
  const mobileResultsRef = useRef<HTMLDivElement>(null);
  const desktopResultsRef = useRef<HTMLDivElement>(null);

  const months = useAvailableMonths(events);
  const featured = initialFeatured || events.find((e) => e.isFeatured) || events[0];
  const upcoming = events.filter((e) => e.id !== featured?.id);

  const loadMore = async (page: number) => {
    setLoadingMore(true);
    try {
      const data = await apiFetch<PaginatedResponse<Parameters<typeof mapApiEventToEvent>[0]>>(
        `/api/v1/events/?page=${page}&page_size=15`
      );
      setEvents((prev) => [...prev, ...data.results.map(mapApiEventToEvent)]);
      setHasMore(!!data.next);
    } catch (error) {
      console.error("Failed to load more events:", error);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  const clearFilters = () => {
    setActiveCity("Tous");
    setSelectedMonth("");
    setShowAllEvents(false);
  };

  const isFiltering = activeCity !== "Tous" || selectedMonth !== "";
  const expanded = showAllEvents || isFiltering;

  const filtered = upcoming.filter((e) => {
    const matchesCity = activeCity === "Tous" || e.city === activeCity;
    const matchesMonth = selectedMonth === "" || e.monthKey === selectedMonth;
    return matchesCity && matchesMonth;
  });

  const previewEvents = upcoming.slice(0, PREVIEW_LIMIT);

  // "le client soit redirigé vers cette section" — scroll to the expanded results whenever they
  // appear, whether triggered by "Voir plus" or by picking a city/month filter.
  useEffect(() => {
    if (expanded) {
      mobileResultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      desktopResultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [expanded]);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">

      {/* ══════════════════════════════════════
          MOBILE — layout original inchangé
      ══════════════════════════════════════ */}
      <div className="lg:hidden flex flex-col min-h-screen">
        <EventsHeader
          cities={cities}
          activeCity={activeCity}
          onCityChange={setActiveCity}
          months={months}
          activeMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />
        <main className="flex flex-col px-4 pt-6 gap-8 pb-28">
          {featured && <FeaturedEventCard event={featured} />}

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">Prochainement</h2>
              {!expanded && upcoming.length > PREVIEW_LIMIT && (
                <button
                  onClick={() => setShowAllEvents(true)}
                  className="text-xs font-bold text-primary hover:text-white transition-colors"
                >
                  Voir tout
                </button>
              )}
              {expanded && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-bold text-primary hover:text-white transition-colors"
                >
                  Réduire
                </button>
              )}
            </div>

            {!expanded ? (
              <MobileEventsCarousel events={previewEvents} />
            ) : (
              <div ref={mobileResultsRef} className="flex flex-col gap-6">
                <UpcomingEventsGrid events={filtered} onClearFilters={clearFilters} />
                <VoirPlusPagination onLoadMore={loadMore} hasMore={hasMore} isLoading={loadingMore} />
              </div>
            )}
          </section>

          <WhatsAppNotifBanner />
        </main>
      </div>

      {/* ══════════════════════════════════════
          DESKTOP — layout agenda culturel
      ══════════════════════════════════════ */}
      <div className="hidden lg:flex flex-col w-full">

        {/* ── Header desktop ── */}
        <EventsHeaderDesktop
          cities={cities}
          activeCity={activeCity}
          onCityChange={setActiveCity}
          months={months}
          activeMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />

        {/* ── Corps ── */}
        <div className="max-w-[1600px] mx-auto px-8 w-full pt-8 pb-16">

          {/* Ligne 1 : Featured (55%) + Upcoming (45%) */}
          <div className="grid grid-cols-[11fr_9fr] gap-8 items-start mb-10">

            {/* Featured cinématique */}
            {featured && <FeaturedEventDesktop event={featured} />}

            {/* Upcoming sidebar scroll — aperçu des 4 premiers, non filtré */}
            <div className="flex flex-col pt-12 gap-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-[#F0EDE8] uppercase tracking-wide">
                  Prochainement
                </h2>
                {!expanded && upcoming.length > PREVIEW_LIMIT && (
                  <button
                    onClick={() => setShowAllEvents(true)}
                    className="text-sm font-bold text-primary hover:text-[#F0EDE8] transition-colors"
                  >
                    Voir plus
                  </button>
                )}
              </div>

              {expanded ? (
                <p className="flex items-center gap-2 text-[#8A8178] text-sm py-6">
                  <span className="material-symbols-outlined text-primary text-lg">arrow_downward</span>
                  Résultats affichés ci-dessous
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {previewEvents.map((event) => (
                    <EventGridCardDesktop key={event.id} event={event} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Ligne 2 : résultats complets / filtrés, pleine largeur centrée */}
          {expanded && (
            <div ref={desktopResultsRef} className="pt-2 pb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-black text-[#F0EDE8] uppercase tracking-wide">
                  {isFiltering ? "Résultats" : "Tous les événements"}
                </h2>
                <button
                  onClick={clearFilters}
                  className="text-sm font-bold text-primary hover:text-[#F0EDE8] transition-colors"
                >
                  Réduire
                </button>
              </div>

              {filtered.length === 0 ? (
                <EmptyState
                  message="Aucun événement dans ce filtre"
                  description="Essayez une autre ville ou un autre mois."
                  icon="event_busy"
                >
                  <button
                    onClick={clearFilters}
                    className="mt-2 text-primary text-sm font-bold hover:underline"
                  >
                    Réinitialiser les filtres
                  </button>
                </EmptyState>
              ) : (
                <div className="grid grid-cols-4 gap-5">
                  {filtered.map((event) => (
                    <EventGridCardDesktop key={event.id} event={event} />
                  ))}
                </div>
              )}

              <div className="mt-8">
                <VoirPlusPagination onLoadMore={loadMore} hasMore={hasMore} isLoading={loadingMore} />
              </div>
            </div>
          )}

          {/* Ligne 3 : WhatsApp banner pleine largeur */}
          <WhatsAppNotifBannerDesktop />
        </div>
      </div>
    </div>
  );
}


/* ════════════════════════════════════════════════════
   VARIANTES DESKTOP (uniquement)
════════════════════════════════════════════════════ */

// ── Header desktop ──────────────────────────────────
function EventsHeaderDesktop({
  cities, activeCity, onCityChange, months, activeMonth, onMonthChange,
}: {
  cities: EventCity[];
  activeCity: EventCity;
  onCityChange: (c: EventCity) => void;
  months: MonthOption[];
  activeMonth: string;
  onMonthChange: (m: string) => void;
}) {
  return (
    <header
      className="sticky top-16 z-40 border-b border-white/5"
      style={{ background: "rgba(18,34,60,0.85)", backdropFilter: "blur(16px)" }}
    >
      <div className="max-w-[1600px] mx-auto px-8 py-4 flex items-center justify-between gap-8">

        {/* Titre + sous-titre */}
        <div className="shrink-0">
          <h1 className="text-xl font-black text-[#F0EDE8] leading-tight">
            Calendrier des Événements
          </h1>
          <p className="text-xs text-[#8A8178] font-medium mt-0.5">
            Culture &amp; scènes du Kivu
          </p>
        </div>

        {/* Filtres inline */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <MonthFilter months={months} value={activeMonth} onChange={onMonthChange} />

          <div className="w-px h-6 bg-white/10 shrink-0" />

          {/* Villes */}
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => onCityChange(city)}
              className={`flex shrink-0 items-center rounded-xl py-2 px-4 transition-all text-sm font-bold ${
                activeCity === city
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white/5 border border-white/10 text-[#8A8178] hover:text-[#F0EDE8] hover:bg-white/10"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

// ── FeaturedEvent desktop ───────────────────────────
function FeaturedEventDesktop({ event }: { event: FeaturedEvent }) {
  const router = useRouter();
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const shareUrl = `/evenements/${event.slug}`;

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Découvrez ${event.title} sur Art du Kivu`,
          url: resolveShareUrl(shareUrl),
        });
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        // fall through to the manual menu on any other native-share failure
      }
    }
    setShareMenuOpen(true);
  };

  return (
    <section className="flex flex-col pt-12 gap-4">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <h2 className="text-xs font-black uppercase tracking-widest text-primary">En Vedette</h2>
      </div>

      <Link href={`/evenements/${event.slug}`} className="block group">
        <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl" style={{ height: "480px" }}>

          <ContentImage
            src={event.image}
            alt={event.title}
            className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#131315] via-[#12223c]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#131315]/40 via-transparent to-transparent" />

          {/* Badge date */}
          <div className="absolute top-5 left-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 flex flex-col items-center min-w-[56px]">
            <span className="text-xs font-black text-primary uppercase">{event.dateShort?.month || "—"}</span>
            <span className="text-2xl font-black text-white leading-none">{event.dateShort?.day || "—"}</span>
          </div>

          {/* Contenu bas */}
          <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col gap-5">
            <div>
              <div className="flex items-center gap-2 text-gray-300 mb-2">
                <span className="material-symbols-outlined text-sm">location_on</span>
                <span className="text-sm font-medium">{event.location}</span>
              </div>
              <h3 className="text-3xl xl:text-4xl font-black text-white leading-none tracking-tight mb-3">
                {event.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed max-w-xl line-clamp-2">
                {event.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(`/evenements/${event.slug}`);
                }}
                className="bg-primary hover:bg-[#B8240C] text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-all hover:scale-[1.02] shadow-lg shadow-primary/20"
              >
                <span>Voir Détails</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
              {/* Pas de "bookmark_border" — les événements n'ont aucune capacité de
                  sauvegarde côté backend (pas d'EngagementActionsMixin), contrairement au
                  share qui ne dépend d'aucune API. preventDefault is required here, not just
                  stopPropagation — this button sits inside the card's <Link>, and only
                  preventDefault stops the browser's native "click inside an anchor navigates"
                  behavior; stopPropagation alone just stops React's synthetic bubbling and left
                  clicking "Partager" hard-navigating the *sharer* to the event page too. */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleShare();
                }}
                className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">share</span>
              </button>
            </div>
          </div>
        </div>
      </Link>

      <ShareMenu
        open={shareMenuOpen}
        onClose={() => setShareMenuOpen(false)}
        url={shareUrl}
        text={`Découvrez ${event.title} sur Art du Kivu`}
      />
    </section>
  );
}

// ── EventGridCard desktop ───────────────────────────
function EventGridCardDesktop({ event }: { event: EventGridItem }) {
  return (
    <Link
      href={`/evenements/${event.slug}`}
      className="group flex flex-col rounded-xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-300"
      style={{ background: "rgba(18,34,60,0.5)" }}
    >
      {/* Image fixe aspect-video sur desktop */}
      <div className="relative aspect-video overflow-hidden">
        <ContentImage
          src={event.image}
          alt={event.title}
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {/* Badge catégorie */}
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-black text-white uppercase tracking-wider">
          {event.category}
        </div>
        {/* Badge date */}
        <div className="absolute top-2 left-2 bg-primary/90 px-2 py-1 rounded-lg flex flex-col items-center min-w-[36px]">
          <span className="text-[8px] font-black text-white uppercase leading-none">{event.dateLabel?.split(" ")[1] ?? ""}</span>
          <span className="text-base font-black text-white leading-none">{event.dateLabel?.split(" ")[0] ?? ""}</span>
        </div>
      </div>

      {/* Infos */}
      <div className="p-4 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-primary text-[10px] font-black uppercase tracking-wider">{event.city}</span>
          <span className="text-[#8A8178] text-[10px]">{event.dateLabel}</span>
        </div>
        <h3 className="text-[#F0EDE8] text-sm font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {event.title}
        </h3>
        <p className="text-[#8A8178] text-xs flex items-center gap-1">
          <span className="material-symbols-outlined text-xs">location_on</span>
          {event.venue}
        </p>
      </div>
    </Link>
  );
}

// ── WhatsApp banner desktop ─────────────────────────
function WhatsAppNotifBannerDesktop() {
  const [phone, setPhone] = useState("");
  const [sent, setSent]   = useState(false);

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-8 flex items-center justify-between gap-8"
      style={{
        background: "linear-gradient(135deg, rgba(18,34,60,0.9) 0%, rgba(37,99,85,0.3) 100%)",
        border: "1px solid rgba(37,211,102,0.2)",
      }}
    >
      {/* Halos */}
      <div className="absolute -right-10 -top-10 w-48 h-48 bg-green-500/10 blur-[60px] rounded-full pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />

      {/* Gauche : texte */}
      <div className="relative z-10 flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center shrink-0 border border-green-500/30">
          <span className="material-symbols-outlined text-green-400 text-2xl">chat</span>
        </div>
        <div>
          <h3 className="text-lg font-black text-[#F0EDE8] mb-1">Restez informés via WhatsApp</h3>
          <p className="text-[#8A8178] text-sm max-w-md leading-relaxed">
            Recevez les derniers événements culturels du Kivu directement dans WhatsApp.
          </p>
        </div>
      </div>

      {/* Droite : formulaire */}
      <div className="relative z-10 shrink-0">
        {sent ? (
          <div className="flex items-center gap-2 text-green-400 font-bold">
            <span className="material-symbols-outlined">check_circle</span>
            Vous êtes inscrit !
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !phone.trim() ? null : e.key === "Enter" ? setSent(true) : null}
              className="w-52 bg-black/30 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500/50 transition-colors placeholder:text-[#8A8178]"
              placeholder="+243 XXX XXX XXX"
              type="tel"
            />
            <button
              onClick={() => phone.trim() && setSent(true)}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-5 py-3 rounded-xl transition-all hover:scale-[1.02] text-sm"
            >
              <span className="material-symbols-outlined text-lg">send</span>
              S&apos;inscrire
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
