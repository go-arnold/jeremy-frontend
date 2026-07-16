"use client";
import { useState } from "react";
import type { PodcastCategory } from "@/types/podcasts";

interface Props {
  categories: PodcastCategory[];
  onChange?: (cat: PodcastCategory) => void;
}

export default function PodcastCategoryFilter({ categories, onChange }: Props) {
  const [active, setActive] = useState<PodcastCategory>("Tout");

  function select(cat: PodcastCategory) {
    setActive(cat);
    onChange?.(cat);
  }

  return (
    <div className="flex gap-3 p-4 overflow-x-auto no-scrollbar">
      {categories.map((cat, i) => (
        <button
          key={`${cat}-${i}`}
          onClick={() => select(cat)}
          className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl px-5 transition-all active:scale-95 ${
            active === cat
              ? "bg-primary text-white shadow-lg shadow-primary/25"
              : "bg-white/5 border border-white/5 text-slate-400 text-sm font-medium"
          }`}
        >
          <p className={`text-sm leading-normal ${active === cat ? "font-bold" : "font-medium"}`}>
            {cat}
          </p>
        </button>
      ))}
    </div>
  );
}
