import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { apiFetch } from "@/lib/api-client";
import { mapApiReleaseToFeaturedRelease } from "@/lib/mappers";
import EngagementBar from "@/components/ui/EngagementBar";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getRelease(slug: string) {
  try {
    const data = await apiFetch<any>(`/api/v1/releases/${slug}/`);
    return mapApiReleaseToFeaturedRelease(data);
  } catch (error) {
    console.error(`Failed to fetch release ${slug}:`, error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const release = await getRelease(slug);
  if (!release) return { title: "Sortie introuvable | Art du Kivu" };

  const title = `${release.title} | Art du Kivu`;
  const description = release.description
    ? release.description.slice(0, 160)
    : `Découvrez ${release.title}${release.artistName ? ` par ${release.artistName}` : ""} sur Art du Kivu.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: release.coverImage ? [release.coverImage] : undefined,
    },
  };
}

export default async function ReleaseDetailPage({ params }: Props) {
  const { slug } = await params;
  const release = await getRelease(slug);

  if (!release) notFound();

  const streamingEntries = Object.entries(release.streamingLinks || {});

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-4xl mx-auto px-4 lg:px-8 pt-8">
        <Link
          href="/sorties-premieres"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors font-bold text-sm mb-6"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Sorties &amp; Premières
        </Link>

        <div className="grid lg:grid-cols-[360px_1fr] gap-8 items-start">
          {/* Cover */}
          <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: "1/1" }}>
            {release.coverImage && (
              <Image
                alt={release.title}
                src={release.coverImage}
                fill
                sizes="(max-width: 1024px) 100vw, 360px"
                className="object-cover"
              />
            )}
            {release.isPremiere && (
              <div className="absolute top-4 left-4">
                <div className="bg-primary px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                  </span>
                  <span className="text-[10px] font-black uppercase text-white tracking-widest">
                    Première
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-primary font-bold text-sm uppercase tracking-widest mb-1">
                {release.format}
              </p>
              <h1 className="text-3xl lg:text-4xl font-black text-[#F0EDE8] leading-tight">
                {release.title}
              </h1>
              {release.artistName && (
                <p className="text-[#8A8178] text-lg font-medium mt-1">{release.artistName}</p>
              )}
              <div className="flex items-center gap-2 text-[#8A8178] text-sm mt-2">
                <span className="material-symbols-outlined text-sm">calendar_today</span>
                <span>Sortie le {release.releaseDate}</span>
              </div>
            </div>

            {release.description && (
              <p className="text-[#F0EDE8]/80 text-base leading-relaxed">{release.description}</p>
            )}

            {streamingEntries.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {streamingEntries.map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[#F0EDE8] hover:bg-white/10 transition-colors font-bold text-sm capitalize"
                  >
                    <span className="material-symbols-outlined text-lg text-primary">music_note</span>
                    {platform}
                  </a>
                ))}
              </div>
            )}

            {release.previewUrl && (
              <video
                src={release.previewUrl}
                controls
                className="w-full rounded-xl mt-2 bg-black"
                preload="metadata"
              />
            )}

            <div className="pt-4 border-t border-white/5">
              <EngagementBar
                resourceType="releases"
                id={release.slug || release.id || ""}
                initialLikeCount={release.likeCount}
                initialCommentCount={release.commentCount}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
