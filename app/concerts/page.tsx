import { Suspense } from 'react';
import Link from 'next/link';

import { apiFetch, PaginatedResponse } from '@/lib/api-client';
import { mapApiVideoToWebTVVideo } from '@/lib/mappers';
import ContentImage from '@/components/ui/ContentImage';
import type { ApiVideo } from '@/lib/api-types';

type WebTVVideo = ReturnType<typeof mapApiVideoToWebTVVideo>;

async function getConcerts() {
  try {
    const res = await apiFetch<PaginatedResponse<ApiVideo>>(
      `/api/v1/webtv/videos/?category=concerts&page_size=50`,
      { next: { revalidate: 3600 } }
    );
    return { ...res, results: res.results.map(mapApiVideoToWebTVVideo) };
  } catch {
    return { results: [] as WebTVVideo[], count: 0 };
  }
}

function ConcertCard({ video }: { video: WebTVVideo }) {
  return (
    <Link href={`/web-tv/${video.slug}`}>
      <div className="group cursor-pointer overflow-hidden rounded-xl">
        <div className="relative aspect-video bg-slate-900">
          <ContentImage
            src={video.thumbnail}
            alt={video.title}
            className="absolute inset-0"
            imageClassName="group-hover:scale-105 transition-transform"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {/* Play — toujours visible (icône obligatoire sur chaque vidéo) */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-white drop-shadow-lg">
              play_circle
            </span>
          </div>
        </div>
        <div className="p-4 bg-slate-900">
          <h3 className="text-white font-semibold line-clamp-2">{video.title}</h3>
        </div>
      </div>
    </Link>
  );
}

export const metadata = {
  title: 'Concerts - Art du Kivu',
};

export default async function ConcertsPage() {
  const data = await getConcerts();

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-black pt-32 pb-20">
      <div className="container mx-auto px-4">
        <Link href="/web-tv" className="flex items-center gap-2 text-primary hover:text-[#B8240C] mb-8">
          <span className="material-symbols-outlined">arrow_back</span>
          Retour
        </Link>
        <h1 className="text-5xl font-bold text-white mb-4">Concerts</h1>
        <p className="text-white/60 mb-12">Revivez les meilleurs concerts filmés du Kivu.</p>

        {data.results?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.results.map((video) => (
              <Suspense key={video.id} fallback={<div className="bg-slate-800 rounded-xl h-48 animate-pulse" />}>
                <ConcertCard video={video} />
              </Suspense>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-white/60">Aucun concert disponible</p>
          </div>
        )}
      </div>
    </main>
  );
}
