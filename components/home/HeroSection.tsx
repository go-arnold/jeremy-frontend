"use client";

import Link from "next/link";
import type { Hero } from "@/types";

interface Props {
  data: Hero;
}

export default function HeroSection({ data }: Props) {
  return (
    <section className="relative w-full shrink-0 overflow-hidden
      h-[85vh]
      lg:h-[92vh] lg:mt-0
    ">
      {/* ── Image de fond ── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: `url("${data.backgroundImage}")` }}
      />

      {/* ── Overlays ── */}
      {/* Mobile : dégradé bas vers haut */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#12121c] via-[#12223c]/40 to-transparent lg:hidden" />
      {/* Desktop : dégradé droite vers gauche pour la colonne texte */}
      <div className="absolute inset-0 hidden lg:block bg-gradient-to-r from-[#12121c] via-[#12121c]/80 to-transparent" />
      {/* Desktop : légère assombrissement global */}
      <div className="absolute inset-0 hidden lg:block bg-[#12121c]/20" />

      {/* ══════════════════════════════════
          MOBILE  — texte centré en bas
      ══════════════════════════════════ */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center p-6 pb-12 text-center lg:hidden">
        <div className="mb-3 h-1 w-10 rounded-full bg-[#E63012]" />
        <h1 className="mb-2 text-3xl font-black leading-[1.1] tracking-tight text-[#F0EDE8] drop-shadow-lg">
          {data.title}{" "}
          <span className="text-[#E63012]">{data.titleHighlight}</span>
        </h1>
        <p className="mb-8 text-base font-light text-[#F0EDE8]/60">
          {data.subtitle}
        </p>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={data.ctaPrimary.href}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#E63012] px-6 transition hover:bg-[#B8240C] hover:scale-[1.02] active:scale-95 sm:w-auto"
          >
            <span className="material-symbols-outlined text-white">play_circle</span>
            <span className="text-base font-bold text-white">{data.ctaPrimary.label}</span>
          </Link>
          <Link
            href={data.ctaSecondary.href}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-[#0D2347]/60 bg-[#0D2347]/30 px-6 backdrop-blur-sm transition hover:bg-[#0D2347]/50 hover:scale-[1.02] active:scale-95 sm:w-auto"
          >
            <span className="material-symbols-outlined text-[#F0EDE8]">library_music</span>
            <span className="text-base font-bold text-[#F0EDE8]">{data.ctaSecondary.label}</span>
          </Link>
        </div>
      </div>

      
      <div className="hidden lg:flex absolute inset-0 items-center">
        <div className="w-full max-w-7xl mx-auto px-16 flex flex-col justify-center h-full">
          {/* Colonne gauche — max 55% */}
          <div className="max-w-[55%] flex flex-col gap-6">

            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <div className="h-1 w-12 rounded-full bg-[#E63012]" />
              <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#E63012]">
                Plateforme culturelle du Kivu
              </span>
            </div>

            {/* Titre */}
            <h1 className="text-6xl xl:text-7xl font-black leading-[1.0] tracking-tight text-[#F0EDE8]">
              {data.title}{" "}
              <span className="text-[#E63012]">{data.titleHighlight}</span>
            </h1>

            {/* Sous-titre */}
            <p className="text-xl font-light text-[#F0EDE8]/60 max-w-md leading-relaxed">
              {data.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex gap-4 mt-2">
              <Link
                href={data.ctaPrimary.href}
                className="flex h-14 items-center gap-3 rounded-xl bg-[#E63012] px-8 font-bold text-white transition hover:bg-[#B8240C] hover:scale-[1.02] active:scale-95 text-base shadow-lg shadow-[#E63012]/20"
              >
                <span className="material-symbols-outlined">play_circle</span>
                {data.ctaPrimary.label}
              </Link>
              <Link
                href={data.ctaSecondary.href}
                className="flex h-14 items-center gap-3 rounded-xl border border-[#0D2347]/60 bg-[#0D2347]/30 px-8 font-bold text-[#F0EDE8] backdrop-blur-sm transition hover:bg-[#0D2347]/50 hover:scale-[1.02] active:scale-95 text-base"
              >
                <span className="material-symbols-outlined">library_music</span>
                {data.ctaSecondary.label}
              </Link>
            </div>

            
            <div className="flex gap-8 mt-4 pt-6 border-t border-[#F0EDE8]/10">
              {[
                { value: "50+", label: "Artistes" },
                { value: "1K+", label: "Auditeurs" },
                { value: "Live", label: "24/7" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="text-2xl font-black text-[#E63012]">{stat.value}</span>
                  <span className="text-xs font-medium text-[#8A8178] uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#F0EDE8]/30">
          <span className="text-[10px] tracking-widest uppercase">Défiler</span>
          <span className="material-symbols-outlined text-sm animate-bounce">keyboard_arrow_down</span>
        </div>
      </div>
    </section>
  );
}
