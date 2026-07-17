"use client";

import { useState } from "react";
import type { ApiChallenge } from "@/types/communaute";
import { useAuth } from "@/providers/AuthProvider";
import { joinChallenge } from "@/lib/services/community";

function formatCountdown(deadline: string): string {
  if (!deadline) return "";
  const diffMs = new Date(deadline).getTime() - Date.now();
  if (diffMs <= 0) return "Terminé";
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 24) return `${hours} h`;
  const days = Math.floor(hours / 24);
  return `${days} j`;
}

export default function ChallengeCard({ challenge }: { challenge: ApiChallenge }) {
  const { isAuthenticated } = useAuth();
  const [joined, setJoined] = useState(false);
  const [joining, setJoining] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [authPrompt, setAuthPrompt] = useState(false);

  const handleJoin = async () => {
    if (!isAuthenticated) {
      setAuthPrompt(true);
      return;
    }
    setAuthPrompt(false);
    setJoining(true);
    setMessage(null);
    try {
      const result = await joinChallenge(challenge.slug);
      setJoined(true);
      setMessage(result.detail);
    } catch (err: any) {
      // Backend returns "Vous participez déjà à ce défi." as the error message when already
      // joined — still a terminal "you're in" state from the user's perspective, not a failure.
      setJoined(true);
      setMessage(err.message || "Participation enregistrée.");
    } finally {
      setJoining(false);
    }
  };

  return (
    <article className="relative overflow-hidden rounded-xl bg-[#2a2a1a] border border-accent-yellow/30 p-5">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 10px, #E6E633 10px, #E6E633 20px)",
        }}
      />
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex justify-between items-start gap-3">
          <h3 className="text-2xl font-black italic text-white leading-tight uppercase tracking-wide font-display">
            {challenge.title}
          </h3>
          {challenge.deadline && (
            <div className="text-right shrink-0">
              <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Se termine dans</div>
              <div className="text-xl font-mono text-white font-bold">{formatCountdown(challenge.deadline)}</div>
            </div>
          )}
        </div>

        <div className="bg-black/30 rounded-lg p-3 border border-white/5">
          <p className="text-gray-300 text-sm mb-1 line-clamp-3">{challenge.description}</p>
          {challenge.prize && (
            <p className="text-accent-yellow text-xs font-bold mt-2">🏆 {challenge.prize}</p>
          )}
          <div className="flex items-center gap-1.5 mt-2 text-gray-400 text-xs">
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>group</span>
            {challenge.participant_count} participant{challenge.participant_count > 1 ? "s" : ""}
          </div>
        </div>

        {authPrompt && (
          <p className="text-xs text-accent-yellow">Connectez-vous pour participer à ce défi.</p>
        )}
        {message && <p className="text-xs text-gray-300">{message}</p>}

        <button
          onClick={handleJoin}
          disabled={joining || joined}
          className="w-full py-3 bg-accent-yellow text-black font-bold uppercase tracking-wider rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <span>{joined ? "Vous participez" : joining ? "Envoi..." : "Participer"}</span>
          {!joined && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
        </button>
      </div>
    </article>
  );
}
