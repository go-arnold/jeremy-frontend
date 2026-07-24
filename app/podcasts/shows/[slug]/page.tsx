import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchPodcastShow, fetchPodcastShowEpisodes } from "@/lib/services/podcasts";
import PodcastShowPageClient from "./PodcastShowPageClient";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getShow(slug: string) {
  try {
    return await fetchPodcastShow(slug);
  } catch (error) {
    console.error(`Failed to fetch podcast show ${slug}:`, error);
    return null;
  }
}

async function getShowEpisodes(slug: string) {
  try {
    return await fetchPodcastShowEpisodes(slug, 1, 15);
  } catch (error) {
    console.error(`Failed to fetch episodes for podcast show ${slug}:`, error);
    return { results: [], hasMore: false };
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const show = await getShow(slug);
  if (!show) return { title: "Podcast introuvable | Art du Kivu" };

  const title = `${show.title} | Art du Kivu`;
  const description = show.description
    ? show.description.slice(0, 160)
    : `Écoutez ${show.title} sur Art du Kivu.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: show.coverImage ? [show.coverImage] : undefined,
    },
  };
}

export default async function PodcastShowPage({ params }: Props) {
  const { slug } = await params;

  const show = await getShow(slug);
  if (!show) notFound();

  const { results: episodes, hasMore } = await getShowEpisodes(slug);

  return <PodcastShowPageClient show={show} initialEpisodes={episodes} initialHasMore={hasMore} />;
}
