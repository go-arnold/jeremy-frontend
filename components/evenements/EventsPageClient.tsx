"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FeaturedEvent, EventGridItem, EventCity } from "@/types/evenements";
import { shareContent } from "@/lib/share";

import EventsHeader        from "./EventsHeader";
import FeaturedEventCard   from "./FeaturedEventCard";
import UpcomingEventsGrid  from "./UpcomingEventsGrid";
import WhatsAppNotifBanner from "./WhatsAppNotifBanner";
import ContentImage from "@/components/ui/ContentImage";

interface Props {
  cities: EventCity[];
  featured: FeaturedEvent;
  upcoming: EventGridItem[];
}

export default function EventsPageClient({ cities, featured, upcoming }: Props) {
  const [activeCity, setActiveCity] = useState<EventCity>("Tous");
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const filtered = upcoming.filter((e) => {
    const matchesCity = activeCity === "Tous" || e.city === activeCity;
    const matchesMonth = selectedMonth === "" || e.dateLabel.includes(selectedMonth);
    return matchesCity && matchesMonth;
  });

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">

      {/* ══════════════════════════════════════
          MOBILE — layout original inchangé
      ══════════════════════════════════════ */}
      <div className="lg:hidden flex flex-col min-h-screen">
        <EventsHeader cities={cities} activeCity={activeCity} onCityChange={setActiveCity} />
        <main className="flex flex-col px-4 pt-6 gap-8 pb-28">
          <FeaturedEventCard event={featured} />
          <UpcomingEventsGrid events={filtered} />
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
        />

        {/* ── Corps ── */}
        <div className="max-w-7xl mx-auto px-8 w-full pt-8 pb-16">

          {/* Ligne 1 : Featured (55%) + Upcoming (45%) */}
          <div className="grid grid-cols-[11fr_9fr] gap-8 items-start mb-10">

            {/* Featured cinématique */}
            <FeaturedEventDesktop event={featured} />

            {/* Upcoming sidebar scroll */}
            <div className="flex flex-col pt-12 gap-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-[#F0EDE8] uppercase tracking-wide">
                  Prochainement
                </h2>
                <a className="text-sm font-bold text-primary hover:text-[#F0EDE8] transition-colors" href="#">
                  Voir tout
                </a>
              </div>

              {/* Grille 2 colonnes */}
              <div className="grid grid-cols-2 gap-4">
                {filtered.map((event) => (
                  <EventGridCardDesktop key={event.id} event={event} />
                ))}

                {filtered.length === 0 && (
                  <div className="col-span-2 flex flex-col items-center py-16 gap-3 text-center">
                    <span className="material-symbols-outlined text-[#4A443E] text-5xl">event_busy</span>
                    <p className="text-[#8A8178] text-sm">Aucun événement dans cette ville.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ligne 2 : WhatsApp banner pleine largeur */}
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
  cities, activeCity, onCityChange,
}: {
  cities: EventCity[];
  activeCity: EventCity;
  onCityChange: (c: EventCity) => void;
}) {
  return (
    <header
      className="sticky top-16 z-40 border-b border-white/5"
      style={{ background: "rgba(18,34,60,0.85)", backdropFilter: "blur(16px)" }}
    >
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between gap-8">

        {/* Titre + sous-titre */}
        <div className="shrink-0">
          <h1 className="text-2xl font-black text-[#F0EDE8] leading-tight">
            Calendrier des Événements
          </h1>
          <p className="text-xs text-[#8A8178] font-medium mt-0.5">
            Culture &amp; scènes du Kivu
          </p>
        </div>

        {/* Filtres inline */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          {/* Bouton mois */}
          <button className="flex shrink-0 items-center gap-2 rounded-xl bg-white/5 border border-white/10 py-2 px-4 hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-primary text-lg">calendar_month</span>
            <span className="text-white text-sm font-bold">Février 2026</span>
            <span className="material-symbols-outlined text-[#8A8178] text-sm">expand_more</span>
          </button>

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

  return (
    <section className="flex flex-col pt-12 gap-4">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <h2 className="text-xs font-black uppercase tracking-widest text-primary">En Vedette</h2>
      </div>

      <Link href={`/evenements/${event.slug}`} className="block group">
        <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl" style={{ height: "520px" }}>

          <ContentImage
            src={event.image}
            alt={event.title}
            className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#131315] via-[#12223c]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#131315]/40 via-transparent to-transparent" />

          {/* Badge date */}
          <div className="absolute top-5 left-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 flex flex-col items-center min-w-[56px]">
            <span className="text-xs font-black text-primary uppercase">{event.dateShort.month}</span>
            <span className="text-2xl font-black text-white leading-none">{event.dateShort.day}</span>
          </div>

          {/* Contenu bas */}
          <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col gap-5">
            <div>
              <div className="flex items-center gap-2 text-gray-300 mb-2">
                <span className="material-symbols-outlined text-sm">location_on</span>
                <span className="text-sm font-medium">{event.location}</span>
              </div>
              <h3 className="text-4xl xl:text-5xl font-black text-white leading-none tracking-tight mb-3">
                {event.title}
              </h3>
              <p className="text-gray-300 text-base leading-relaxed max-w-xl line-clamp-2">
                {event.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
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
                  share qui ne dépend d'aucune API. */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  shareContent({ title: event.title, url: `/evenements/${event.slug}` }).catch(() => {});
                }}
                className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">share</span>
              </button>
            </div>
          </div>
        </div>
      </Link>
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
          <h3 className="text-xl font-black text-[#F0EDE8] mb-1">Restez informés via WhatsApp</h3>
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
              S'inscrire
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
