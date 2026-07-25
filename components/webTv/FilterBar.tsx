"use client";

import { useState } from "react";
import type { FilterTab, VideoCategory } from "@/types/webtv";

const LABEL_TO_ID: Record<string, string> = {
  Freestyles: "freestyles",
  "Studio Sessions": "studio-sessions",
  Docs: "docs",
  Interviews: "interviews",
  Concerts: "concerts",
};

const LABEL_TO_ICON: Record<string, string> = {
  All: "apps",
  Freestyles: "mic_external_on",
  "Studio Sessions": "graphic_eq",
  Docs: "movie",
  Interviews: "mic",
  Concerts: "music_note",
};

interface Props {
  tabs: FilterTab[];
}

export default function FilterBar({ tabs }: Props) {
  const [activeLabel, setActiveLabel] = useState<VideoCategory | undefined>(
    () => tabs.find((t) => t.active)?.label || tabs[0]?.label
  );

  // Smooth-scrolls to the matching section instead of a raw hash-jump — `scrollIntoView` honors
  // each target's `scroll-mt-*` (see WebTVPageClient.tsx), so the fixed header + this sticky bar
  // never end up covering the section's heading the way a native `#anchor` jump did.
  //
  // The mobile and desktop layouts are both mounted at once (toggled with `lg:hidden`/
  // `hidden lg:flex`, not conditional rendering) and each has its own element with the same id
  // for a given section — `getElementById` always returns the first (mobile) one regardless of
  // which breakpoint is actually visible, so on desktop it was silently scrolling to a
  // `display:none` element. Picking the one that's actually rendered (`offsetParent !== null`)
  // fixes that.
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, label: VideoCategory) => {
    e.preventDefault();
    setActiveLabel(label);
    const id = LABEL_TO_ID[label] || "top";
    const candidates = document.querySelectorAll<HTMLElement>(`#${CSS.escape(id)}`);
    const target = Array.from(candidates).find((el) => el.offsetParent !== null) || candidates[0];
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const getHref = (label: string) => `#${LABEL_TO_ID[label] || "top"}`;

  return (
    <div className="sticky top-[64px] z-30 border-b border-white/5">
      {/* ── MOBILE : chips scrollables ── */}
      <div className="lg:hidden py-2 pl-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pr-4">
          {tabs.map((tab) => {
            const isActive = tab.label === activeLabel;
            return (
              <a
                key={tab.label}
                href={getHref(tab.label)}
                onClick={(e) => handleClick(e, tab.label)}
                className={
                  isActive
                    ? "flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-full bg-primary text-white px-3.5 shadow-[0_0_16px_rgba(230,48,18,0.4)] transition-transform active:scale-95"
                    : "flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-full bg-surface-dark border border-white/10 px-3.5 transition-all active:scale-95 hover:border-primary/50"
                }
              >
                <span className={`material-symbols-outlined text-sm ${isActive ? "" : "text-[#8A8178]"}`}>
                  {LABEL_TO_ICON[tab.label] || "label"}
                </span>
                <p className={isActive ? "text-xs font-bold" : "text-gray-300 text-xs font-medium"}>
                  {tab.label}
                </p>
              </a>
            );
          })}
        </div>
      </div>

      {/* ── DESKTOP : tabs pleine largeur centrées ── */}
      <div className="hidden lg:flex items-center mx-auto px-8">
        {tabs.map((tab) => {
          const isActive = tab.label === activeLabel;
          return (
            <a
              key={tab.label}
              href={getHref(tab.label)}
              onClick={(e) => handleClick(e, tab.label)}
              className={`relative flex items-center gap-2 px-5 py-4 text-sm font-bold transition-all duration-200 whitespace-nowrap ${
                isActive ? "text-white" : "text-[#8A8178] hover:text-[#F0EDE8]"
              }`}
            >
              <span className={`material-symbols-outlined text-lg ${isActive ? "text-primary" : ""}`}>
                {LABEL_TO_ICON[tab.label] || "label"}
              </span>
              {tab.label}
              {/* Indicator bas */}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}
