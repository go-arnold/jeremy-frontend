import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { apiFetch } from "@/lib/api-client";
import { mapApiVideoToWebTVVideo } from "@/lib/mappers";
import WebTVVideoDetail from "@/components/webTv/WebTVVideoDetail";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getVideo(slug: string) {
  try {
    const data = await apiFetch<any>(`/api/v1/webtv/videos/${slug}/`);
    return mapApiVideoToWebTVVideo(data);
  } catch (error) {
    console.error(`Failed to fetch WebTV video ${slug}:`, error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const video = await getVideo(slug);
  if (!video) return { title: "Vidéo introuvable | Art du Kivu" };

  const title = `${video.title} | Art du Kivu`;
  const description = video.description
    ? video.description.slice(0, 160)
    : `Regardez ${video.title} sur Art du Kivu Web TV.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: video.thumbnail ? [video.thumbnail] : undefined,
    },
  };
}

export default async function WebTVVideoPage({ params }: Props) {
  const { slug } = await params;
  const video = await getVideo(slug);

  if (!video) notFound();

  return <WebTVVideoDetail video={video} />;
}
