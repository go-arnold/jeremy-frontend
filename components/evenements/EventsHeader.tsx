"use client";
import type { EventCity } from "@/types/evenements";
import MonthFilter, { type MonthOption } from "./MonthFilter";

interface Props {
  cities: EventCity[];
  onCityChange: (city: EventCity) => void;
  activeCity: EventCity;
  months: MonthOption[];
  activeMonth: string;
  onMonthChange: (month: string) => void;
}

export default function EventsHeader({ cities, onCityChange, activeCity, months, activeMonth, onMonthChange }: Props) {
  return (
    <header className="relative pt-4 z-40 border-b border-white/5">
      <div className="flex flex-col px-4 pt-4 pb-2 gap-3">
        {/* Titre */}
        <h1 className="text-lg sm:text-2xl font-extrabold leading-tight tracking-tight">
          Calendrier des Événements
          <span className="block text-xs font-medium text-gray-500 mt-0.5">
            Culture &amp; scènes du Kivu
          </span>
        </h1>
      </div>

      {/* Filtre ville — sa propre ligne */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar px-4 pb-2.5">
        {cities.map((city) => (
          <button
            key={city}
            onClick={() => onCityChange(city)}
            className={`flex shrink-0 items-center justify-center rounded-xl py-2 px-4 transition-all ${
              activeCity === city
                ? "bg-primary text-white shadow-[0_0_15px_rgba(41,163,163,0.4)]"
                : "bg-surface-dark border border-white/10 text-gray-300 hover:bg-white/5"
            }`}
          >
            <span className="text-sm font-medium">{city}</span>
          </button>
        ))}
      </div>

      {/* Filtre mois — sa propre ligne en dessous, un peu plus compact */}
      <div className="flex items-center px-4 pb-4">
        <MonthFilter months={months} value={activeMonth} onChange={onMonthChange} size="sm" />
      </div>
    </header>
  );
}
