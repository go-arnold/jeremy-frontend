"use client";

import { useState } from "react";
import { getShareLinks, resolveShareUrl } from "@/lib/share";

interface Props {
  open: boolean;
  onClose: () => void;
  url: string;
  text: string;
}

const PLATFORM_STYLE: Record<string, { icon: string; bg: string }> = {
  WhatsApp: { icon: "chat", bg: "#25D366" },
  Facebook: { icon: "thumb_up", bg: "#1877F2" },
  "X (Twitter)": { icon: "tag", bg: "#000000" },
  Telegram: { icon: "send", bg: "#26A5E4" },
};

/** Manual share fallback for when `navigator.share` isn't available (mostly desktop) — offers
 * the same external destinations a native OS share sheet would, instead of silently copying the
 * link with no other option.
 *
 * This is the approved share UI going forward — approved 2026-07-19 to be reused on every other
 * share button across the app as they come up (see `EngagementBar` for the reference wiring:
 * native `navigator.share` first, this menu as the fallback), not just Communauté. */
export default function ShareMenu({ open, onClose, url, text }: Props) {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const links = getShareLinks(url, text);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resolveShareUrl(url));
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        onClose();
      }, 1200);
    } catch {
      // Clipboard unavailable (insecure context) — the platform links above still work.
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-xs rounded-2xl p-5 flex flex-col gap-3 animate-fade-up"
        style={{ background: "rgba(18,34,60,0.98)", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <div className="flex items-center justify-between">
          <p className="text-[#F0EDE8] text-sm font-bold">Partager via</p>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {links.map((link) => {
            const style = PLATFORM_STYLE[link.label];
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white text-xs font-bold"
              >
                <span
                  className="material-symbols-outlined text-white text-sm rounded-full p-1"
                  style={{ background: style?.bg || "#666" }}
                >
                  {style?.icon || "share"}
                </span>
                {link.label}
              </a>
            );
          })}
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 h-10 rounded-xl border border-white/10 text-[#8A8178] text-xs font-bold hover:bg-white/5 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">{copied ? "check" : "link"}</span>
          {copied ? "Lien copié !" : "Copier le lien"}
        </button>
      </div>
    </div>
  );
}
