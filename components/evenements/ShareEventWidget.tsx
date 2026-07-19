"use client";

import { useState } from "react";
import { resolveShareUrl } from "@/lib/share";
import ShareMenu from "@/components/ui/ShareMenu";

// No "Sauver" action here — events have no save/bookmark capability at all server-side
// (no EngagementActionsMixin on Event, only `register`) — dropped rather than wired to nothing.
export default function ShareEventWidget({ title, slug }: { title: string; slug: string }) {
  const url = `/evenements/${slug}`;
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text: `Découvrez ${title} sur Art du Kivu`, url: resolveShareUrl(url) });
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        // fall through to the manual menu on any other native-share failure
      }
    }
    setShareMenuOpen(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resolveShareUrl(url));
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard unavailable (insecure context) — "Partager" above still works.
    }
  };

  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: "rgba(18,34,60,0.4)", border: "1px solid rgba(255,255,255,0.05)" }}
    >
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8A8178] mb-3">
        Partager
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border border-white/8 text-[#8A8178] hover:text-[#F0EDE8] hover:border-white/15 transition-all"
        >
          <span className="material-symbols-outlined text-lg">{copied ? "check" : "link"}</span>
          <span className="text-[9px] font-bold">{copied ? "Copié !" : "Copier"}</span>
        </button>
        <button
          onClick={handleShare}
          className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border border-white/8 text-[#8A8178] hover:text-[#F0EDE8] hover:border-white/15 transition-all"
        >
          <span className="material-symbols-outlined text-lg">share</span>
          <span className="text-[9px] font-bold">Partager</span>
        </button>
      </div>

      <ShareMenu
        open={shareMenuOpen}
        onClose={() => setShareMenuOpen(false)}
        url={url}
        text={`Découvrez ${title} sur Art du Kivu`}
      />
    </div>
  );
}
