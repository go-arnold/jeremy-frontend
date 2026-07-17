import Link from "next/link";
import type { ArtisteDetail } from "@/types/artistes";
import ArtisteDetailCTA from "./ArtisteDetailCTA";
import FavoriteArtistButton from "./FavoriteArtistButton";
import ShareArtistButton from "./ShareArtistButton";

interface Props {
  artiste: ArtisteDetail;
}

export default function ArtisteDetailHero({ artiste }: Props) {
  return (
    <div className="relative w-full group/hero
      /* Mobile */
      h-[65vh] min-h-[500px]
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

        {/* Mobile : gradient bas→haut */}
        <div className="lg:hidden absolute inset-0 bg-gradient-to-t from-[#131315] via-[#12223ce6]/60 to-transparent" />
        <div className="lg:hidden absolute inset-0 bg-gradient-to-b from-[#131315]/80 via-transparent to-transparent h-32" />

        {/* Desktop : gradient gauche + bas */}
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-[#131315] via-[#12223cd9]/70 to-transparent" />
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-t from-[#12223cd9]/80 via-transparent to-transparent" />
      </div>

      {/* ── Barre du haut : retour + partage ── */}
      <div className="absolute top-0 left-0 w-full z-20 flex items-center justify-between p-4 pt-14 lg:pt-6 lg:px-8 lg:max-w-7xl lg:mx-auto lg:left-0 lg:right-0">
        <Link
          href="/artistes"
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/20 backdrop-blur-md text-white hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
          <span className="hidden lg:block text-sm font-bold">Artistes</span>
        </Link>
        <div className="flex items-center gap-2">
          <FavoriteArtistButton artistId={artiste.artistId} artistSlug={artiste.id} />
          <ShareArtistButton name={artiste.name} slug={artiste.id} />
        </div>
      </div>

      {/* ── Infos artiste ── */}

      {/* MOBILE */}
      <div className="lg:hidden relative z-10 px-5 pb-8 w-full">
        <div className="flex flex-wrap items-center gap-2 text-secondary-accent text-sm font-medium tracking-wide mb-2">
          {artiste.genres.map((g, i) => (
            <span key={g} className="flex items-center gap-2">
              {i > 0 && <span className="size-1 rounded-full bg-secondary-accent inline-block" />}
              {g}
            </span>
          ))}
          <span className="size-1 rounded-full bg-secondary-accent inline-block" />
          <span className="flex items-center gap-1 text-white/80">
            <span className="material-symbols-outlined text-sm">location_on</span>
            {artiste.city}, {artiste.country}
          </span>
        </div>
        <h1 className="font-display text-5xl font-extrabold text-white leading-[0.9] tracking-tighter mb-3">
          {artiste.name}
        </h1>
        <p className="text-gray-300 text-base font-light leading-relaxed max-w-md line-clamp-3">
          {artiste.bio}
        </p>
        <ArtisteDetailCTA bookingLabel={artiste.bookingLabel} />
      </div>

      {/* DESKTOP — texte dans colonne gauche max-w-7xl */}
      <div className="hidden lg:block relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-8 pb-14">
          <div className="max-w-[52%] flex flex-col gap-4">

            {/* Genres + localisation */}
            <div className="flex flex-wrap items-center gap-2 text-secondary-accent text-sm font-medium tracking-wide">
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

            {/* Nom */}
            <h1 className="font-display text-7xl xl:text-8xl font-extrabold text-white leading-[0.85] tracking-tighter">
              {artiste.name}
            </h1>

            {/* Bio — plus de lignes sur desktop */}
            <p className="text-gray-300 text-lg font-light leading-relaxed max-w-xl line-clamp-4">
              {artiste.bio}
            </p>

            {/* CTA — même composant client */}
            <div className="max-w-sm">
              <ArtisteDetailCTA bookingLabel={artiste.bookingLabel} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
