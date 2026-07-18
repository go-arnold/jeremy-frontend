import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { apiFetch } from '@/lib/api-client';

async function getTopArtists() {
  try {
    const res = await apiFetch<any>(
      `/api/v1/artists/?is_featured=true&page_size=50`,
      { next: { revalidate: 3600 } }
    );
    return res;
  } catch (err) {
    return { results: [], count: 0 };
  }
}

function ArtistCard({ artist }: any) {
  return (
    <Link href={`/artistes/${artist.slug}`}>
      <div className="group cursor-pointer text-center">
        <div className="relative mb-4 overflow-hidden rounded-full w-48 h-48 mx-auto">
          {artist.avatar_url && (
            <Image
              src={artist.avatar_url}
              alt={artist.name}
              fill
              sizes="192px"
              className="object-cover group-hover:scale-110 transition-transform"
            />
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-white opacity-0 group-hover:opacity-100">
              person
            </span>
          </div>
        </div>
        <h3 className="text-white font-bold text-lg">{artist.name}</h3>
        {artist.bio && <p className="text-white/60 text-sm line-clamp-2 mt-2">{artist.bio}</p>}
      </div>
    </Link>
  );
}

export const metadata = {
  title: 'Top Artistes - Art du Kivu',
};

export default async function TopArtistesPage() {
  const data = await getTopArtists();

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-black pt-32 pb-20">
      <div className="container mx-auto px-4">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-[#B8240C] mb-8">
          <span className="material-symbols-outlined">arrow_back</span>
          Retour
        </Link>
        <h1 className="text-5xl font-bold text-white mb-4">Top Artistes</h1>
        <p className="text-white/60 mb-12">Découvrez nos meilleurs artistes en mettant en avant.</p>

        {data.results?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {data.results.map((artist: any) => (
              <Suspense key={artist.id} fallback={<div className="bg-slate-800 rounded-full h-48 w-48 mx-auto animate-pulse" />}>
                <ArtistCard artist={artist} />
              </Suspense>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-white/60">Aucun artiste disponible</p>
          </div>
        )}
      </div>
    </main>
  );
}
