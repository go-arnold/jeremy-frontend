import NowPlayingHero, { NowPlayingHeroProvider } from "@/components/liveMusic/NowPlayingHero";
import LiveChat from "@/components/liveMusic/LiveChat";
import ProgramSchedule from "@/components/liveMusic/ProgramSchedule";
import EngagementBar from "@/components/ui/EngagementBar";
import ReplayPlayer from "@/components/media/ReplayPlayer";
import { fetchLiveMusicSessions, fetchProgramme, fetchLiveMusicChat } from "@/lib/services/liveMusic";
import { pickFeaturedByTimestamp } from "@/lib/mappers";
import EmptyState from "@/components/ui/EmptyState";
import { programSlots as mockedSlots, chatMessages as mockedChat } from "@/data/liveMusic";
import type { ProgramSlot } from "@/types/liveMusic";

// ISR — refetches at most every 60s instead of freezing at build time forever.
export const revalidate = 60;

async function getLivePrograms() {
  try {
    return await fetchProgramme();
  } catch {
    return [];
  }
}

// `fetchProgramme()` returns the shared radio/live-music mapper shape (time/presenter/status:
// "now"|"next"|"later"), not the `ProgramSlot` shape `ProgramSchedule` renders — adapt between
// the two rather than casting past the mismatch.
function toProgramSlot(program: Awaited<ReturnType<typeof fetchProgramme>>[number]): ProgramSlot {
  return {
    id: program.id,
    time: program.time,
    title: program.title,
    subtitle: program.presenter || program.host || program.description || "",
    icon: program.isLive ? "graphic_eq" : "schedule",
    status: program.status === "now" ? "on-air" : "upcoming",
    dayOfWeek: program.dayOfWeek,
    dayName: program.day,
  };
}

// Backend's `DayOfWeekEnum` is 0=Monday..6=Sunday; JS `Date.getDay()` is 0=Sunday..6=Saturday.
function todayAsBackendDayOfWeek(): number {
  return (new Date().getDay() + 6) % 7;
}

/** Splits the full programme into today's grid vs other days' — slots with no `dayOfWeek` at
 * all (mocked fallback data) are treated as "today" so nothing silently disappears. */
function splitByDay(slots: ProgramSlot[]): { today: ProgramSlot[]; upcoming: ProgramSlot[] } {
  const todayNum = todayAsBackendDayOfWeek();
  const today: ProgramSlot[] = [];
  const upcoming: ProgramSlot[] = [];
  for (const slot of slots) {
    if (slot.dayOfWeek === undefined || slot.dayOfWeek === todayNum) today.push(slot);
    else upcoming.push(slot);
  }
  return { today, upcoming };
}

async function getLiveChat(slug: string) {
  try {
    return await fetchLiveMusicChat(slug);
  } catch {
    return [];
  }
}

async function getLiveMusicSessions() {
  try {
    return await fetchLiveMusicSessions();
  } catch {
    return [];
  }
}

