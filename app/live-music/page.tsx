import NowPlayingHero from "@/components/liveMusic/NowPlayingHero";
import NowPlayingHeroDesktop from "@/components/liveMusic/NowPlayingHeroDesktop";
import ProgramScheduleDesktop from "@/components/liveMusic/ProgramScheduleDesktop";
import LiveChatDesktop from "@/components/liveMusic/LiveChatDesktop";
import LiveChat from "@/components/liveMusic/LiveChat";
import ProgramSchedule from "@/components/liveMusic/ProgramSchedule";
import { apiFetch, PaginatedResponse } from "@/lib/api-client";
import { mapApiRadioToRadioProgram } from "@/lib/mappers";
import EmptyState from "@/components/ui/EmptyState";
import { programSlots as mockedSlots, chatMessages as mockedChat } from "@/data/liveMusic";

async function getLiveShow() {
  try {
    const data = await apiFetch<any>("/api/v1/live_music/sessions/current/");
    return mapApiRadioToRadioProgram(data);
  } catch {
    // No live session currently — return null to show empty state
    return null;
  }
}

async function getLivePrograms() {
  try {
    const data = await apiFetch<PaginatedResponse<any>>("/api/v1/live_music/programme/");
    const results = Array.isArray(data) ? data : data.results || [];
    return results.map(mapApiRadioToRadioProgram);
  } catch {
    return [];
  }
}

async function getLiveChat(slug: string) {
  try {
    const data = await apiFetch<PaginatedResponse<any>>(`/api/v1/live_music/sessions/${slug}/chat/`);
    const results = Array.isArray(data) ? data : data.results || [];
    // Map API chat messages to the liveMusic ChatMessage shape
    return results.map((msg: any) => ({
      id: String(msg.id || Math.random()),
      username: msg.username || msg.user?.username || "Anonyme",
      avatar: msg.avatar_url || msg.user?.avatar_url || "",
      message: msg.message || msg.content || "",
      tag: "",
      timeAgo: msg.created_at_human || "Récemment",
    }));
  } catch {
    return [];
  }
}

export default async function Page() {
  const liveShow = await getLiveShow();
  const programs = await getLivePrograms();
  const programSlots = programs.length > 0 ? programs : mockedSlots;

  // If no live session is active, show an empty state
  if (!liveShow) {
    return (
      <div className="min-h-screen">
        <main className="relative w-full flex flex-col items-center justify-center min-h-[80vh]">
          <EmptyState
            icon="music_off"
            message="Aucune session live en ce moment"
            description="Il n'y a pas de musique en direct actuellement. Revenez plus tard ou consultez le programme ci-dessous."
          />
          {/* Still show the programme schedule even if no live */}
          {programSlots.length > 0 && (
            <>
              {/* Mobile */}
              <div className="lg:hidden w-full px-4 mt-4 pb-10">
                <ProgramSchedule slots={programSlots as any} />
              </div>
              {/* Desktop */}
              <div className="hidden lg:block w-full max-w-2xl mx-auto mt-4 pb-10">
                <ProgramScheduleDesktop slots={programSlots as any} />
              </div>
            </>
          )}
        </main>
      </div>
    );
  }

  // Fetch live chat using the session slug/id
  const chatMessages = await getLiveChat((liveShow as any).id || "");
  const displayChat = chatMessages.length > 0 ? chatMessages : mockedChat;

  const nowPlaying = {
    title: (liveShow as any).title,
    djName: (liveShow as any).presenter || (liveShow as any).host || "Art du Kivu",
    coverImage: (liveShow as any).image || "",
    isLive: true,
    listenerCount: (liveShow as any).listenerCount || 0,
  };

  return (
    <div className="min-h-screen ">
      <main className="relative w-full">

        {/* ══════════════════════════════════════════
            MOBILE — layout original inchangé
        ══════════════════════════════════════════ */}
        <div className="lg:hidden pt-20 max-w-md mx-auto">
          {/* Ambient glow */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-md h-[420px] bg-primary/10 blur-[120px] rounded-full pointer-events-none z-0 mix-blend-screen" />

          <NowPlayingHero track={nowPlaying as any} />

          <div className="w-full bg-[#12223ce6] rounded-t-[2.5rem] border-t border-white/5 relative z-20 pb-10 shadow-[0_-10px_60px_rgba(0,0,0,0.8)]">
            <div className="w-full flex justify-center pt-4 pb-2">
              <div className="w-12 h-1.5 bg-white/10 rounded-full" />
            </div>
            <LiveChat messages={displayChat as any} listenerCount={nowPlaying.listenerCount} />
            <div className="w-full h-px bg-white/5 my-2" />
            <ProgramSchedule slots={programSlots as any} />
            <div className="h-10" />
          </div>
        </div>

        {/* ══════════════════════════════════════════
            DESKTOP — 3 colonnes
        ══════════════════════════════════════════ */}
        <div className="hidden lg:block mt-10">

          {/* Ambient glow desktop */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px]  bg-primary/8 blur-[140px] rounded-full pointer-events-none z-0" />

          <div className="relative z-10 max-w-7xl mx-auto px-8 pt-10">

            {/* Page title */}
            <div className="flex items-center gap-4 mb-10">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
                </span>
                <h1 className="text-3xl font-black tracking-tight text-[#F0EDE8] uppercase">
                  Live <span className="text-primary">Music</span>
                </h1>
              </div>
              <div className="kivu-divider flex-1" />
              <span className="text-[#8A8178] text-sm">
                {nowPlaying.listenerCount} auditeurs
              </span>
            </div>

            {/* ── Grille 3 colonnes ── */}
            <div className="grid grid-cols-[380px_1fr_360px] gap-6 items-start">

              {/* ── Col 1 : Now Playing ── */}
              <div className="sticky top-24 flex flex-col gap-6">
                <NowPlayingHeroDesktop track={nowPlaying as any} />
              </div>

              {/* ── Col 2 : Programme ── */}
              <div>
                <ProgramScheduleDesktop slots={programSlots as any} />
              </div>

              {/* ── Col 3 : Chat ── */}
              <div className="sticky top-24">
                <LiveChatDesktop messages={displayChat as any} listenerCount={nowPlaying.listenerCount} />
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
