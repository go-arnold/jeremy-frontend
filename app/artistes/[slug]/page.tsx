import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArtisteDetail as getMockedArtisteDetail } from "@/data/artistes";
import { fetchArtist } from "@/lib/services/artists";

import ArtisteDetailHero from "@/components/artistesComp/ArtisteDetailHero";
import LatestReleases from "@/components/artistesComp/LatestReleases";
import KivuTV from "@/components/artistesComp/KivuTV";
import PhotoGallery from "@/components/artistesComp/PhotoGallery";
import ArtisteDetailCTA from "@/components/artistesComp/ArtisteDetailCTA";
import EngagementBar from "@/components/ui/EngagementBar";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getArtiste(slug: string) {
  try {
    return await fetchArtist(slug);
  } catch (error) {
    console.error(`Failed to fetch artist ${slug}:`, error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let artiste = await getArtiste(slug);
  if (!artiste) artiste = getMockedArtisteDetail(slug);
  if (!artiste) return { title: "Artiste introuvable | Art du Kivu" };

  const title = `${artiste.name} | Art du Kivu`;
  const description = artiste.bio
    ? artiste.bio.slice(0, 160)
    : `Découvrez ${artiste.name} sur Art du Kivu, plateforme culturelle et sonore du Kivu.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: artiste.coverImage ? [artiste.coverImage] : undefined,
    },
  };
}

export default async function ArtisteDetailPage({ params }: Props) {
  const { slug } = await params;

  // Try API first
  let artiste = await getArtiste(slug);

  // Fallback to mocked data if API fails or artist not found in API
  if (!artiste) {
    artiste = getMockedArtisteDetail(slug);
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
        <LatestReleases releases={artiste.releases} variant="mobile" />
        <KivuTV videos={artiste.videos} variant="mobile" />
        <PhotoGallery photos={artiste.gallery} variant="mobile" />

        <div className="px-5 pt-2">
          <EngagementBar
            resourceType="artists"
            id={artiste.id}
            initialLikeCount={artiste.likeCount}
            initialCommentCount={artiste.commentCount}
            enableSave={false}
            redirectTo={`/artistes/${artiste.id}`}
          />
        </div>
      </div>

      {/* ══════════════════════════════════════
          DESKTOP — 2 colonnes
      ══════════════════════════════════════ */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_300px] lg:gap-8 lg:max-w-[1800px] lg:mx-auto lg:px-8 lg:mt-10 relative z-10">

        {/* ── Colonne principale ── */}
        <div className="flex flex-col gap-10">
          <LatestReleases releases={artiste.releases} variant="desktop" />
          <KivuTV videos={artiste.videos} variant="desktop" />
          <PhotoGallery photos={artiste.gallery} variant="desktop" />
        </div>

        {/* ── Sidebar sticky ── */}
        <aside className="sticky top-24 self-start flex flex-col gap-5">

          {/* CTA favoris */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "rgba(18,34,60,0.7)", border: "1px solid rgba(230,48,18,0.15)" }}
          >
            <ArtisteDetailCTA artistId={artiste.artistId} artistSlug={artiste.id} />
          </div>

          {/* Engagement — aimer / commenter / partager */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "rgba(18,34,60,0.5)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <EngagementBar
              resourceType="artists"
              id={artiste.id}
              initialLikeCount={artiste.likeCount}
              initialCommentCount={artiste.commentCount}
              enableSave={false}
              redirectTo={`/artistes/${artiste.id}`}
            />
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
