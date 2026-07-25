"use client";

import Link from "next/link";
import type { NewsCard, CardBadgeVariant } from "@/types";

const badgeStyles: Record<CardBadgeVariant, string> = {
  primary: "bg-[#E63012] text-white",
  teal:    "bg-[#00A896] text-white",
  navy:    "border border-[#0D2347] bg-[#0D2347]/40 text-[#F0EDE8]",
  yellow:  "bg-[#F5C518] text-black",
};

const actionStyles = {
  primary: { bg: "bg-[#E63012]/20 border-[#E63012]/30", icon: "text-[#E63012]" },
  teal:    { bg: "bg-[#00A896]/20 border-[#00A896]/30", icon: "text-[#00A896]" },
};

function NewsCardItem({ card, featured = false }: { card: NewsCard; featured?: boolean }) {
  return (
    <div className={`
      relative shrink-0 overflow-hidden rounded-2xl bg-[#1A1714] shadow-lg card-glow
      /* mobile */
      h-64 w-[80vw] snap-center
      /* desktop : taille fixe dans la grille, featured plus grand */
      lg:w-auto lg:snap-align-none
      ${featured ? "lg:h-80" : "lg:h-64"}
    `}>
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105"
        style={{ backgroundImage: `url('${card.image}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#12100F] via-transparent to-transparent opacity-95" />

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <span className={`mb-2 inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeStyles[card.badgeVariant]}`}>
          {card.badge}
        </span>
        <h3 className={`font-bold leading-tight text-[#F0EDE8] ${featured ? "text-2xl" : "text-xl"}`}>
          {card.title}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm text-[#8A8178]">{card.subtitle}</p>
          <Link
            href={card.href}
            className={`flex size-8 items-center justify-center rounded-full border backdrop-blur-sm ${actionStyles[card.actionColor].bg}`}
          >
            <span className={`material-symbols-outlined text-sm ${actionStyles[card.actionColor].icon}`}>
              {card.actionIcon}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

interface Props {
  cards: NewsCard[];
}

export default function NewsCarousel({ cards }: Props) {
  const [first, ...rest] = cards;

  return (
    <section className="mt-4 flex flex-col gap-4 lg:mt-8">
      <div className="flex items-center justify-between px-6 lg:px-8 lg:max-w-[1600px] lg:mx-auto lg:w-full">
        <h2 className="text-2xl font-bold tracking-tight text-[#F0EDE8]">À la Une</h2>
        <div className="kivu-divider w-12" />
      </div>

      {/* ── MOBILE : carousel horizontal ── */}
      <div className="flex lg:hidden w-full snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 hide-scrollbar">
        {cards.map((card) => (
          <NewsCardItem key={card.id} card={card} />
        ))}
      </div>

      {/* ── DESKTOP : grille éditoriale ── */}
      {/* Première carte large, puis les autres en 2 colonnes */}
      <div className="hidden lg:grid lg:grid-cols-3 lg:gap-4 lg:px-8 lg:max-w-[1600px] lg:mx-auto lg:w-full">
        {/* Featured — 2/3 de largeur */}
        {first && (
          <div className="lg:col-span-2">
            <NewsCardItem card={first} featured />
          </div>
        )}
        {/* Reste — colonne droite empilée */}
        <div className="flex flex-col gap-4">
          {rest.slice(0, 2).map((card) => (
            <NewsCardItem key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
