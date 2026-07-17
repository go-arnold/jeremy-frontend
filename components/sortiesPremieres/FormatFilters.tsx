"use client";

import type { FormatFilter, ReleaseFormat } from "@/types/sortiesPremieres";

interface Props {
  filters: FormatFilter[];
  active: ReleaseFormat;
  onChange: (format: ReleaseFormat) => void;
}

export default function FormatFilters({ filters, active, onChange }: Props) {
  return (
    <div className="mb-8">
      <h3 className="text-xs uppercase tracking-widest font-bold text-primary mb-4">
        Filtrer par format
      </h3>
      <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-4 px-4">
        {filters.map((f) => {
          const isActive = active === f.id;
          return (
            <button
              key={f.id}
              onClick={() => onChange(f.id)}
              className={`flex h-10 shrink-0 items-center justify-center rounded-xl px-6 transition-colors ${
                isActive
                  ? "bg-primary"
                  : "bg-deep-slate border border-white/5 hover:bg-white/5"
              }`}
            >
              <p className={`text-sm font-${isActive ? "bold" : "medium"} ${isActive ? "text-white" : "text-white/70"}`}>
                {f.label}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
