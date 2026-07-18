import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPodcastEpisode as getMockedEpisode } from "@/data/podcasts";
import Link from "next/link";
import { apiFetch } from "@/lib/api-client";
import { mapApiEpisodeToPodcastEpisode } from "@/lib/mappers";
import EmptyState from "@/components/ui/EmptyState";

import EpisodeHero     from "@/components/podcasts/EpisodeHero";
import EpisodePlayer   from "@/components/podcasts/EpisodePlayer";
import EpisodeTabs     from "@/components/podcasts/EpisodeTabs";
import RelatedEpisodes from "@/components/podcasts/RelatedEpisodes";
import GuestFollowButton from "@/components/podcasts/GuestFollowButton";
import EngagementBar from "@/components/ui/EngagementBar";
import SharePodcastWidget from "@/components/podcasts/SharePodcastWidget";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getEpisode(slug: string) {
  try {
    const data = await apiFetch<any>(`/api/v1/podcasts/episodes/${slug}/`);
    return mapApiEpisodeToPodcastEpisode(data);
  } catch (error) {
    console.error(`Failed to fetch podcast episode ${slug}:`, error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let episode = await getEpisode(slug);
  if (!episode) episode = getMockedEpisode(slug) as any;
  if (!episode) return { title: "Épisode introuvable | Art du Kivu" };

  const title = `${episode.title} | Art du Kivu`;
  const description = episode.description
    ? episode.description.slice(0, 160)
    : `Écoutez ${episode.title} sur Art du Kivu.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: episode.coverImage ? [episode.coverImage] : undefined,
    },
  };
}

export default async function PodcastEpisodePage({ params }: Props) {
  const { slug } = await params;
  
  // Try API first
  let episode = await getEpisode(slug);
  
  // Fallback to mocked data
  if (!episode) {
    episode = getMockedEpisode(slug) as any;
  }
  
  if (!episode) notFound();

  // If no audio URL came with the data, show EmptyState directly as requested
  if (!episode.audioUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <EmptyState
          message="Épisode non disponible"
          description="Cet épisode n'a pas de fichier audio ou de lien de lecture valide."
          icon="mic_off"
        />
      </div>
    );
  }

  return (
    <div className="text-text-main font-display antialiased selection:bg-primary selection:text-white">

      {/* ══════════════════════════════════════
          MOBILE — layout original inchangé
      ══════════════════════════════════════ */}
      <div className="lg:hidden pb-4">
        <EpisodeHero episode={episode} />
        <div className="relative z-10 px-5 -mt-2">
          <EpisodePlayer episode={episode} />
          <div className="my-4 pb-4 border-b border-white/5">
            <EngagementBar
              resourceType="podcasts/episodes"
              id={episode.slug}
              initialLikeCount={episode.likeCount}
              initialCommentCount={episode.commentCount}
            />
          </div>
          <EpisodeTabs episode={episode} />
          <RelatedEpisodes episodes={episode.relatedEpisodes} />
        </div>
      </div>

      {/* ══════════════════════════════════════
          DESKTOP — layout above-the-fold
          3 colonnes : Cover | Player+Tabs | Sidebar
      ══════════════════════════════════════ */}
      <div className="hidden lg:flex flex-col w-full">
        <div className="max-w-7xl mx-auto px-8 w-full py-8 pb-16">

          {/* Bouton retour */}
          <div className="mb-6">
            <Link
              href="/podcasts"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors font-bold text-sm"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Podcasts
            </Link>
          </div>

          {/* ── 3 colonnes above-the-fold ── */}
          <div className="grid grid-cols-[360px_1fr_300px] gap-8 items-start">

            {/* Col 1 : Cover + méta */}
            <EpisodeCoverPanel episode={episode} />

            {/* Col 2 : Player + Tabs */}
            <div className="flex flex-col gap-6">
              <EpisodePlayerDesktop episode={episode} />
              <EpisodeTabs episode={episode} />
            </div>

            {/* Col 3 : Sidebar sticky */}
            <aside className="sticky top-24 flex flex-col gap-5">
              <GuestCardDesktop episode={episode} />
              <SharePodcastWidget title={episode.title} slug={episode.slug} />
            </aside>
          </div>

          {/* ── Related pleine largeur ── */}
          <div className="mt-12">
            <RelatedEpisodesDesktop episodes={episode.relatedEpisodes} />
          </div>
        </div>
      </div>
    </div>
  );
}


/* ════════════════════════════════════════════════════
   VARIANTES DESKTOP (uniquement)
════════════════════════════════════════════════════ */

import type { PodcastEpisode, RelatedEpisode } from "@/types/podcasts";


// ── Cover panel (col 1 desktop) ────────────────────
function EpisodeCoverPanel({ episode }: { episode: PodcastEpisode }) {
  return (
    <div className="flex flex-col sticky top-24">

      {/* Cover 4/3 paysage — titre + badge intégrés en overlay */}
      <div className="relative w-full rounded-t-2xl overflow-hidden" style={{ aspectRatio: "4/3" }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${episode.coverImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {/* Badge + numéro en haut à gauche */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          {episode.badge && (
            <span className="px-2 py-0.5 border border-primary text-primary text-[10px] font-black tracking-widest uppercase rounded bg-black/40 backdrop-blur-sm">
              {episode.badge}
            </span>
          )}
          <span className="text-white/70 text-xs font-medium bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded">
            ÉP {episode.episodeNumber} · {episode.publishedAt}
          </span>
        </div>

        {/* Titre + subtitle + tags en bas */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2">
          <h1 className="text-xl font-black leading-tight text-white tracking-tight">
            {episode.title}
            {episode.subtitle && (
              <span className="block text-white/60 italic font-semibold text-base mt-0.5">
                {episode.subtitle}
              </span>
            )}
          </h1>
          <div className="flex flex-wrap gap-1.5">
            {episode.tags.map((tag) => (
              <div
                key={tag}
                className="flex h-6 items-center rounded-lg bg-white/15 backdrop-blur-sm px-2.5 border border-white/10"
              >
                <span className="text-white text-[11px] font-medium">{tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panneau infos attaché sous la cover — même style que live-music */}
      <div
        className="rounded-b-2xl px-5 py-4 flex flex-col gap-3"
        style={{ background: "rgba(18,34,60,0.85)", border: "1px solid rgba(255,255,255,0.06)", borderTop: "none" }}
      >
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: "schedule",   value: episode.duration,      label: "Durée" },
            { icon: "headphones", value: episode.publishedAt,   label: "Publié" },
          ].map(({ icon, value, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">{icon}</span>
              <div>
                <p className="text-[#F0EDE8] text-xs font-bold">{value}</p>
                <p className="text-[#8A8178] text-[10px]">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── EpisodePlayer desktop ───────────────────────────

function EpisodePlayerDesktop({ episode }: { episode: PodcastEpisode }) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: "rgba(18,34,60,0.6)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Titre mini en haut du player */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-12 h-12 rounded-xl bg-cover bg-center shrink-0"
          style={{ backgroundImage: `url('${episode.coverImage}')` }}
        />
        <div>
          <p className="text-[#F0EDE8] font-bold text-sm line-clamp-1">{episode.title}</p>
          <p className="text-[#8A8178] text-xs">{episode.duration} • ÉP {episode.episodeNumber}</p>
        </div>
      </div>

      {/* Player réel avec waveform fonctionnel */}
      <EpisodePlayer episode={episode} />

      <div className="mt-4 pt-4 border-t border-white/5">
        <EngagementBar
          resourceType="podcasts/episodes"
          id={episode.slug}
          initialLikeCount={episode.likeCount}
          initialCommentCount={episode.commentCount}
        />
      </div>
    </div>
  );
}


// ── Guest card sidebar ──────────────────────────────
function GuestCardDesktop({ episode }: { episode: PodcastEpisode }) {
  if (!episode.guest) return null;

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "rgba(18,34,60,0.5)", border: "1px solid rgba(255,255,255,0.05)" }}
    >
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8A8178] mb-4">
        Invité
      </p>
      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-full bg-cover bg-center shrink-0 border-2 border-primary/20"
          style={{ backgroundImage: `url('${episode.guest.avatar}')` }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[#F0EDE8] font-bold text-sm">{episode.guest.name}</p>
              <p className="text-primary text-[10px] font-bold uppercase tracking-wider mt-0.5">
                {episode.guest.title}
              </p>
            </div>
            <GuestFollowButton guestName={episode.guest.name} />
          </div>
          <p className="text-[#8A8178] text-xs mt-2 leading-relaxed line-clamp-3">
            {episode.guest.bio}
          </p>
        </div>
      </div>
      {(episode.guest.website || episode.guest.twitter) && (
        <div className="flex gap-4 mt-4 pt-4 border-t border-white/5">
          {episode.guest.website && (
            <a
              href={episode.guest.website}
              className="flex items-center gap-1.5 text-[#8A8178] hover:text-[#F0EDE8] text-xs transition"
            >
              <span className="material-symbols-outlined text-sm">language</span>
              Site Web
            </a>
          )}
          {episode.guest.twitter && (
            <a href="#" className="flex items-center gap-1.5 text-[#8A8178] hover:text-[#F0EDE8] text-xs transition">
              <span className="material-symbols-outlined text-sm">alternate_email</span>
              {episode.guest.twitter}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ── Related episodes desktop — grille 4 colonnes ────
function RelatedEpisodesDesktop({ episodes }: { episodes?: RelatedEpisode[] }) {
  if (!episodes?.length) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-2xl font-black text-[#F0EDE8]">Plus sur la Culture Kivu</h3>
        <span className="material-symbols-outlined text-primary text-xl">arrow_forward</span>
      </div>
      <div className="grid grid-cols-4 gap-5">
        {episodes.map((ep) => (
          <Link
            key={ep.id}
            href={`/podcasts/${ep.slug}`}
            className="group flex flex-col rounded-xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-300"
            style={{ background: "rgba(18,34,60,0.4)" }}
          >
            {/* Vignette */}
            <div className="relative aspect-square overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url('${ep.image}')` }}
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
              {/* Durée */}
              <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                {ep.duration}
              </span>
              {/* Play hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-white text-2xl ml-0.5">play_arrow</span>
                </div>
              </div>
            </div>
            {/* Infos */}
            <div className="p-3 flex flex-col gap-1">
              <p className="text-[#8A8178] text-[10px]">Épisode {ep.episodeNumber}</p>
              <h4 className="text-[#F0EDE8] text-sm font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                {ep.title}
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
