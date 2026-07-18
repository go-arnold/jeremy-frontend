import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEventDetail as getMockedEventDetail, getSimilarEvents } from "@/data/evenements";
import Link from "next/link";
import { apiFetch } from "@/lib/api-client";
import { mapApiEventDetailToEventDetail } from "@/lib/mappers";
import type { ApiEvent } from "@/lib/api-types";

import EventHero     from "@/components/evenements/EventHero";
import EventInfoGrid from "@/components/evenements/EventInfoGrid";
import EventAbout    from "@/components/evenements/EventAbout";
import EventSchedule from "@/components/evenements/EventSchedule";
import EventVenue    from "@/components/evenements/EventVenue";
import SimilarEvents from "@/components/evenements/SimilarEvents";
import BookingWidget from "@/components/evenements/BookingWidget";
import ShareEventWidget from "@/components/evenements/ShareEventWidget";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
} 

async function getEvent(slug: string) {
  try {
    const data = await apiFetch<ApiEvent>(`/api/v1/events/${slug}/`);
    return mapApiEventDetailToEventDetail(data);
  } catch (error) {
    console.error(`Failed to fetch event ${slug}:`, error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let event = await getEvent(slug);
  if (!event) event = getMockedEventDetail(slug);
  if (!event) return { title: "Événement introuvable | Art du Kivu" };

  const title = `${event.title} | Art du Kivu`;
  const description = event.description
    ? event.description.slice(0, 160)
    : `${event.title} — ${event.location}, ${event.date}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: event.coverImage ? [event.coverImage] : undefined,
    },
  };
}

export default async function EvenementDetailPage({ params }: Props) {
  const { slug } = await params;
  
  // Try API first
  let event = await getEvent(slug);
  
  // Fallback to mocked data
  if (!event) {
    event = getMockedEventDetail(slug);
  }

  if (!event) notFound();

  const similar = getSimilarEvents(event.similarEvents || []);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">

      {/* ══════════════════════════════════════
          MOBILE — layout original inchangé
      ══════════════════════════════════════ */}
      <main className="lg:hidden pb-18 flex flex-col">
        <EventHero event={event} />
        <EventInfoGrid event={event} />
        <EventAbout about={event.about} />
        <EventSchedule items={event.schedule} />
        <EventVenue venue={event.venue} />
        <div className="px-4">
          <ShareEventWidget title={event.title} slug={event.slug} />
        </div>
        <SimilarEvents events={similar} />
        <BookingWidget slug={event.slug} price={event.price} variant="mobile" />
      </main>

      {/* ══════════════════════════════════════
          DESKTOP — layout événement
      ══════════════════════════════════════ */}
      <div className="hidden lg:flex flex-col w-full">

        {/* Hero pleine largeur */}
        <EventHeroDesktop event={event} />

        {/* Corps : article + sidebar */}
        <div className="max-w-7xl mx-auto px-8 w-full mt-10 pb-20">
          <div className="grid grid-cols-[1fr_360px] gap-10 items-start">

            {/* ── Colonne principale ── */}
            <div className="flex flex-col gap-8">

              {/* InfoGrid 4 colonnes horizontales */}
              <EventInfoGridDesktop event={event} />

              {/* À propos */}
              <EventAboutDesktop about={event.about} />

              {/* Programme */}
              <EventScheduleDesktop items={event.schedule} />

              {/* Lieu */}
              <EventVenueDesktop venue={event.venue} />

              {/* Séparateur */}
              <div className="h-px bg-white/10" />

              {/* Événements similaires — grille 3 colonnes */}
              <SimilarEventsDesktop events={similar} />
            </div>

            {/* ── Sidebar sticky ── */}
            <aside className="sticky top-24 flex flex-col gap-5">

              {/* Booking CTA */}
              <BookingWidget
                slug={event.slug}
                price={event.price}
                date={event.date}
                time={event.time}
                variant="desktop"
              />

              {/* Infos clés */}
              <EventKeyInfoDesktop event={event} />

              {/* Partager */}
              <ShareEventWidget title={event.title} slug={event.slug} />
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ════════════════════════════════════════════════════
   VARIANTES DESKTOP (uniquement)
════════════════════════════════════════════════════ */

import type { EventDetail, EventVenue as IEventVenue, EventScheduleItem, EventCard } from "@/types/evenements";

// ── Hero desktop ────────────────────────────────────
function EventHeroDesktop({ event }: { event: EventDetail }) {
  return (
    <section className="relative w-full overflow-hidden" style={{ height: "70vh" }}>
      {/* Cover */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url('${event.coverImage}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#12100F] via-[#12100F]/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#12100F]/50 via-transparent to-transparent" />

      {/* Bouton retour */}
      <div className="absolute top-6 left-8 z-20">
        <Link
          href="/evenements"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/30 backdrop-blur-md text-white hover:bg-white/10 transition-colors font-bold text-sm"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Événements
        </Link>
      </div>

      {/* Badge date */}
      <div className="absolute top-6 right-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 flex flex-col items-center min-w-[60px]">
        <span className="text-xs font-black text-primary uppercase">{event.dateShort.month}</span>
        <span className="text-2xl font-black text-white leading-none">{event.dateShort.day}</span>
      </div>

      {/* Contenu bas */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="max-w-7xl mx-auto px-8 pb-12">
          <div className="max-w-[60%] flex flex-col gap-4">
            {/* Catégorie */}
            <span className="text-xs font-black text-primary uppercase tracking-widest">
              {event.category}
            </span>

            {/* Titre */}
            <h1 className="text-5xl xl:text-6xl font-black text-white leading-none tracking-tight">
              {event.title}
            </h1>

            {/* Lieu + description */}
            <div className="flex items-center gap-2 text-gray-300">
              <span className="material-symbols-outlined text-sm">location_on</span>
              <span className="text-base font-medium">{event.location}</span>
            </div>
            <p className="text-gray-300 text-base leading-relaxed line-clamp-2 max-w-xl">
              {event.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── InfoGrid desktop — 4 colonnes horizontales ──────
function EventInfoGridDesktop({ event }: { event: EventDetail }) {
  const items = [
    { icon: "calendar_month", label: "Date",      value: event.date },
    { icon: "schedule",       label: "Heure",     value: event.time },
    { icon: "category",       label: "Catégorie", value: event.category },
    { icon: "confirmation_number", label: "Entrée", value: event.price },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {items.map(({ icon, label, value }) => (
        <div
          key={label}
          className="rounded-2xl p-5 flex flex-col gap-2"
          style={{ background: "rgba(18,34,60,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span className="material-symbols-outlined text-primary text-xl">{icon}</span>
          <p className="text-[10px] uppercase tracking-widest text-[#8A8178] font-black">{label}</p>
          <p className="text-[#F0EDE8] font-bold text-base">{value}</p>
        </div>
      ))}
    </div>
  );
}

// ── About desktop ───────────────────────────────────
function EventAboutDesktop({ about }: { about: string }) {
  return (
    <section>
      <h2 className="text-2xl font-black text-[#F0EDE8] mb-4">À propos</h2>
      <p className="text-[#8A8178] leading-relaxed text-base">{about}</p>
    </section>
  );
}

// ── Schedule desktop ────────────────────────────────
function EventScheduleDesktop({ items }: { items: EventScheduleItem[] }) {
  return (
    <section>
      <h2 className="text-2xl font-black text-[#F0EDE8] mb-5">Programme</h2>
      <div className="flex flex-col gap-0 relative">
        {/* Ligne verticale timeline */}
        <div className="absolute left-[108px] top-0 bottom-0 w-px bg-white/10" />

        {items.map((item) => (
          <div key={item.date + item.time} className="flex items-center gap-6 py-4">
            {/* Date */}
            <div className="w-24 shrink-0 text-right">
              <p className="text-[10px] text-[#8A8178] font-medium">{item.date}</p>
              <p className="text-primary font-black text-sm">{item.time}</p>
            </div>

            {/* Dot timeline */}
            <div className="w-3 h-3 rounded-full bg-primary shrink-0 relative z-10 shadow-[0_0_8px_rgba(230,48,18,0.5)]" />

            {/* Label */}
            <div
              className="flex-1 p-4 rounded-xl"
              style={{ background: "rgba(18,34,60,0.5)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <p className="text-[#F0EDE8] font-bold">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Venue desktop ───────────────────────────────────
function EventVenueDesktop({ venue }: { venue: IEventVenue }) {
  return (
    <section>
      <h2 className="text-2xl font-black text-[#F0EDE8] mb-5">Lieu</h2>
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Image du lieu — plus grande */}
        <div
          className="w-full bg-cover bg-center"
          style={{
            height: "240px",
            backgroundImage: `url('${venue.image}')`,
            backgroundSize: "cover",
          }}
        />
        <div
          className="p-5 flex items-center justify-between"
          style={{ background: "rgba(18,34,60,0.7)" }}
        >
          <div>
            <p className="text-[#F0EDE8] font-bold text-base">{venue.name}</p>
            <p className="text-[#8A8178] text-sm flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-xs">location_on</span>
              {venue.address}
            </p>
          </div>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(venue.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-[#8A8178] hover:text-[#F0EDE8] hover:border-white/20 transition-all text-sm font-bold"
          >
            <span className="material-symbols-outlined text-sm">map</span>
            Voir sur Maps
          </a>
        </div>
      </div>
    </section>
  );
}

// ── SimilarEvents desktop — grille 3 colonnes ───────
function SimilarEventsDesktop({ events = [] }: { events?: EventCard[] }) {
  if (!events.length) return null;

  return (
    <section>
      <h2 className="text-2xl font-black text-[#F0EDE8] mb-5">Événements similaires</h2>
      <div className="grid grid-cols-3 gap-5">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/evenements/${event.slug}`}
            className="group flex flex-col rounded-xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all"
            style={{ background: "rgba(18,34,60,0.5)" }}
          >
            <div
              className="w-full aspect-video bg-cover bg-center transition-transform duration-500 group-hover:scale-105 overflow-hidden"
              style={{ backgroundImage: `url('${event.image}')` }}
            />
            <div className="p-4">
              <p className="text-primary text-[10px] font-black uppercase tracking-wider mb-1">{event.date}</p>
              <h4 className="text-[#F0EDE8] text-sm font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                {event.title}
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}



// ── Key Info sidebar ────────────────────────────────
function EventKeyInfoDesktop({ event }: { event: EventDetail }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "rgba(18,34,60,0.5)", border: "1px solid rgba(255,255,255,0.05)" }}
    >
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8A8178] mb-4">
        Infos pratiques
      </p>
      <div className="flex flex-col gap-3">
        {[
          { icon: "location_on",  label: "Lieu",      value: event.location },
          { icon: "category",     label: "Catégorie", value: event.category },
          { icon: "sell",         label: "Entrée",    value: event.price },
        ].map(({ icon, label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary text-sm">{icon}</span>
            </div>
            <div>
              <p className="text-[10px] text-[#8A8178] font-medium">{label}</p>
              <p className="text-[#F0EDE8] text-sm font-bold">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

