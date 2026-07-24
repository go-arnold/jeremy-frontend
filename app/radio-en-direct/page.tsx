import LivePlayer, { LivePlayerProvider } from "@/components/radio-en-direct/LivePlayer";
import ProgramGrid from "@/components/radio-en-direct/ProgramGrid";
import LiveChat from "@/components/radio-en-direct/LiveChat";
import MembershipBannerWidget from "@/components/radio-en-direct/MembershipBannerWidget";
import { membershipBanner as mockedBanner, programSlots as mockedSlots, liveShow as mockedShow } from "@/data/radio";
import { apiFetch, PaginatedResponse } from "@/lib/api-client";
import { mapApiRadioToRadioProgram } from "@/lib/mappers";
import { fetchRadioChat } from "@/lib/services/radio";
import EmptyState from "@/components/ui/EmptyState";
import type { ApiRadioOrLiveProgram } from "@/lib/api-types";
import type { LiveShow } from "@/types/radio";

async function getCurrentRadio() {
  try {
    const data = await apiFetch<ApiRadioOrLiveProgram>("/api/v1/radio/current/");
    return mapApiRadioToRadioProgram(data);
  } catch {
    // No live radio — return null to show empty state
    return null;
  }
}

async function getRadioPrograms() {
  try {
    const data = await apiFetch<PaginatedResponse<ApiRadioOrLiveProgram> | ApiRadioOrLiveProgram[]>(
      "/api/v1/radio/program/"
    );
    const programs = Array.isArray(data) ? data : data.results;
    return Array.isArray(programs) ? programs.map(mapApiRadioToRadioProgram) : [];
  } catch {
    return [];
  }
}

// LiveShow (LivePlayer's prop type) diverges from the shared radio/live-music mapper shape on a
// few fields (listenerCount as a formatted string, isPlaying vs isLive, imageUrl vs image) —
// adapt rather than cast past the mismatch.
function toLiveShow(program: NonNullable<Awaited<ReturnType<typeof getCurrentRadio>>>): LiveShow {
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
  const liveShow = await getCurrentRadio();
  const programs = await getRadioPrograms();
  const programSlots = programs.length > 0 ? programs : mockedSlots;

  // If no live radio is active, show an empty state
  if (!liveShow) {
    return (
      <div className="min-h-screen">
        <main className="pt-20 max-w-7xl mx-auto px-4 lg:px-8 pb-16 flex flex-col items-center">
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

  return (
    <div className="min-h-screen">
      <LivePlayerProvider show={toLiveShow(liveShow)}>
        <main className="
          /* Mobile : colonne unique, centré */
          pt-20 max-w-md mx-auto px-0

          /* Desktop : pleine largeur, max-w-7xl */
          lg:max-w-7xl lg:mx-auto lg:pt-10 lg:pb-16 lg:px-8
        ">

          {/* ══════════════════════════════════════════
              MOBILE : empilement vertical (inchangé)
          ══════════════════════════════════════════ */}
          <div className="lg:hidden">
            <LivePlayer variant="mobile" />
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
                {liveShow.listenerCount} auditeurs en ligne
              </span>
            </div>

            {/* ── Ligne principale : Player gauche + Sidebar droite ── */}
            <div className="grid grid-cols-[1fr_400px] gap-6 items-start">

              {/* ── Colonne gauche : LivePlayer ── */}
              <LivePlayer variant="desktop" />

              {/* ── Colonne droite : Programme + Chat ── */}
              <div className="flex flex-col gap-5 sticky top-24">
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
