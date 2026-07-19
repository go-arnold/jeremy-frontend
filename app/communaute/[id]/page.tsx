import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api-client";
import { mapApiPostToCommunityItem } from "@/lib/mappers";
import type { ApiCommunityPost } from "@/lib/api-types";
import TalentPostCard from "@/components/communaute/TalentPostCard";
import ArtPostCard from "@/components/communaute/ArtPostCard";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

async function getPost(id: string) {
  try {
    const apiPost = await apiFetch<ApiCommunityPost>(`/api/v1/community/posts/${id}/`);
    return mapApiPostToCommunityItem(apiPost);
  } catch (error) {
    console.error(`Failed to fetch community post ${id}:`, error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const item = await getPost(id);
  if (!item) return { title: "Publication introuvable | Art du Kivu" };

  const title = `${item.data.title || item.data.artist.username} | Art du Kivu Communauté`;
  const description = item.data.caption || item.data.content || "Découvrez cette publication sur Art du Kivu.";

  return {
    title,
    description: description.slice(0, 160),
    openGraph: { title, description: description.slice(0, 160) },
  };
}

// Every "Partager" button in the Communauté feed links here (docs/COMMUNAUTE_BACKEND_REQUIREMENTS.md
// isn't involved — GET /community/posts/{id}/ already exists) so each post gets its own shareable
// URL instead of every share pointing back at the generic /communaute feed.
export default async function CommunautePostPage({ params }: Props) {
  const { id } = await params;
  const item = await getPost(id);
  if (!item) notFound();

  const data = { ...item.data, isChallengeResponse: item.type === "challenge_response" };

  return (
    <div className="min-h-screen px-4 pt-20 pb-16 lg:pt-28 max-w-2xl mx-auto">
      <Link
        href="/communaute"
        className="inline-flex items-center gap-1.5 text-[#8A8178] hover:text-white text-sm font-bold mb-6"
      >
        <span className="material-symbols-outlined text-lg">arrow_back</span>
        Communauté
      </Link>

      {item.type === "art" ? <ArtPostCard post={item.data} /> : <TalentPostCard post={data} />}
    </div>
  );
}
