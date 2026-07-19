"use client";

import { useEffect, useState } from "react";
import { shareContent } from "@/lib/share";

export default function ShareArtistButton({ name, slug }: { name: string; slug: string }) {
  const [feedback, setFeedback] = useState<"copied" | "error" | null>(null);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 2200);
    return () => clearTimeout(timer);
  }, [feedback]);

  const handleShare = async () => {
    try {
      const result = await shareContent({
        title: name,
        url: `/artistes/${slug}`,
        text: `Découvrez ${name} sur Art du Kivu`,
      });
      // "shared"/"cancelled" already have their own native UI feedback (the OS share sheet) —
      // only the silent clipboard fallback needs a visible confirmation.
      if (result === "copied") setFeedback("copied");
    } catch {
      setFeedback("error");
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        aria-label="Partager"
        className="flex items-center justify-center size-10 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-white/10 transition-colors"
      >
        <span className="material-symbols-outlined text-xl">share</span>
      </button>

      {feedback && (
        <div className="absolute top-full right-0 mt-2 z-30 whitespace-nowrap px-3 py-1.5 rounded-lg bg-black/85 backdrop-blur-md border border-white/10 text-white text-xs font-bold animate-fade-up">
          {feedback === "copied" ? "Lien copié !" : "Partage indisponible sur cette connexion"}
        </div>
      )}
    </div>
  );
}
