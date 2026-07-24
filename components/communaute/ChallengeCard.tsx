"use client";

import { useState } from "react";
import type { ApiChallenge } from "@/lib/api-types";
import { useAuth } from "@/providers/AuthProvider";
import AuthPromptModal from "@/components/ui/AuthPromptModal";
import ChallengeResponseForm from "./ChallengeResponseForm";

function formatCountdown(deadline: string): string {
  if (!deadline) return "";
  const diffMs = new Date(deadline).getTime() - Date.now();
  if (diffMs <= 0) return "Terminé";
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 24) return `${hours} h`;
  const days = Math.floor(hours / 24);
  return `${days} j`;
}

interface Props {
  challenge: ApiChallenge;
  onParticipated?: () => void;
}

export default function ChallengeCard({ challenge, onParticipated }: Props) {
  const { isAuthenticated } = useAuth();
  const [authPrompt, setAuthPrompt] = useState(false);
  const [responding, setResponding] = useState(false);

  // `has_participated` is a proposed field (docs/COMMUNAUTE_BACKEND_REQUIREMENTS.md §3.3), not
  // live yet — undefined is treated as "not participated" so the button still works today.
  const alreadyParticipated = challenge.has_participated === true;

  const handleParticiperClick = () => {
    if (!isAuthenticated) {
      setAuthPrompt(true);
      return;
    }
    setResponding(true);
  };

  // Authenticated + "Participer" clicked → the form takes over this exact card slot (no modal)
  // until it's submitted or cancelled.
  if (responding) {
    return (
      <ChallengeResponseForm
        challengeSlug={challenge.slug}
        challengeTitle={challenge.title}
        onCancel={() => setResponding(false)}
        onSubmitted={() => {
          setResponding(false);
          onParticipated?.();
        }}
      />
    );
  }

  return (
    <article className="relative overflow-hidden rounded-xl bg-[#2a2a1a] border border-accent-yellow/30 p-4 sm:p-5">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 10px, #E6E633 10px, #E6E633 20px)",
        }}
      />
      <div className="relative z-10 flex flex-col gap-3 sm:gap-4">
        <div className="flex justify-between items-start gap-3">
          <h3 className="text-lg sm:text-2xl font-black italic text-white leading-tight uppercase tracking-wide font-display">
            {challenge.title}
          </h3>
          {challenge.deadline && (
            <div className="text-right shrink-0">
              <div className="text-[10px] sm:text-xs text-gray-400 uppercase font-bold tracking-wider">Se termine dans</div>
              <div className="text-base sm:text-xl font-mono text-white font-bold whitespace-nowrap">{formatCountdown(challenge.deadline)}</div>
            </div>
          )}
        </div>

        <div className="bg-black/30 rounded-lg p-3 border border-white/5">
          {/* Full text always visible — no line-clamp — so this reads completely even in the
           * narrow 300px desktop sidebar. */}
          <p className="text-gray-300 text-xs sm:text-sm mb-1 whitespace-pre-line">{challenge.description}</p>
          {challenge.prize && (
            <p className="text-accent-yellow text-xs font-bold mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>workspace_premium</span>
              {challenge.prize}
            </p>
          )}
          <div className="flex items-center gap-1.5 mt-2 text-gray-400 text-xs">
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>group</span>
            {challenge.participant_count} participant{challenge.participant_count > 1 ? "s" : ""}
          </div>
        </div>

        {alreadyParticipated ? (
          <div className="w-full py-2.5 sm:py-3 bg-black/30 border border-accent-yellow/20 text-accent-yellow text-xs sm:text-sm font-bold rounded-lg flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-lg">check_circle</span>
            Vous avez déjà participé à ce défi
          </div>
        ) : (
          <button
            onClick={handleParticiperClick}
            className="w-full py-2.5 sm:py-3 bg-accent-yellow text-black font-bold uppercase tracking-wider text-sm rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
          >
            <span>Participer</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        )}
      </div>

      <AuthPromptModal
        open={authPrompt}
        onClose={() => setAuthPrompt(false)}
        redirectTo="/communaute"
        message="Connectez-vous ou créez un compte pour participer à ce défi : ça ne prend que 2 secondes !"
      />
    </article>
  );
}
