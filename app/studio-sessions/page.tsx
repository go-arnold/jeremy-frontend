import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { apiFetch, PaginatedResponse } from '@/lib/api-client';
import type { ApiVideo } from '@/lib/api-types';

async function getStudioSessions() {
  try {
    const res = await apiFetch<PaginatedResponse<ApiVideo>>(
      `/api/v1/webtv/videos/?category=studio_sessions&page_size=50`,
      { next: { revalidate: 3600 } }
    );
    return res;
  } catch {
    return { results: [] as ApiVideo[], count: 0 };
  }
}

function SessionCard({ video }: { video: ApiVideo }) {
  return (
    <Link href={`/web-tv/${video.slug}`}>
      <div className="group cursor-pointer overflow-hidden rounded-xl">
        <div className="relative aspect-video bg-slate-900">
          {video.thumbnail_url && (
            <Image
              src={video.thumbnail_url}
              alt={video.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform"
            />
          )}
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
  title: 'Studio Sessions - Art du Kivu',
};

export default async function StudioSessionsPage() {
  const data = await getStudioSessions();

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-black pt-32 pb-20">
      <div className="container mx-auto px-4">
        <Link href="/web-tv" className="flex items-center gap-2 text-primary hover:text-[#B8240C] mb-8">
          <span className="material-symbols-outlined">arrow_back</span>
          Retour
        </Link>
        <h1 className="text-5xl font-bold text-white mb-4">Studio Sessions</h1>
        <p className="text-white/60 mb-12">Découvrez les meilleures sessions d&apos;enregistrement en studio.</p>

        {data.results?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.results.map((video) => (
              <Suspense key={video.id} fallback={<div className="bg-slate-800 rounded-xl h-48 animate-pulse" />}>
                <SessionCard video={video} />
              </Suspense>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-white/60">Aucune session disponible</p>
          </div>
        )}
      </div>
    </main>
  );
}
