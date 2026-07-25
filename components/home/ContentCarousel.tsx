"use client";

import Link from "next/link";
import type { ContentCard, CardBadgeVariant } from "@/types";
import ContentImage from "@/components/ui/ContentImage";

const badgeStyles: Record<CardBadgeVariant, string> = {
  primary: "bg-[#a80010] text-white",
  teal:    "bg-[#00A896] text-white",
  navy:    "border border-[#0D2347] bg-[#0D2347]/40 text-[#F0EDE8]",
  yellow:  "bg-[#F5C518] text-black",
};

const ctaStyles = {
  primary: "border-[#ffffff]/50 text-[#ffffff] hover:bg-[#ffffff] hover:text-black",
  teal:    "border-[#00A896]/50 text-[#00A896] hover:bg-[#00A896] hover:text-black",
};

const borderStyles: Record<CardBadgeVariant, string> = {
  primary: "border-[#a80010]/10",
  teal:    "border-[#00A896]/10",
  navy:    "border-[#F0EDE8]/5",
  yellow:  "border-[#F5C518]/10",
};

interface Props {
  cards: ContentCard[];
}

export default function ContentCarousel({ cards }: Props) {
  return (
    <section className="mt-8 lg:mt-12">
      <div className="flex items-center justify-between px-4 mb-4 lg:px-8 lg:max-w-[1800px] lg:mx-auto">
        <h3 className="text-base lg:text-xl font-bold tracking-tight uppercase border-l-4 border-[#E63012] pl-3 text-[#F0EDE8]">
          Contenus à la Une
        </h3>
        <span className="material-symbols-outlined text-[#E63012] text-lg lg:text-2xl">arrow_forward_ios</span>
      </div>

      {/* ── MOBILE : scroll horizontal ── */}
      <div className="lg:hidden flex overflow-x-auto gap-3 px-4 hide-scrollbar">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`min-w-[220px] bg-[#1A1714] rounded-xl overflow-hidden border card-glow ${borderStyles[card.badgeVariant]}`}
          >
            <div className="relative h-32">
              <ContentImage src={card.image} alt={card.title} className="absolute inset-0" />
              <div className={`absolute top-2 left-2 text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${badgeStyles[card.badgeVariant]}`}>
                {card.badge}
              </div>
            </div>
            <div className="p-3 bg-[#12223ce6]">
              <h4 className="text-sm font-bold text-[#F0EDE8] leading-snug">{card.title}</h4>
              <p className="text-[#8A8178] text-xs mb-3 line-clamp-2">{card.description}</p>
              <Link href={card.href} className={`block w-full py-1.5 px-3 border rounded-lg text-xs font-bold transition-colors text-center ${ctaStyles[card.ctaVariant]}`}>
                {card.ctaLabel}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* ── DESKTOP : grille 4 colonnes ── */}
      <div className="hidden lg:grid lg:grid-cols-4 lg:gap-5 lg:px-8 lg:max-w-[1800px] lg:mx-auto">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`bg-[#1A1714] rounded-xl overflow-hidden border card-glow flex flex-col ${borderStyles[card.badgeVariant]}`}
          >
            {/* Image + badge */}
            <div className="relative h-44">
              <ContentImage src={card.image} alt={card.title} className="absolute inset-0" />
              <div className={`absolute top-3 left-3 text-[10px] font-black uppercase px-2 py-1 rounded ${badgeStyles[card.badgeVariant]}`}>
                {card.badge}
              </div>
            </div>
            {/* Contenu */}
            <div className="p-4 bg-[#12223ce6] flex flex-col flex-1 gap-3">
              <h4 className="text-base font-bold text-[#F0EDE8] leading-snug">{card.title}</h4>
              <p className="text-[#8A8178] text-sm flex-1 leading-relaxed">{card.description}</p>
              <Link
                href={card.href}
                className={`block w-full py-2 px-4 border rounded-lg text-sm font-bold transition-colors text-center ${ctaStyles[card.ctaVariant]}`}
              >
                {card.ctaLabel}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
