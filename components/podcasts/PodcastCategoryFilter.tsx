"use client";
import type { PodcastCategory } from "@/types/podcasts";

interface Props {
  categories: PodcastCategory[];
  active: PodcastCategory;
  onChange: (cat: PodcastCategory) => void;
}

// Wraps instead of scrolling horizontally — with up to ~9 real categories, a horizontal scroll
// row hid most of them behind a swipe with no visual hint; small text + flex-wrap keeps every
// category readable and reachable in one glance. Controlled by the parent (no local `active`
// state) so it can be reset the same way the city/month filters are on Événements.
export default function PodcastCategoryFilter({ categories, active, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5 px-4 pt-3 pb-1">
      {categories.map((cat, i) => (
        <button
          key={`${cat}-${i}`}
          onClick={() => onChange(cat)}
          className={`flex items-center justify-center rounded-lg px-2.5 py-1.5 transition-all active:scale-95 ${
            active === cat
              ? "bg-primary text-white shadow-md shadow-primary/25 font-bold"
              : "bg-white/5 border border-white/5 text-slate-400 font-medium"
          }`}
        >
          <span className="text-[11px] leading-none">{cat}</span>
        </button>
      ))}
    </div>
  );
}
