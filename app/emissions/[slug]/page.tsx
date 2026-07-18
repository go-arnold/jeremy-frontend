import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { fetchEmission } from "@/lib/services/emissions";
import LiveStreamPlayer from "@/components/media/LiveStreamPlayer";
import VideoPlayer from "@/components/media/VideoPlayer";
import EngagementBar from "@/components/ui/EngagementBar";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

function formatScheduledAt(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let emission;
  try {
    emission = await fetchEmission(slug);
  } catch (error) {
    console.error(`Failed to fetch emission ${slug}:`, error);
  }
  if (!emission) return { title: "Émission introuvable | Art du Kivu" };

  const title = `${emission.title} | Art du Kivu`;
  const description = emission.description
    ? emission.description.slice(0, 160)
    : `Regardez ${emission.title} sur Art du Kivu.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: emission.coverImage ? [emission.coverImage] : undefined,
    },
  };
}

export default async function EmissionDetailPage({ params }: Props) {
  const { slug } = await params;

  let emission;
  try {
    emission = await fetchEmission(slug);
  } catch (error) {
    console.error(`Failed to fetch emission ${slug}:`, error);
  }

  if (!emission) notFound();

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-5xl mx-auto px-4 lg:px-8 pt-8">
        <Link
          href="/emissions"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors font-bold text-sm mb-6"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Émissions
        </Link>

        {emission.status === "scheduled" ? (
          <div
            className="relative w-full aspect-video rounded-2xl overflow-hidden flex items-end"
            style={{ background: "rgba(18,34,60,0.6)" }}
          >
            {emission.coverImage && (
              <Image
                alt={emission.title}
                src={emission.coverImage}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover opacity-40"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="relative p-6 flex flex-col gap-2">
              <span className="inline-flex items-center gap-1.5 text-yellow-400 text-xs font-black uppercase tracking-widest">
                <span className="material-symbols-outlined text-sm">schedule</span>
                Programmé
              </span>
              <p className="text-white text-lg font-bold">{formatScheduledAt(emission.scheduledAt)}</p>
            </div>
          </div>
        ) : emission.status === "live" ? (
          <LiveStreamPlayer
            hlsUrl={emission.hlsUrl || undefined}
            title={emission.title}
            status="live"
            viewerCount={emission.viewerCount}
            thumbnail={emission.coverImage}
            autoplay
            hideTitleBar
          />
        ) : (
          <VideoPlayer
            src={emission.streamUrl}
            title={emission.title}
            thumbnail={emission.coverImage}
            hideTitleBar
          />
        )}

        <div className="mt-6 flex flex-col gap-3">
          <h1 className="text-3xl font-black text-[#F0EDE8] leading-tight">{emission.title}</h1>
          {emission.hostNames.length > 0 && (
            <p className="text-[#8A8178] text-base">{emission.hostNames.join(", ")}</p>
          )}
          {emission.description && (
            <p className="text-[#F0EDE8]/80 text-base leading-relaxed line-clamp-3 lg:line-clamp-none">
              {emission.description}
            </p>
          )}
          <div className="flex items-center gap-4 text-[#8A8178] text-sm">
            {emission.durationMinutes > 0 && (
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">schedule</span>
                {emission.durationMinutes} min
              </span>
            )}
            {emission.totalViews > 0 && (
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">visibility</span>
                {emission.totalViews} vues
              </span>
            )}
          </div>

          <div className="pt-4 mt-2 border-t border-white/5">
            <EngagementBar
              resourceType="emissions"
              id={emission.slug}
              initialLikeCount={emission.likeCount}
              initialCommentCount={emission.commentCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
