import Link from "next/link";
import type { ArtisteDetail } from "@/types/artistes";
import ArtisteDetailCTA from "./ArtisteDetailCTA";
import FavoriteArtistButton from "./FavoriteArtistButton";
import ShareArtistButton from "./ShareArtistButton";
import ExpandableBio from "./ExpandableBio";

interface Props {
  artiste: ArtisteDetail;
}

// Guaranteed-legible text over any cover photo, regardless of its own colors/contrast.
const TEXT_SHADOW = { textShadow: "0 2px 14px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.9)" };

export default function ArtisteDetailHero({ artiste }: Props) {
  return (
    <div className="relative w-full group/hero
      /* Mobile */
      h-[65vh] min-h-[460px]
      /* Desktop */
      lg:h-[75vh] lg:min-h-[600px]
      flex flex-col justify-end
    ">
      {/* ── Image de couverture ── */}
      <div className="absolute inset-0 w-full h-full z-0">
        <div
          className="w-full h-full bg-center bg-cover bg-no-repeat transition-transform duration-1000 group-hover/hero:scale-[1.02]"
          style={{ backgroundImage: `url('${artiste.coverImage}')` }}
        />

        {/* Mobile : scrim renforcé bas→haut — lisible quelle que soit la photo */}
        <div className="lg:hidden absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/10" />
        <div className="lg:hidden absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0a1526] to-transparent" />
        <div className="lg:hidden absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-transparent h-28" />

        {/* Desktop : scrim gauche + bas renforcé */}
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-black via-black/75 to-transparent" />
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      </div>

      {/* ── Barre du haut : retour + partage ── */}
      <div className="absolute top-0 left-0 w-full z-20 flex items-center justify-between p-4 pt-14 lg:pt-6 lg:px-8 lg:max-w-[1800px] lg:mx-auto lg:left-0 lg:right-0">
        <Link
          href="/artistes"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/30 backdrop-blur-md text-white hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          <span className="text-xs lg:text-sm font-bold">Artistes</span>
        </Link>
        <div className="flex items-center gap-2">
          <FavoriteArtistButton artistId={artiste.artistId} artistSlug={artiste.id} />
          <ShareArtistButton name={artiste.name} slug={artiste.id} />
        </div>
      </div>

      {/* ── Infos artiste ── */}

      {/* MOBILE */}
      <div className="lg:hidden relative z-10 px-5 pb-7 w-full">
        <div className="flex flex-wrap items-center gap-1.5 text-secondary-accent text-xs font-medium tracking-wide mb-2" style={TEXT_SHADOW}>
          {artiste.genres.map((g, i) => (
            <span key={g} className="flex items-center gap-1.5">
              {i > 0 && <span className="size-1 rounded-full bg-secondary-accent inline-block" />}
              {g}
            </span>
          ))}
          <span className="size-1 rounded-full bg-secondary-accent inline-block" />
          <span className="flex items-center gap-1 text-white/80">
            <span className="material-symbols-outlined text-xs">location_on</span>
            {artiste.city}, {artiste.country}
          </span>
        </div>
        <h1
          className="font-display text-[clamp(1.5rem,7vw,2.25rem)] font-extrabold text-white leading-[1.05] tracking-tight break-words mb-2"
          style={TEXT_SHADOW}
        >
          {artiste.name}
        </h1>
        <ExpandableBio
          text={artiste.bio}
          className="text-gray-200 text-sm font-light leading-relaxed max-w-md"
          clampLines={2}
        />
        <ArtisteDetailCTA artistId={artiste.artistId} artistSlug={artiste.id} />
      </div>

      {/* DESKTOP — texte dans colonne gauche */}
      <div className="hidden lg:block relative z-10 w-full">
        <div className="max-w-[1800px] mx-auto px-8 pb-14">
          <div className="max-w-[52%] flex flex-col gap-4">

            {/* Genres + localisation */}
            <div className="flex flex-wrap items-center gap-2 text-secondary-accent text-sm font-medium tracking-wide" style={TEXT_SHADOW}>
              {artiste.genres.map((g, i) => (
                <span key={g} className="flex items-center gap-2">
                  {i > 0 && <span className="size-1 rounded-full bg-secondary-accent inline-block" />}
                  {g}
                </span>
              ))}
              <span className="size-1 rounded-full bg-secondary-accent inline-block" />
              <span className="flex items-center gap-1 text-white/70">
                <span className="material-symbols-outlined text-sm">location_on</span>
                {artiste.city}, {artiste.country}
              </span>
            </div>

            {/* Nom — clamp pour rester lisible même avec un nom très long */}
            <h1
              className="font-display text-[clamp(2.5rem,5.5vw,5rem)] font-extrabold text-white leading-[0.95] tracking-tight break-words"
              style={TEXT_SHADOW}
            >
              {artiste.name}
            </h1>

            {/* Bio — plus de lignes sur desktop */}
            <ExpandableBio
              text={artiste.bio}
              className="text-gray-200 text-base font-light leading-relaxed max-w-xl"
              clampLines={2}
            />

            {/* CTA — même composant client */}
            <div className="max-w-sm">
              <ArtisteDetailCTA artistId={artiste.artistId} artistSlug={artiste.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
