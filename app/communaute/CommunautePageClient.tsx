"use client";

import { useRef, useState } from "react";
import { feedItems as mockedFeed } from "@/data/communaute";
import SubmitTalentCard from "@/components/communaute/SubmitTalentCard";
import FilterTabs, { type FilterTab } from "@/components/communaute/FilterTabs";
import TalentPostCard   from "@/components/communaute/TalentPostCard";
import ChallengeCard    from "@/components/communaute/ChallengeCard";
import PollCard         from "@/components/communaute/PollCard";
import ArtPostCard      from "@/components/communaute/ArtPostCard";
import { apiFetch, PaginatedResponse } from "@/lib/api-client";
import { mapApiPostToCommunityItem } from "@/lib/mappers";
import type { ApiChallenge, ApiPoll } from "@/types/communaute";
import type { ApiCommunityPost } from "@/lib/api-types";
import EmptyState from "@/components/ui/EmptyState";
import VoirPlusPagination from "@/components/ui/VoirPlusPagination";
import CircularProgress from "@/components/ui/CircularProgress";
import { uploadToCloudinaryWithProgress } from "@/lib/cloudinaryUpload";

type MappedPost = ReturnType<typeof mapApiPostToCommunityItem>;

const FILTER_TABS: FilterTab[] = [
  { id: "tous", label: "Tous" },
  { id: "talent", label: "Talents" },
  { id: "challenge", label: "Défis" },
  { id: "poll", label: "Sondages" },
  { id: "art", label: "Art" },
  { id: "goma", label: "Goma" },
  { id: "bukavu", label: "Bukavu" },
];

function buildEndpoint(filter: string, page: number): string {
  const params = new URLSearchParams({ page: String(page), page_size: "15" });
  if (filter === "goma" || filter === "bukavu") params.set("city", filter);
  else if (filter !== "tous") params.set("post_type", filter);
  return `/api/v1/community/posts/?${params.toString()}`;
}

interface CommunautePageClientProps {
  initialPosts: MappedPost[];
  initialHasMore: boolean;
  initialChallenges: ApiChallenge[];
  initialPolls: ApiPoll[];
}

