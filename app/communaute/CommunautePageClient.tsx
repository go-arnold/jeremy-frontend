"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { feedItems as mockedFeed } from "@/data/communaute";
import SubmitTalentCard from "@/components/communaute/SubmitTalentCard";
import FilterTabs, { type FilterTab } from "@/components/communaute/FilterTabs";
import TalentPostCard   from "@/components/communaute/TalentPostCard";
import ChallengeCard    from "@/components/communaute/ChallengeCard";
import PollCard         from "@/components/communaute/PollCard";
import ArtPostCard      from "@/components/communaute/ArtPostCard";
import AuthPromptModal  from "@/components/ui/AuthPromptModal";
import { useAuth } from "@/providers/AuthProvider";
import { apiFetch, PaginatedResponse } from "@/lib/api-client";
import { mapApiPostToCommunityItem } from "@/lib/mappers";
import { fetchChallenges } from "@/lib/services/community";
import type { ApiChallenge, ApiPoll, ApiCommunityPost } from "@/lib/api-types";
import EmptyState from "@/components/ui/EmptyState";
import VoirPlusPagination from "@/components/ui/VoirPlusPagination";
import CircularProgress from "@/components/ui/CircularProgress";
import { useMediaSubmission, humanSize, MEDIA_LIMITS, type MediaCategory } from "@/hooks/useMediaSubmission";

type MappedPost = ReturnType<typeof mapApiPostToCommunityItem>;

// Mobile keeps 4 tabs; desktop drops "Sondages" since polls always live in their own fixed
// sidebar slot there, regardless of the active filter.
const MOBILE_FILTER_TABS: FilterTab[] = [
  { id: "tous", label: "Tous" },
  { id: "talent", label: "Talents" },
  { id: "challenge", label: "Défis" },
  { id: "poll", label: "Sondages" },
];

const DESKTOP_FILTER_TABS: FilterTab[] = [
  { id: "tous", label: "Tous" },
  { id: "talent", label: "Talents" },
  { id: "challenge", label: "Défis" },
];

// "challenge" maps to the challenge_response post_type (participations), never the literal
// string "challenge" — that value doesn't exist in the backend's PostTypeEnum. See
// docs/COMMUNAUTE_BACKEND_REQUIREMENTS.md §3.2.
function buildEndpoint(filter: string, page: number): string {
  const params = new URLSearchParams({ page: String(page), page_size: "15" });
  if (filter === "talent") params.set("post_type", "talent");
  else if (filter === "challenge") params.set("post_type", "challenge_response");
  return `/api/v1/community/posts/?${params.toString()}`;
}

// Defensive client-side re-filter: `challenge_response` isn't a real value in the backend's
// PostTypeEnum yet (docs/COMMUNAUTE_BACKEND_REQUIREMENTS.md §3.2), so `?post_type=challenge_response`
// is silently ignored server-side and the endpoint returns the *unfiltered* feed instead of an
// empty result — which was masking the "no participations yet" empty state behind unrelated
// talent/art posts. Re-filtering here guarantees correctness today and costs nothing once the
// backend enforces the param for real (the results will already match).
function keepMatchingType(items: MappedPost[], filter: string): MappedPost[] {
  if (filter === "talent") return items.filter((item) => item.type === "talent");
  if (filter === "challenge") return items.filter((item) => item.type === "challenge_response");
  return items;
}

/** Pinned challenge results (docs/COMMUNAUTE_BACKEND_REQUIREMENTS.md §3.5) always render first. */
function sortPinnedFirst(items: MappedPost[]): MappedPost[] {
  return [...items].sort((a, b) => Number(!!b.data.isPinnedResult) - Number(!!a.data.isPinnedResult));
}

