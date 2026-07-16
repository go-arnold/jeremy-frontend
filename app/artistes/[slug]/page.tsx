import { notFound } from "next/navigation";
import { getArtisteDetail as getMockedArtisteDetail } from "@/data/artistes";
import { apiFetch } from "@/lib/api-client";
import { mapApiArtistDetailToArtisteDetail } from "@/lib/mappers";

import ArtisteDetailHero from "@/components/artistesComp/ArtisteDetailHero";
import LatestReleases    from "@/components/artistesComp/LatestReleases";
import KivuTV            from "@/components/artistesComp/KivuTV";
import PhotoGallery      from "@/components/artistesComp/PhotoGallery";
import ArtisteDetailCTA  from "@/components/artistesComp/ArtisteDetailCTA";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getArtiste(slug: string) {
  try {
    const data = await apiFetch<any>(`/api/v1/artists/${slug}/`);
    return mapApiArtistDetailToArtisteDetail(data);
  } catch (error) {
    console.error(`Failed to fetch artist ${slug}:`, error);
    return null;
  }
}

export default async function ArtisteDetailPage({ params }: Props) {
  const { slug } = await params;
  
  // Try API first
  let artiste = await getArtiste(slug);
  
  // Fallback to mocked data if API fails or artist not found in API
  if (!artiste) {
    artiste = getMockedArtisteDetail(slug) as any;
  }
  
  if (!artiste) notFound();

  return (
    <div className="relative min-h-screen overflow-x-hidden kivu-texture pb-28">
      <div className="fixed inset-0 pointer-events-none z-0 mix-blend-overlay opacity-30 bg-noise" />

      {/* Hero — pleine largeur sur mobile ET desktop */}
      <ArtisteDetailHero artiste={artiste} />

      {/* ══════════════════════════════════════
          MOBILE — empilement original
      ══════════════════════════════════════ */}
      <div className="lg:hidden relative z-10 flex flex-col gap-8 w-full max-w-3xl mx-auto md:px-4">
        <LatestReleases releases={artiste.releases} />
        <KivuTV videos={artiste.videos} />
        <PhotoGallery photos={artiste.gallery} />
      </div>

      {/* ══════════════════════════════════════
          DESKTOP — 2 colonnes
      ══════════════════════════════════════ */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_300px] lg:gap-8 lg:max-w-7xl lg:mx-auto lg:px-8 lg:mt-10 relative z-10">

        {/* ── Colonne principale ── */}
        <div className="flex flex-col gap-10">
          <LatestReleasesDesktop releases={artiste.releases} />
          <KivuTVDesktop videos={artiste.videos} />
          <PhotoGalleryDesktop photos={artiste.gallery} />
        </div>

        {/* ── Sidebar sticky ── */}
        <aside className="sticky top-24 self-start flex flex-col gap-5">

          {/* CTA booking */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "rgba(18,34,60,0.7)", border: "1px solid rgba(230,48,18,0.15)" }}
          >
            <ArtisteDetailCTA bookingLabel={artiste.bookingLabel} />
          </div>

          {/* Stats */}
          <div
            className="rounded-2xl p-5 flex flex-col gap-4"
            style={{ background: "rgba(18,34,60,0.5)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8A8178]">
              Statistiques
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "album",       label: "Sorties",   value: `${artiste.releases?.length ?? 0}` },
                { icon: "videocam",    label: "Vidéos",    value: `${artiste.videos?.length ?? 0}` },
                { icon: "photo_library", label: "Photos",  value: `${artiste.gallery?.length ?? 0}` },
                { icon: "location_on", label: "Ville",     value: artiste.city },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col gap-1 p-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <span className="material-symbols-outlined text-primary text-base">{stat.icon}</span>
                  <span className="text-[#F0EDE8] font-bold text-sm">{stat.value}</span>
                  <span className="text-[#8A8178] text-[10px] font-medium">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Genres */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "rgba(18,34,60,0.5)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8A8178] mb-3">
              Genres
            </p>
            <div className="flex flex-wrap gap-2">
              {artiste.genres.map((g: string) => (
                <span
                  key={g}
                  className="px-3 py-1.5 rounded-full text-xs font-bold text-primary border border-primary/25 bg-primary/10"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>

          {/* Localisation */}
          <div
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: "rgba(18,34,60,0.4)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <span className="material-symbols-outlined text-[#8A8178] text-xl">location_on</span>
            <div>
              <p className="text-[#F0EDE8] text-sm font-bold">{artiste.city}</p>
              <p className="text-[#8A8178] text-xs">{artiste.country}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}


/* ════════════════════════════════════════════════════
   VARIANTES DESKTOP DES SECTIONS (version desktop uniquement)
════════════════════════════════════════════════════ */

import type { Release, VideoItem, GalleryPhoto } from "@/types/artistes";
import Link from "next/link";

// ── LatestReleases desktop ──────────────────────────
function LatestReleasesDesktop({ releases }: { releases: Release[] }) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl font-bold text-white tracking-tight">
          Dernières Sorties
        </h3>
        <Link href="#" className="text-primary text-sm font-bold hover:text-[#F0EDE8] transition-colors flex items-center gap-1">
          Voir tout
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>

      {/* Grille 2 colonnes */}
      <div className="grid grid-cols-2 gap-4">
        {releases.map((release) => (
          <div
            key={release.id}
            className="group flex rounded-xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-300"
            style={{ background: "rgba(18,34,60,0.7)" }}
          >
            {/* Pochette */}
            <div
              className="w-28 shrink-0 bg-cover bg-center relative"
              style={{ backgroundImage: `url('${release.coverImage}')` }}
            >
              <div className="absolute inset-0 flex items-center justify-center bg-[#12223cd9]/20 group-hover:bg-[#12223cd9]/0 transition-all">
                <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  <span className="material-symbols-outlined text-white text-xl ml-0.5">play_arrow</span>
                </div>
              </div>
            </div>

            {/* Infos */}
            <div className="flex flex-col justify-center p-4 flex-1 min-w-0">
              <span className="text-primary text-[10px] font-bold tracking-wider mb-1">
                {release.year} · {release.type}
              </span>
              <h4 className="text-white font-bold text-base leading-tight truncate group-hover:text-primary transition-colors">
                {release.title}
              </h4>
              <p className="text-[#8A8178] text-sm truncate mt-0.5">
                {release.featuring ?? release.producer}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <button className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary transition-colors">
                  <span className="material-symbols-outlined text-sm">play_arrow</span>
                </button>
                <button className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
                <button className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors ml-auto">
                  <span className="material-symbols-outlined text-sm">more_horiz</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── KivuTV desktop ──────────────────────────────────
function KivuTVDesktop({ videos }: { videos: VideoItem[] }) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-xl">smart_display</span>
          <h3 className="font-display text-2xl font-bold text-white tracking-tight">Kivu TV</h3>
        </div>
        <Link href="#" className="text-primary text-sm font-bold hover:text-[#F0EDE8] transition-colors flex items-center gap-1">
          Voir tout
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>

      {/* Grille vidéos : première en vedette, reste en 3 colonnes */}
      {videos.length > 0 && (
        <div className="flex flex-col gap-4">
          {/* Featured */}
          <div
            className="group relative aspect-video rounded-2xl overflow-hidden cursor-pointer"
            style={{ background: "rgba(18,34,60,0.5)" }}
          >
            {videos[0].thumbnail && (
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${videos[0].thumbnail}')` }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-xl">
                <span className="material-symbols-outlined text-white text-4xl ml-1">play_arrow</span>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <span className="text-primary text-xs font-bold uppercase tracking-wider block mb-1">
                {videos[0].title ?? "Exclusif"} 
              </span>
              <h4 className="text-white font-bold text-xl leading-tight">{videos[0].title}</h4>
              {videos[0].duration && (
                <span className="text-[#8A8178] text-xs mt-1 block">{videos[0].duration}</span>
              )}
            </div>
          </div>

          {/* Reste en 3 colonnes */}
          {videos.length > 1 && (
            <div className="grid grid-cols-3 gap-4">
              {videos.slice(1).map((video) => (
                <div key={video.id} className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer">
                  {video.thumbnail && (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url('${video.thumbnail}')` }}
                    />
                  )}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white text-3xl drop-shadow-lg">play_circle</span>
                  </div>
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {video.duration}
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <h4 className="text-white text-xs font-bold leading-snug line-clamp-2">{video.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

// ── PhotoGallery desktop ────────────────────────────
function PhotoGalleryDesktop({ photos }: { photos: GalleryPhoto[] }) {
  return (
    <section className="flex flex-col gap-5">
      <h3 className="font-display text-2xl font-bold text-white tracking-tight">Galerie</h3>

      {/* Masonry 3 colonnes sur desktop */}
      <div className="columns-3 gap-4 space-y-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="break-inside-avoid relative rounded-xl overflow-hidden group cursor-pointer"
          >
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex justify-end gap-2">
                <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors">
                  <span className="material-symbols-outlined text-sm">zoom_in</span>
                </button>
                <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors">
                  <span className="material-symbols-outlined text-sm">share</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
