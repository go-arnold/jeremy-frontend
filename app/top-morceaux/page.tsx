import Link from "next/link";

import ContentImage from "@/components/ui/ContentImage";
import { fetchTopReleases } from "@/lib/services/rankings";
import type { TopReleaseItem } from "@/types/rankings";

function ReleaseCard({ release, index }: { release: TopReleaseItem; index: number }) {
  return (
    <Link href={release.href}>
      <div className="group cursor-pointer">
        <div className="flex items-start gap-4">
          <div className="text-3xl font-bold text-primary w-12 pt-2 text-right">
            #{index + 1}
          </div>
          <div className="flex-1">
            <div className="relative aspect-square overflow-hidden rounded-lg mb-3 bg-slate-900">
              <ContentImage
                src={release.image}
                alt={release.title}
                className="absolute inset-0"
                imageClassName="group-hover:scale-105 transition-transform"
                sizes="(max-width: 768px) 100vw, 640px"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-white opacity-0 group-hover:opacity-100">
                  play_circle
                </span>
              </div>
            </div>
            <h3 className="text-white font-bold line-clamp-2">{release.title}</h3>
            <p className="text-white/60 text-sm mt-1">{release.artists}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-white/50">
              <span>{release.listens.toLocaleString("fr-FR")} écoutes</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export const metadata = {
  title: 'Top Morceaux - Art du Kivu',
};

export default async function TopMorceauxPage() {
  let releases: TopReleaseItem[] = [];
  try {
    releases = await fetchTopReleases();
  } catch {
    releases = [];
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-black pt-32 pb-20">
      <div className="container mx-auto px-4">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-[#B8240C] mb-8">
          <span className="material-symbols-outlined">arrow_back</span>
          Retour
        </Link>
        <h1 className="text-5xl font-bold text-white mb-4">Top Morceaux</h1>
        <p className="text-white/60 mb-12">Les morceaux les plus écoutés sur Art du Kivu.</p>

        {releases.length > 0 ? (
          <div className="space-y-6 max-w-3xl">
            {releases.map((release, index) => (
              <ReleaseCard key={release.id} release={release} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-white/60">Aucun morceau disponible</p>
          </div>
        )}
      </div>
    </main>
  );
}