// Client-side trending: counts #hashtag-shaped tokens across the posts already fetched — no
// backend support needed, per docs/COMMUNAUTE_BACKEND_REQUIREMENTS.md §4.
function computeTrending(items: MappedPost[]): { label: string; count: number }[] {
  const counts = new Map<string, { label: string; count: number }>();
  for (const item of items) {
    const text = `${item.data.content || ""} ${item.data.caption || ""}`;
    const matches = text.match(/#\w+/g) || [];
    for (const raw of matches) {
      const key = raw.toLowerCase();
      const entry = counts.get(key);
      if (entry) entry.count += 1;
      else counts.set(key, { label: raw, count: 1 });
    }
  }
  return Array.from(counts.values()).sort((a, b) => b.count - a.count).slice(0, 6);
}

interface CommunautePageClientProps {
  initialPosts: MappedPost[];
  initialHasMore: boolean;
  initialChallenges: ApiChallenge[];
  initialPolls: ApiPoll[];
  initialTalentCount: number;
}

export default function CommunautePageClient({
  initialPosts,
  initialHasMore,
  initialChallenges,
  initialPolls,
  initialTalentCount,
}: CommunautePageClientProps) {
  const [posts, setPosts] = useState<MappedPost[]>(initialPosts);
  const [challenges, setChallenges] = useState<ApiChallenge[]>(initialChallenges);
  const [polls] = useState<ApiPoll[]>(initialPolls);
  // Scoped to the feed only — sidebars (submit card, stats, défis, sondages) never re-render or
  // refetch on a filter change, on either breakpoint.
  const [postsLoading, setPostsLoading] = useState(false);
  const [loadingMore, setLoadingLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("tous");

  const fetchPosts = async (filter: string, pg: number, append = false) => {
    if (filter === "poll") {
      setPosts([]);
      setHasMore(false);
      return;
    }
    const endpoint = buildEndpoint(filter, pg);
    try {
      const data = await apiFetch<PaginatedResponse<ApiCommunityPost>>(endpoint);
      const mapped = keepMatchingType(data.results.map(mapApiPostToCommunityItem), filter);
      setPosts((prev) => (append ? [...prev, ...mapped] : mapped));
      setHasMore(!!data.next);
      setPage(pg);
    } catch (error) {
      console.error("Failed to fetch community feed:", error);
      if (!append) setPosts(filter === "tous" ? (mockedFeed as unknown as MappedPost[]) : []);
    }
  };

  const handleFilterChange = async (filter: string) => {
    if (filter === activeFilter) return;
    setActiveFilter(filter);
    if (filter === "poll") return; // no posts fetch — Sondages shows only polls
    setPostsLoading(true);
    await fetchPosts(filter, 1, false);
    setPostsLoading(false);
  };

  const loadMore = async (nextPage?: number) => {
    const pg = nextPage || page + 1;
    if (loadingMore || !hasMore) return;
    setLoadingLoadingMore(true);
    await fetchPosts(activeFilter, pg, true);
    setLoadingLoadingMore(false);
  };

  const refreshChallenges = async () => {
    try {
      const data = await fetchChallenges();
      if (data.results.length > 0) setChallenges(data.results);
    } catch {
      // Keep whatever challenges were already showing — a failed refresh isn't worth an error UI.
    }
  };

  const handleParticipated = () => {
    refreshChallenges();
    if (activeFilter === "challenge") fetchPosts("challenge", 1, false);
  };

  // Pinned admin results bubble to the top wherever they appear, not just under the Défis filter.
  const displayedPosts = useMemo(() => sortPinnedFirst(posts), [posts]);
  const trendingTags = useMemo(() => computeTrending(posts), [posts]);
  const activeChallenges = challenges.filter((c) => c.is_active);

  const showEmptyState = !postsLoading && activeFilter !== "poll" && displayedPosts.length === 0;

  const renderPost = (item: MappedPost) => {
    const data = { ...item.data, isChallengeResponse: item.type === "challenge_response" };
    return (
      <>
        {item.type === "talent" && <TalentPostCard post={data} />}
        {item.type === "art" && <ArtPostCard post={item.data} />}
        {item.type === "news" && <TalentPostCard post={data} />}
        {item.type === "challenge_response" && <TalentPostCard post={data} />}
      </>
    );
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">

      {/* MOBILE */}
      <main className="lg:hidden flex-1 overflow-y-auto pb-24 no-scrollbar kivu-texture">
        <div className="px-4 pt-6 pb-1">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-1">Art du Kivu</p>
          <h2 className="text-xl font-black leading-tight text-[#F0EDE8]">
            La <span className="text-primary">Communauté</span>
          </h2>
          <p className="text-xs text-[#8A8178] mt-1">Talents, défis et créations du Kivu</p>
        </div>
        <SubmitTalentCard onSubmitted={() => fetchPosts(activeFilter, 1, false)} />
        <div className="flex flex-col gap-6 px-4">
          <FilterTabs tabs={MOBILE_FILTER_TABS} active={activeFilter} onChange={handleFilterChange} />

          {activeFilter === "poll" ? (
            polls.length === 0 ? (
              <EmptyState message="Aucun sondage" description="Revenez plus tard pour voter." icon="bar_chart" />
            ) : (
              polls.map((poll) => <PollCard key={poll.id} poll={poll} />)
            )
          ) : (
            <>
              {/* "Tous" shows défis + sondages alongside the mixed feed below; "Défis" shows
               * only défis (+ their participations, in the feed below); "Talents" skips this
               * block entirely. */}
              {activeFilter === "challenge" && (
                <div className="flex flex-col gap-4">
                  {activeChallenges.length === 0 ? (
                    <EmptyState message="Aucun défi actif" description="Revenez bientôt pour un nouveau défi." icon="emoji_events" />
                  ) : (
                    activeChallenges.map((challenge) => (
                      <ChallengeCard key={challenge.id} challenge={challenge} onParticipated={handleParticipated} />
                    ))
                  )}
                </div>
              )}

              {activeFilter === "tous" && activeChallenges.length > 0 && (
                <div className="flex flex-col gap-4">
                  {activeChallenges.map((challenge) => (
                    <ChallengeCard key={challenge.id} challenge={challenge} onParticipated={handleParticipated} />
                  ))}
                </div>
              )}

              {activeFilter === "tous" && polls.length > 0 && (
                <div className="flex flex-col gap-4">
                  {polls.map((poll) => (
                    <PollCard key={poll.id} poll={poll} />
                  ))}
                </div>
              )}

              {postsLoading ? (
                <div className="flex justify-center py-10">
                  <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              ) : showEmptyState ? (
                <EmptyState
                  message={activeFilter === "challenge" ? "Aucune participation aux défis" : "Communauté tranquille"}
                  description={
                    activeFilter === "challenge"
                      ? "Soyez le premier à participer à un défi !"
                      : "Soyez le premier à partager votre talent ou une création avec le Kivu !"
                  }
                  icon="forum"
                />
              ) : (
                <>
                  {displayedPosts.map((item, index) => (
                    <div key={item.data.id || index}>
                      {renderPost(item)}
                      {index < displayedPosts.length - 1 && (
                        <div className="kivu-divider w-full mt-6" />
                      )}
                    </div>
                  ))}
                  <VoirPlusPagination onLoadMore={loadMore} hasMore={hasMore} isLoading={loadingMore} />
                </>
              )}
            </>
          )}
        </div>
        <div className="h-8" />
      </main>

      {/* DESKTOP */}
      <div className="hidden lg:block pb-16">
        <div className="max-w-7xl mx-auto px-8">

          {/* Page header */}
          <div className="flex items-end justify-between py-10 border-b border-white/10 mb-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-primary mb-2">
                Art du Kivu
              </p>
              <h1 className="text-5xl font-black text-[#F0EDE8] leading-tight">
                La <span className="text-primary">Communauté</span>
              </h1>
              <p className="text-[#8A8178] mt-2 text-base">
                Talents, défis et créations du Kivu
              </p>
            </div>
            <FilterTabs tabs={DESKTOP_FILTER_TABS} active={activeFilter} onChange={handleFilterChange} />
          </div>

          <div className="grid grid-cols-[280px_1fr_300px] gap-8 items-start">
            <aside className="sticky top-24 flex flex-col gap-5">
              <SubmitTalentDesktop onSubmitted={() => fetchPosts(activeFilter, 1, false)} />
              <CommunityStatsWidget talentCount={initialTalentCount} activeChallengeCount={activeChallenges.length} pollCount={polls.length} />
            </aside>

            <main className="flex flex-col gap-6">
              {postsLoading ? (
                <div className="flex justify-center py-16">
                  <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              ) : displayedPosts.length === 0 ? (
                <EmptyState
                  message={activeFilter === "challenge" ? "Aucune participation aux défis" : "Rien de nouveau ici"}
                  description={
                    activeFilter === "challenge"
                      ? "Soyez le premier à participer à un défi !"
                      : "Revenez plus tard pour voir les nouveaux talents du Kivu."
                  }
                />
              ) : (
                <>
                  {displayedPosts.map((item, index) => (
                    <div
                      key={item.data.id || index}
                      className="rounded-2xl overflow-hidden border border-white/5 bg-surface-dark card-glow transition-shadow"
                    >
                      <div className="p-5">{renderPost(item)}</div>
                    </div>
                  ))}
                  <VoirPlusPagination onLoadMore={loadMore} hasMore={hasMore} isLoading={loadingMore} />
                </>
              )}
            </main>

            <aside className="sticky top-24 flex flex-col gap-5">
              <DesktopChallengesSection challenges={challenges} onParticipated={handleParticipated} />
              <DesktopPollsSection polls={polls} />
              <TrendingWidget tags={trendingTags} />
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ════════════════════════════════════════════════════
   WIDGETS DESKTOP
════════════════════════════════════════════════════ */

// ── Défis (droite) — carrousel si plusieurs défis rejoignables, "voir plus" pour tous les
// défis actifs. Ne montre que les défis auxquels on peut participer (docs §3.3 has_participated),
// sauf en mode étendu où tous les défis actifs sont listés. ─────────────────────
function DesktopChallengesSection({
  challenges,
  onParticipated,
}: {
  challenges: ApiChallenge[];
  onParticipated?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  // A card's response form takes over its own slot in the carousel (see ChallengeCard.tsx) — if
  // the auto-advance kept running while it's open, it would scroll the form out from under the
  // user mid-typing every few seconds.
  const [anyResponding, setAnyResponding] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const active = challenges.filter((c) => c.is_active);
  const joinable = active.filter((c) => !c.has_participated);

  const showCarousel = !expanded && joinable.length > 1;
  // Clamp instead of resetting via effect — the joinable list can shrink (e.g. right after a
  // participation) without activeIndex being reset first, which would otherwise index out of
  // bounds for one render.
  const safeIndex = joinable.length > 0 ? activeIndex % joinable.length : 0;

  // Auto-advance every few seconds when several défis are joinable at once — paused while a
  // response form is open anywhere in the carousel.
  useEffect(() => {
    if (!showCarousel || anyResponding) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % joinable.length);
    }, 5000);
    return () => clearInterval(id);
  }, [showCarousel, joinable.length, anyResponding]);

  useEffect(() => {
    if (!showCarousel) return;
    const child = scrollRef.current?.children[safeIndex] as HTMLElement | undefined;
    child?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }, [safeIndex, showCarousel]);

  if (active.length === 0) return null;

  const singleCard = !expanded && joinable.length <= 1 ? (joinable[0] || active[0]) : null;

  return (
    <div className="rounded-2xl p-5 bg-surface-dark border border-white/5 border-t-2 border-t-accent-yellow card-glow">
      <div className="flex items-center justify-between mb-4">
        <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#8A8178]">
          <span className="material-symbols-outlined text-accent-yellow text-sm">emoji_events</span>
          Défis
        </p>
        {active.length > 1 && (
          <button onClick={() => setExpanded((v) => !v)} className="text-primary text-xs font-bold hover:underline">
            {expanded ? "Voir moins" : "Voir plus"}
          </button>
        )}
      </div>

      {expanded ? (
        <div className="flex flex-col gap-4">
          {active.map((c) => (
            <ChallengeCard key={c.id} challenge={c} onParticipated={onParticipated} onRespondingChange={setAnyResponding} />
          ))}
        </div>
      ) : showCarousel ? (
        <>
          <div ref={scrollRef} className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1 -mx-1 px-1">
            {joinable.map((c) => (
              <div key={c.id} className="min-w-full snap-center">
                <ChallengeCard challenge={c} onParticipated={onParticipated} onRespondingChange={setAnyResponding} />
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-1.5 mt-3">
            {joinable.map((c, i) => (
              <span
                key={c.id}
                className={`h-1.5 rounded-full transition-all ${i === safeIndex ? "w-4 bg-primary" : "w-1.5 bg-white/20"}`}
              />
            ))}
          </div>
        </>
      ) : singleCard ? (
        <ChallengeCard challenge={singleCard} onParticipated={onParticipated} onRespondingChange={setAnyResponding} />
      ) : null}
    </div>
  );
}

// ── Sondages (droite, toujours visible, jamais un filtre sur desktop) ──────────
function DesktopPollsSection({ polls }: { polls: ApiPoll[] }) {
  if (polls.length === 0) return null;
  return (
    <div className="flex flex-col gap-5">
      {polls.map((poll) => (
        <PollCard key={poll.id} poll={poll} />
      ))}
    </div>
  );
}

// ── Submit Talent desktop (sidebar gauche) ──────────
function SubmitTalentDesktop({ onSubmitted }: { onSubmitted?: () => void }) {
  const { isAuthenticated } = useAuth();
  const [authPrompt, setAuthPrompt] = useState(false);
  const {
    title, setTitle,
    description, setDescription,
    selected, selectFile,
    uploading, uploadProgress,
    statusMsg, statusType,
    submit,
  } = useMediaSubmission({ endpoint: "/api/v1/community/posts/submit_talent/", onSubmitted });

  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const micInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, category: MediaCategory) => {
    const file = e.target.files?.[0];
    if (!file) return;
    selectFile(file, category);
    e.target.value = "";
  };

  const handleSubmit = () => {
    if (!isAuthenticated) {
      setAuthPrompt(true);
      return;
    }
    submit();
  };

  return (
    <div className="rounded-2xl p-5 relative overflow-hidden bg-gradient-to-br from-surface-dark to-black border border-primary/20 card-glow">
      <div className="absolute -top-8 -right-8 w-28 h-28 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-primary text-2xl">graphic_eq</span>
          <h2 className="text-base font-black text-[#F0EDE8]">Soumettre un Talent</h2>
        </div>
        <p className="text-[#8A8178] text-xs mb-4 leading-relaxed">
          Montre ton talent au Kivu — musique, art, freestyle.
        </p>
        <div className="flex flex-col gap-3">
          <input
            className="w-full bg-black/40 border border-white/10 rounded-xl h-10 px-3 text-white placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
            placeholder="Titre du morceau"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="w-full bg-black/40 border border-white/10 rounded-xl h-20 px-3 py-2 text-white placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm resize-none"
            placeholder="Décris ton talent"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="file"
            ref={photoInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "image")}
          />
          <input
            type="file"
            ref={videoInputRef}
            className="hidden"
            accept="video/*"
            onChange={(e) => handleFileChange(e, "video")}
          />
          <input
            type="file"
            ref={micInputRef}
            className="hidden"
            accept="audio/*"
            onChange={(e) => handleFileChange(e, "audio")}
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              disabled={uploading}
              title={`Photo (max ${MEDIA_LIMITS.MAX_IMAGE_MB} Mo)`}
              className={`flex items-center justify-center h-10 w-10 rounded-xl bg-white/5 border transition-colors disabled:opacity-50 ${selected?.category === "image" ? "border-primary text-primary" : "border-white/10 text-[#8A8178] hover:text-white"}`}
            >
              <span className="material-symbols-outlined text-lg">add_a_photo</span>
            </button>
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              disabled={uploading}
              title={`Vidéo (max ${MEDIA_LIMITS.MAX_VIDEO_MB} Mo)`}
              className={`flex items-center justify-center h-10 w-10 rounded-xl bg-white/5 border transition-colors disabled:opacity-50 ${selected?.category === "video" ? "border-primary text-primary" : "border-white/10 text-[#8A8178] hover:text-white"}`}
            >
              <span className="material-symbols-outlined text-lg">videocam</span>
            </button>
            <button
              type="button"
              onClick={() => micInputRef.current?.click()}
              disabled={uploading}
              title={`Audio (max ${MEDIA_LIMITS.MAX_AUDIO_MB} Mo)`}
              className={`flex items-center justify-center h-10 w-10 rounded-xl bg-white/5 border transition-colors disabled:opacity-50 ${selected?.category === "audio" ? "border-primary text-primary" : "border-white/10 text-[#8A8178] hover:text-white"}`}
            >
              <span className="material-symbols-outlined text-lg">mic</span>
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={uploading}
              className="flex-1 h-10 px-4 rounded-xl bg-primary hover:bg-[#B8240C] text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-90"
            >
              {uploading ? (
                <CircularProgress percent={uploadProgress} size={22} strokeWidth={2.5} className="text-white" />
              ) : (
                <span>Envoyer</span>
              )}
            </button>
          </div>
          {selected && (
            <p className="text-[10px] text-gray-500">
              ✓ {selected.file.name.slice(0, 24)} ({humanSize(selected.file.size)})
            </p>
          )}
          {statusMsg && (
            <p className={`text-xs mt-1 font-medium ${statusType === "success" ? "text-green-400" : statusType === "error" ? "text-red-400" : "text-primary"}`}>
              {statusMsg}
            </p>
          )}
        </div>
      </div>

      <AuthPromptModal
        open={authPrompt}
        onClose={() => setAuthPrompt(false)}
        redirectTo="/communaute"
        message="Connectez-vous ou créez un compte pour soumettre votre talent : ça ne prend que 2 secondes !"
      />
    </div>
  );
}

// ── Stats communauté ────────────────────────────────
// No real "total members" count is available from the API (no public/authenticated endpoint
// exposes one) — that stat is dropped rather than shown as an invented number. See
// BACKEND_GAPS.md if a members-count endpoint gets added later.
function CommunityStatsWidget({
  talentCount,
  activeChallengeCount,
  pollCount,
}: {
  talentCount: number;
  activeChallengeCount: number;
  pollCount: number;
}) {
  const stats = [
    { icon: "music_note",     value: String(talentCount),        label: "Talents" },
    { icon: "emoji_events",   value: String(activeChallengeCount), label: "Défis actifs" },
    { icon: "bar_chart",      value: String(pollCount),           label: "Sondages" },
  ];

  return (
    <div className="rounded-2xl p-5 bg-surface-dark border border-white/5 border-t-2 border-t-accent-gold card-glow">
      <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#8A8178] mb-4">
        <span className="material-symbols-outlined text-accent-gold text-sm">groups</span>
        Communauté
      </p>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
          >
            <span className="material-symbols-outlined text-primary text-lg">{s.icon}</span>
            <span className="text-[#F0EDE8] font-black text-lg">{s.value}</span>
            <span className="text-[#8A8178] text-[10px] font-medium">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tendances — calculées côté client à partir des #hashtags du contenu des posts déjà
// chargés (voir computeTrending ci-dessus / docs/COMMUNAUTE_BACKEND_REQUIREMENTS.md §4). ──
function TrendingWidget({ tags }: { tags: { label: string; count: number }[] }) {
  return (
    <div className="rounded-2xl p-5 bg-surface-dark border border-white/5 border-t-2 border-t-primary card-glow">
      <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#8A8178] mb-4">
        <span className="material-symbols-outlined text-primary text-sm">trending_up</span>
        Tendances
      </p>
      {tags.length === 0 ? (
        <p className="text-gray-500 text-xs">Pas encore de tendances — soyez les premiers à utiliser un #hashtag !</p>
      ) : (
        <div className="flex flex-col gap-1">
          {tags.map((tag, i) => (
            <div
              key={tag.label}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all hover:bg-white/5 group"
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-[#4A443E] w-4">{i + 1}</span>
                <span className="text-sm font-bold text-primary group-hover:text-[#F0EDE8] transition-colors">
                  {tag.label}
                </span>
              </div>
              <span className="text-[#4A443E] text-xs group-hover:text-[#8A8178] transition-colors">
                {tag.count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
