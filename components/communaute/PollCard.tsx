"use client";

import { useState } from "react";
import type { ApiPoll } from "@/types/communaute";
import { useAuth } from "@/providers/AuthProvider";
import { voteOnPoll } from "@/lib/services/community";

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function PollCard({ poll: initialPoll }: { poll: ApiPoll }) {
  const { isAuthenticated } = useAuth();
  const [poll, setPoll] = useState(initialPoll);
  const [voted, setVoted] = useState(false);
  const [voting, setVoting] = useState(false);
  const [authPrompt, setAuthPrompt] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const leadingId = poll.options.reduce(
    (leader, o) => (o.percentage > leader.percentage ? o : leader),
    poll.options[0]
  )?.id;

  const handleVote = async (optionId: number) => {
    if (!isAuthenticated) {
      setAuthPrompt(true);
      return;
    }
    if (voted || voting) return;
    setAuthPrompt(false);
    setError(null);
    setVoting(true);
    try {
      const updated = await voteOnPoll(poll.id, optionId);
      setPoll(updated);
      setVoted(true);
    } catch (err) {
      // "Vous avez déjà voté à ce sondage." also means voting is now locked for this session.
      setVoted(true);
      setError((err instanceof Error ? err.message : null) || "Vote impossible.");
    } finally {
      setVoting(false);
    }
  };

  return (
    <article className="bg-surface-dark rounded-xl p-5 border border-white/5">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined">bar_chart</span>
          <span className="text-xs font-bold uppercase tracking-wider">Sondage</span>
        </div>
        <span className="text-gray-500 text-xs">{formatCount(poll.vote_count)} votes</span>
      </div>

      <h4 className="text-white font-bold text-lg mb-4">{poll.question}</h4>

      <div className="space-y-3">
        {poll.options.map((option) => (
          <div key={option.id} className="relative">
            <div className="flex items-center justify-between mb-1 text-sm z-10 relative px-1">
              <span className="text-white font-medium">{option.text}</span>
              <span className={`font-bold ${option.id === leadingId ? "text-primary" : "text-gray-400"}`}>
                {option.percentage}%
              </span>
            </div>
            <div className="h-10 w-full bg-black/50 rounded-lg overflow-hidden relative">
              <div
                className={`absolute top-0 left-0 h-full rounded-lg transition-all ${
                  option.id === leadingId ? "bg-primary/20 border-r-2 border-primary" : "bg-white/5"
                }`}
                style={{ width: `${option.percentage}%` }}
              />
              <button
                onClick={() => handleVote(option.id)}
                disabled={voted || voting}
                className="absolute inset-0 w-full h-full flex items-center px-4 text-left focus:outline-none disabled:cursor-default"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        {authPrompt && <p className="text-xs text-primary">Connectez-vous pour voter.</p>}
        {error && <p className="text-xs text-gray-400">{error}</p>}
        {!authPrompt && !error && (
          <p className="text-xs text-gray-500">
            {voted ? "Merci pour votre vote !" : "Cliquez sur une option pour voter"}
          </p>
        )}
      </div>
    </article>
  );
}
