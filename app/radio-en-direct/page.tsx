import LivePlayer from "@/components/radio-en-direct/LivePlayer";
import ProgramGrid from "@/components/radio-en-direct/ProgramGrid";
import LivePlayerDesktop from "@/components/radio-en-direct/LivePlayerDesktop";
import ProgramGridDesktop from "@/components/radio-en-direct/ProgramGridDesktop";
import LiveChatDesktop from "@/components/radio-en-direct/LiveChatDesktop";
import MembershipBannerWidget from "@/components/radio-en-direct/MembershipBannerWidget";
import { membershipBanner as mockedBanner, programSlots as mockedSlots, liveShow as mockedShow } from "@/data/radio";
import { apiFetch } from "@/lib/api-client";
import { mapApiRadioToRadioProgram } from "@/lib/mappers";
import { fetchRadioChat } from "@/lib/services/radio";
import EmptyState from "@/components/ui/EmptyState";

async function getCurrentRadio() {
  try {
    const data = await apiFetch<any>("/api/v1/radio/current/");
    return mapApiRadioToRadioProgram(data);
  } catch {
    // No live radio — return null to show empty state
    return null;
  }
}

async function getRadioPrograms() {
  try {
    const data = await apiFetch<any>("/api/v1/radio/program/");
    const programs = data.results || data;
    return Array.isArray(programs) ? programs.map(mapApiRadioToRadioProgram) : [];
  } catch {
    return [];
  }
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
            <>
              {/* Mobile */}
              <div className="lg:hidden w-full mt-4">
                <ProgramGrid slots={programSlots as any} />
              </div>
              {/* Desktop */}
              <div className="hidden lg:block w-full mt-4">
                <ProgramGridDesktop slots={programSlots as any} />
              </div>
            </>
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
          <LivePlayer show={liveShow as any} />
          <ProgramGrid slots={programSlots as any} />
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
              {(liveShow as any).listenerCount} auditeurs en ligne
            </span>
          </div>

          {/* ── Ligne principale : Player gauche + Sidebar droite ── */}
          <div className="grid grid-cols-[1fr_400px] gap-6 items-start">

            {/* ── Colonne gauche : LivePlayer ── */}
            <LivePlayerDesktop show={liveShow as any} />

            {/* ── Colonne droite : Programme + Chat ── */}
            <div className="flex flex-col gap-5 sticky top-24">
              <ProgramGridDesktop slots={programSlots as any} />
              <LiveChatDesktop messages={displayChat as any} />
            </div>
          </div>

          {/* ── Membership Banner pleine largeur ── */}
          <MembershipBannerWidget banner={mockedBanner} />
        </div>
      </main>
    </div>
  );
}
