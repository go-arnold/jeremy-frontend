"use client";
import type { EventCity } from "@/types/evenements";

interface Props {
  cities: EventCity[];
  onCityChange: (city: EventCity) => void;
  activeCity: EventCity;
}

export default function EventsHeader({ cities, onCityChange, activeCity }: Props) {
  return (
    <header className="relative  pt-4 z-40  border-b border-white/5">
      <div className="flex flex-col px-4 pt-4 pb-2 gap-4">

        

        {/* Titre */}
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
          Calendrier des Événements
          <span className="block text-sm font-medium text-gray-500 mt-0.5">
            Culture &amp; scènes du Kivu
          </span>
        </h1>
      </div>

      {/* Filtres : une seule ligne scrollable sur mobile */}
      <div className="flex-col overflow-x-auto items-center gap-2 overflow-x-auto hide-scrollbar px-4 pb-4 mt-2">

        {/* Bouton mois */}
        <button className="flex-row shrink-0 items-center justify-center gap-2 rounded-xl bg-surface-dark border border-white/10 py-2 px-4 active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-primary text-[20px]">calendar_month</span>
          <span className="text-white text-sm font-bold">Février 2026</span>
          <span className="material-symbols-outlined text-gray-400 text-[18px]">expand_more</span>
        </button>

        {/* Séparateur */}
        <div className="w-[1px] h-6 bg-white/10 shrink-0 mx-1" />

        {/* Filtres villes */}
        {cities.map((city) => (
          <button
            key={city}
            onClick={() => onCityChange(city)}
            className={`flex-row overflow-x-auto shrink-0 items-center justify-center rounded-xl py-2 px-4 transition-all ${
              activeCity === city
                ? "bg-primary text-white shadow-[0_0_15px_rgba(41,163,163,0.4)]"
                : "bg-surface-dark border border-white/10 text-gray-300 hover:bg-white/5"
            }`}
          >
            <span className="text-sm font-medium">{city}</span>
          </button>
        ))}
      </div>
    </header>
  );
}
