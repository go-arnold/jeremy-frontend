import LivePlayer, { LivePlayerProvider } from "@/components/radio-en-direct/LivePlayer";
import ReplayPlayer from "@/components/media/ReplayPlayer";
import ProgramGrid from "@/components/radio-en-direct/ProgramGrid";
import LiveChat from "@/components/radio-en-direct/LiveChat";
import MembershipBannerWidget from "@/components/radio-en-direct/MembershipBannerWidget";
import EngagementBar from "@/components/ui/EngagementBar";
import { membershipBanner as mockedBanner, programSlots as mockedSlots, liveShow as mockedShow } from "@/data/radio";
import { fetchProgramSchedule, fetchRadioChat } from "@/lib/services/radio";
import { pickFeaturedByWeeklySchedule } from "@/lib/mappers";
import EmptyState from "@/components/ui/EmptyState";
import type { LiveShow } from "@/types/radio";

// ISR — refetches at most every 60s instead of freezing at build time forever.
export const revalidate = 60;

type RadioProgram = Awaited<ReturnType<typeof fetchProgramSchedule>>[number];

async function getRadioPrograms() {
  try {
    return await fetchProgramSchedule();
  } catch {
    return [];
  }
}

// LiveShow (LivePlayer's prop type) diverges from the shared radio/live-music mapper shape on a
// few fields (listenerCount as a formatted string, isPlaying vs isLive, imageUrl vs image) —
// adapt rather than cast past the mismatch.
function toLiveShow(program: RadioProgram): LiveShow {
  return {
    slug: program.slug,
    numericId: program.numericId,
    title: program.title,
    description: program.description,
    host: program.host || "Art du Kivu",
    listenerCount: String(program.listenerCount ?? 0),
    isPlaying: program.isLive,
    imageUrl: program.image || "",
    imageAlt: program.title,
    hlsUrl: program.hlsUrl,
    messages: [],
  };
}

async function getRadioChat() {
  try {
    return await fetchRadioChat();
  } catch {
    return [];
  }
}

export default async function RadioEnDirectPage() {
  const programs = await getRadioPrograms();
  const programSlots = programs.length > 0 ? programs : mockedSlots;
  // The program to feature/play: the currently-live one, or — since radio records every
  // program — the most-recently-*ended* one so its recording can be offered as a replay via
  // `audioUrl`. Never just whatever `/radio/current/` happens to return (observed returning an
  // "upcoming" slot instead of an actually-live one).
  const featured = pickFeaturedByWeeklySchedule(programs);

  // Nothing live and nothing recently ended — show an empty state
  if (!featured) {
    return (
      <div className="min-h-screen">
        <main className="pt-20 max-w-[1800px] mx-auto px-4 lg:px-8 pb-16 flex flex-col items-center">
          <EmptyState
            icon="radio"
            message="Aucune émission en direct"
            description="La radio Art du Kivu n'est pas en direct en ce moment. Consultez la grille des programmes ci-dessous."
          />
          {/* Still show the programme grid even if no live */}
          {programSlots.length > 0 && (
            <div className="w-full mt-4">
              <ProgramGrid slots={programSlots} />
            </div>
          )}
          <div className="w-full mt-8">
            <MembershipBannerWidget banner={mockedBanner} />
          </div>
        </main>
      </div>
    );
  }

  // Fetch live chat from API
  const chatMessages = await getRadioChat();
  const displayChat = chatMessages.length > 0 ? chatMessages : (mockedShow.messages || []);

  // Nothing live right now, but the most recent program has ended and was recorded — feature it
  // as a replay instead of the live HLS player.
  if (!featured.isLive) {
    return (
      <div className="min-h-screen">
        <main className="pt-20 max-w-[1800px] mx-auto px-4 lg:px-8 pb-16">
          <div className="flex items-center gap-4 mb-6 lg:mb-10">
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-[#F0EDE8] uppercase">
              Radio <span className="text-primary">En Direct</span>
            </h1>
            <div className="kivu-divider flex-1" />
            <span className="text-[#8A8178] text-xs lg:text-sm font-medium">Rediffusion</span>
          </div>

          <div className="grid lg:grid-cols-[1fr_400px] gap-6 items-start">
            <ReplayPlayer
              title={featured.title}
              host={featured.host || featured.presenter || "Art du Kivu"}
              coverImage={featured.image || ""}
              audioUrl={featured.audioUrl}
              dayName={featured.day}
              endTime={featured.endTime}
            />

            <div className="flex flex-col gap-5">
              <div className="rounded-2xl p-5 bg-surface-dark border border-white/5">
                <EngagementBar
                  resourceType="radio/program"
                  id={featured.numericId ?? ""}
                  redirectTo="/radio-en-direct"
                />
              </div>
              <ProgramGrid slots={programSlots} />
              <LiveChat messages={displayChat} />
            </div>
          </div>

          <div className="mt-8">
            <MembershipBannerWidget banner={mockedBanner} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <LivePlayerProvider show={toLiveShow(featured)}>
        <main className="
          /* Mobile : colonne unique, centré */
          pt-20 max-w-md mx-auto px-0

          /* Desktop : pleine largeur, plafonnée pour ne pas s'étirer à l'infini sur très grand écran */
          lg:max-w-[1800px] lg:mx-auto lg:pt-10 lg:pb-16 lg:px-8
        ">

          {/* ══════════════════════════════════════════
              MOBILE : empilement vertical (inchangé)
          ══════════════════════════════════════════ */}
          <div className="lg:hidden">
            <LivePlayer variant="mobile" />
            <div className="px-4">
              <EngagementBar
                resourceType="radio/program"
                id={featured.numericId ?? ""}
                redirectTo="/radio-en-direct"
              />
            </div>
            <ProgramGrid slots={programSlots} />
            <MembershipBannerWidget banner={mockedBanner} />
          </div>

          {/* ══════════════════════════════════════════
              DESKTOP : layout 2 colonnes
          ══════════════════════════════════════════ */}
          <div className="hidden mt-10 lg:flex lg:flex-col lg:gap-6">

            {/* Titre de page */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E63012] opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E63012]" />
                </span>
                <h1 className="text-3xl font-black tracking-tight text-[#F0EDE8] uppercase">
                  Radio <span className="text-[#E63012]">En Direct</span>
                </h1>
              </div>
              <div className="kivu-divider flex-1" />
              <span className="text-[#8A8178] text-sm font-medium">
                {featured.listenerCount} auditeurs en ligne
              </span>
            </div>

            {/* ── Ligne principale : Player gauche + Sidebar droite ── */}
            <div className="grid grid-cols-[1fr_400px] gap-6 items-start">

              {/* ── Colonne gauche : LivePlayer ── */}
              <LivePlayer variant="desktop" />

              {/* ── Colonne droite : Programme + Chat ── */}
              <div className="flex flex-col gap-5 sticky top-24">
                <div className="rounded-2xl p-5 bg-surface-dark border border-white/5">
                  <EngagementBar
                    resourceType="radio/program"
                    id={featured.numericId ?? ""}
                    redirectTo="/radio-en-direct"
                  />
                </div>
                <ProgramGrid slots={programSlots} />
                <LiveChat messages={displayChat} />
              </div>
            </div>

            {/* ── Membership Banner pleine largeur ── */}
            <MembershipBannerWidget banner={mockedBanner} />
          </div>
        </main>
      </LivePlayerProvider>
    </div>
  );
}