export default function CommunautePageClient({
  initialPosts,
  initialHasMore,
  initialChallenges,
  initialPolls,
}: CommunautePageClientProps) {
  const [posts, setPosts] = useState<MappedPost[]>(initialPosts);
  const [challenges, setChallenges] = useState<ApiChallenge[]>(initialChallenges);
  const [polls, setPolls] = useState<ApiPoll[]>(initialPolls);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("tous");

  const fetchPosts = async (filter: string, pg: number, append = false) => {
    const endpoint = buildEndpoint(filter, pg);
    try {
      const data = await apiFetch<PaginatedResponse<ApiCommunityPost>>(endpoint);
      const mapped = data.results.map(mapApiPostToCommunityItem);
      setPosts((prev) => append ? [...prev, ...mapped] : mapped);
      setHasMore(!!data.next);
      setPage(pg);
    } catch (error) {
      console.error("Failed to fetch community feed:", error);
      if (!append) setPosts(mockedFeed as unknown as MappedPost[]);
    }
  };

  const handleFilterChange = async (filter: string) => {
    if (filter === activeFilter) return;
    setActiveFilter(filter);
    setLoading(true);
    await fetchPosts(filter, 1, false);
    setLoading(false);
  };

  const loadMore = async (nextPage?: number) => {
    const pg = nextPage || page + 1;
    if (loadingMore || !hasMore) return;
    setLoadingLoadingMore(true);
    await fetchPosts(activeFilter, pg, true);
    setLoadingLoadingMore(false);
  };

  const showEmptyState = !loading && posts.length === 0;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">

      {/* MOBILE */}
      <main className="lg:hidden flex-1 overflow-y-auto pb-24 no-scrollbar">
        <SubmitTalentCard onSubmitted={() => fetchPosts(activeFilter, 1, false)} />
        <div className="flex flex-col gap-6 px-4">
          <FilterTabs tabs={FILTER_TABS} active={activeFilter} onChange={handleFilterChange} />
          {challenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
          {polls.map((poll) => (
            <PollCard key={poll.id} poll={poll} />
          ))}
          {showEmptyState ? (
            <EmptyState
              message="Communauté tranquille"
              description="Soyez le premier à partager votre talent ou une création avec le Kivu !"
              icon="forum"
            />
          ) : (
            <>
              {posts.map((item, index) => (
                <div key={item.data.id || index}>
                  {item.type === "talent" && <TalentPostCard post={item.data} />}
                  {item.type === "art"    && <ArtPostCard post={item.data} />}
                  {item.type === "news"   && <TalentPostCard post={item.data} />}
                  {index < posts.length - 1 && (
                    <div className="h-px bg-white/5 w-full mt-6" />
                  )}
                </div>
              ))}
              <VoirPlusPagination
                onLoadMore={loadMore}
                hasMore={hasMore}
                isLoading={loadingMore}
              />
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
            <FilterTabs tabs={FILTER_TABS} active={activeFilter} onChange={handleFilterChange} />
          </div>

          <div className="grid grid-cols-[280px_1fr_300px] gap-8 items-start">
            <aside className="sticky top-24 flex flex-col gap-5">
              <SubmitTalentDesktop onSubmitted={() => fetchPosts(activeFilter, 1, false)} />
              <CommunityStatsWidget />
            </aside>

            <main className="flex flex-col gap-6">
              {posts.length === 0 ? (
                <EmptyState
                  message="Rien de nouveau ici"
                  description="Revenez plus tard pour voir les nouveaux talents du Kivu."
                />
              ) : (
                <>
                  {posts.map((item, index) => (
                    <div
                      key={item.data.id || index}
                      className="rounded-2xl overflow-hidden border border-white/5"
                      style={{ background: "rgba(18,34,60,0.4)" }}
                    >
                      <div className="p-5">
                        {item.type === "talent" && <TalentPostCard post={item.data} />}
                        {item.type === "art"    && <ArtPostCard post={item.data} />}
                        {item.type === "news"   && <TalentPostCard post={item.data} />}
                      </div>
                    </div>
                  ))}

                  <VoirPlusPagination
                    onLoadMore={loadMore}
                    hasMore={hasMore}
                    isLoading={loadingMore}
                  />
                </>
              )}
            </main>

            <aside className="sticky top-24 flex flex-col gap-5">
              {challenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
              {polls.map((poll) => (
                <PollCard key={poll.id} poll={poll} />
              ))}
              <TrendingWidget />
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

// ── Submit Talent desktop (sidebar gauche) ──────────
function SubmitTalentDesktop({ onSubmitted }: { onSubmitted?: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState<{ file: File; category: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "info">("info");

  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const micInputRef = useRef<HTMLInputElement>(null);

  const getContext = (cat: string): string => {
    if (cat === "image") return "community_image";
    if (cat === "video") return "community_video";
    if (cat === "audio") return "community_song";
    return "community_image";
  };
  const getMediaType = (cat: string): string => {
    if (cat === "image") return "image";
    if (cat === "video") return "video";
    if (cat === "audio") return "song";
    return "image";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, category: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelected({ file, category });
    setStatusMsg(`✓ ${file.name.slice(0, 20)}...`);
    setStatusType("info");
    e.target.value = "";
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !selected) {
      setStatusMsg("Titre, description et média (photo, audio ou vidéo) sont tous obligatoires.");
      setStatusType("error");
      return;
    }
    setUploading(true);
    setUploadProgress(0);
    setStatusMsg("");
    try {
      const context = getContext(selected.category);
      const mediaType = getMediaType(selected.category);
      const mediaUrl = await uploadToCloudinaryWithProgress(selected.file, context, setUploadProgress);

      const payload = {
        title: title.trim(),
        content: description.trim(),
        media: [{ type: mediaType, url: mediaUrl }],
      };
      await apiFetch("/api/v1/community/posts/submit_talent/", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setStatusMsg("🎉 Soumis !");
      setStatusType("success");
      setTitle("");
      setDescription("");
      setSelected(null);
      onSubmitted?.();
    } catch (err) {
      console.error(err);
      setStatusMsg(err instanceof Error ? err.message : "Erreur d'envoi.");
      setStatusType("error");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(18,34,60,0.9), rgba(13,23,47,0.8))",
        border: "1px solid rgba(230,48,18,0.2)",
      }}
    >
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
            accept="image/*,video/*"
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
              className={`flex items-center justify-center h-10 w-10 rounded-xl bg-white/5 border transition-colors disabled:opacity-50 ${selected?.category === "image" ? "border-primary text-primary" : "border-white/10 text-[#8A8178] hover:text-white"}`}
            >
              <span className="material-symbols-outlined text-lg">add_a_photo</span>
            </button>
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              disabled={uploading}
              className={`flex items-center justify-center h-10 w-10 rounded-xl bg-white/5 border transition-colors disabled:opacity-50 ${selected?.category === "video" ? "border-primary text-primary" : "border-white/10 text-[#8A8178] hover:text-white"}`}
            >
              <span className="material-symbols-outlined text-lg">videocam</span>
            </button>
            <button
              type="button"
              onClick={() => micInputRef.current?.click()}
              disabled={uploading}
              className={`flex items-center justify-center h-10 w-10 rounded-xl bg-white/5 border transition-colors disabled:opacity-50 ${selected?.category === "audio" ? "border-primary text-primary" : "border-white/10 text-[#8A8178] hover:text-white"}`}
            >
              <span className="material-symbols-outlined text-lg">mic</span>
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={uploading}
              className="flex-1 h-10 rounded-xl bg-primary hover:bg-[#B8240C] text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-90"
            >
              {uploading ? (
                <CircularProgress percent={uploadProgress} size={22} strokeWidth={2.5} className="text-white" />
              ) : (
                <>
                  <span>Envoyer</span>
                  <span className="material-symbols-outlined text-sm">send</span>
                </>
              )}
            </button>
          </div>
          {statusMsg && (
            <p className={`text-xs mt-1 font-medium ${statusType === "success" ? "text-green-400" : statusType === "error" ? "text-red-400" : "text-primary"}`}>
              {statusMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Stats communauté ────────────────────────────────
function CommunityStatsWidget() {
  const stats = [
    { icon: "group",          value: "2.4k",  label: "Membres" },
    { icon: "music_note",     value: "380+",  label: "Talents" },
    { icon: "emoji_events",   value: "12",    label: "Défis actifs" },
    { icon: "bar_chart",      value: "54",    label: "Sondages" },
  ];

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "rgba(18,34,60,0.5)", border: "1px solid rgba(255,255,255,0.05)" }}
    >
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8A8178] mb-4">
        Communauté
      </p>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center gap-1 p-3 rounded-xl"
            style={{ background: "rgba(255,255,255,0.03)" }}
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

// ── Tendances ───────────────────────────────────────
function TrendingWidget() {
  const tags = [
    "#GomaSounds", "#KivuRap", "#FreestyleKivu",
    "#AfroKivu", "#BukavuBeats", "#TalentKivu",
  ];

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "rgba(18,34,60,0.5)", border: "1px solid rgba(255,255,255,0.05)" }}
    >
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8A8178] mb-4">
        Tendances
      </p>
      <div className="flex flex-col gap-1">
        {tags.map((tag, i) => (
          <button
            key={tag}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all hover:bg-white/5 group"
          >
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-[#4A443E] w-4">{i + 1}</span>
              <span className="text-sm font-bold text-primary group-hover:text-[#F0EDE8] transition-colors">
                {tag}
              </span>
            </div>
            <span className="material-symbols-outlined text-[#4A443E] text-sm group-hover:text-[#8A8178] transition-colors">
              trending_up
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