export default async function Page() {
  const sessions = await getLiveMusicSessions();
  const programs = await getLivePrograms();
  const programSlots = programs.length > 0 ? programs.map(toProgramSlot) : mockedSlots;
  const { today: todaySlots, upcoming: upcomingSlots } = splitByDay(programSlots);

  // The session to feature: the most-recently-gone-live one if any are currently live,
  // otherwise the most recently-ended one — never just whatever `/sessions/current/` happens to
  // return, which doesn't guarantee it already picked the right one when several sessions share
  // the same status at once.
  const featured = pickFeaturedByTimestamp(sessions);

  const scheduleBlock = programSlots.length > 0 && (
    <>
      {/* Mobile */}
      <div className="lg:hidden w-full px-4 mt-4 pb-10">
        <ProgramSchedule todaySlots={todaySlots} upcomingSlots={upcomingSlots} variant="mobile" />
      </div>
      {/* Desktop */}
      <div className="hidden lg:block w-full max-w-2xl mx-auto mt-4 pb-10">
        <ProgramSchedule todaySlots={todaySlots} upcomingSlots={upcomingSlots} variant="desktop" />
      </div>
    </>
  );

  // Nothing has ever gone live — true empty state
  if (!featured) {
    return (
      <div className="min-h-screen">
        <main className="relative w-full flex flex-col items-center justify-center min-h-[80vh]">
          <EmptyState
            icon="music_off"
            message="Aucune session live en ce moment"
            description="Il n'y a pas de musique en direct actuellement. Revenez plus tard ou consultez le programme ci-dessous."
          />
          {scheduleBlock}
        </main>
      </div>
    );
  }

  // Nothing live right now, but the most recent session has ended and was recorded — feature it
  // as a replay instead of a blank empty state.
  if (!featured.isLive) {
    return (
      <div className="min-h-screen">
        <main className="relative w-full flex flex-col items-center pt-16 pb-10 px-4">
          <div className="w-full max-w-2xl">
            <ReplayPlayer
              title={featured.title}
              host={featured.presenter || featured.host || "Art du Kivu"}
              coverImage={featured.image || ""}
              audioUrl={featured.audioUrl}
            />
          </div>
          {scheduleBlock}
        </main>
      </div>
    );
  }

  const liveShow = featured;
  // Fetch live chat using the session slug/id
  const slug = liveShow.id || "";
  const chatMessages = await getLiveChat(slug);
  const displayChat = chatMessages.length > 0 ? chatMessages : mockedChat;

  const nowPlaying = {
    slug,
    numericId: liveShow.numericId ?? null,
    title: liveShow.title,
    djName: liveShow.presenter || liveShow.host || "Art du Kivu",
    coverImage: liveShow.image || "",
    isLive: true,
    listenerCount: liveShow.listenerCount || 0,
    hlsUrl: liveShow.hlsUrl || null,
    likeCount: liveShow.likeCount || 0,
    commentCount: liveShow.commentCount || 0,
  };

  return (
    <div className="min-h-screen ">
      <NowPlayingHeroProvider track={nowPlaying}>
      <main className="relative w-full">

        {/* ══════════════════════════════════════════
            MOBILE — layout original inchangé
        ══════════════════════════════════════════ */}
        <div className="lg:hidden pt-20 max-w-md mx-auto">
          {/* Ambient glow */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-md h-[420px] bg-primary/10 blur-[120px] rounded-full pointer-events-none z-0 mix-blend-screen" />

          <NowPlayingHero />

          <div className="px-6">
            <EngagementBar
              resourceType="live_music/sessions"
              id={slug}
              initialLikeCount={nowPlaying.likeCount}
              initialCommentCount={nowPlaying.commentCount}
              redirectTo="/live-music"
            />
          </div>

          <div className="w-full bg-[#12223ce6] rounded-t-[2.5rem] border-t border-white/5 relative z-20 pb-10 shadow-[0_-10px_60px_rgba(0,0,0,0.8)]">
            <div className="w-full flex justify-center pt-4 pb-2">
              <div className="w-12 h-1.5 bg-white/10 rounded-full" />
            </div>
            <LiveChat slug={slug} messages={displayChat} listenerCount={nowPlaying.listenerCount} />
            <div className="w-full h-px bg-white/5 my-2" />
            <ProgramSchedule todaySlots={todaySlots} upcomingSlots={upcomingSlots} variant="mobile" />
            <div className="h-10" />
          </div>
        </div>

        {/* ══════════════════════════════════════════
            DESKTOP — 3 colonnes
        ══════════════════════════════════════════ */}
        <div className="hidden lg:block mt-10">

          {/* Ambient glow desktop */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px]  bg-primary/8 blur-[140px] rounded-full pointer-events-none z-0" />

          <div className="relative z-10 max-w-[1800px] mx-auto px-8 pt-10">

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
                <NowPlayingHero />
                <EngagementBar
                  resourceType="live_music/sessions"
                  id={slug}
                  initialLikeCount={nowPlaying.likeCount}
                  initialCommentCount={nowPlaying.commentCount}
                  redirectTo="/live-music"
                />
              </div>

              {/* ── Col 2 : Programme ── */}
              <div>
                <ProgramSchedule todaySlots={todaySlots} upcomingSlots={upcomingSlots} variant="desktop" />
              </div>

              {/* ── Col 3 : Chat ── */}
              <div className="sticky top-24">
                <LiveChat slug={slug} messages={displayChat} listenerCount={nowPlaying.listenerCount} />
              </div>
            </div>
          </div>
        </div>

      </main>
      </NowPlayingHeroProvider>
    </div>
  );
}
