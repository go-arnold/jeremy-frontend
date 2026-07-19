"use client";

import { useEffect, useRef, useState } from "react";

export interface MonthOption {
  key: string;
  label: string;
}

interface Props {
  months: MonthOption[];
  value: string;
  onChange: (value: string) => void;
  /** "sm" is used where the filter needs to stay compact next to the featured event card
   * (mobile) — otherwise defaults to the slightly larger desktop sizing. */
  size?: "sm" | "md";
}

/** Replaces the previously hardcoded "Février 2026" button — a real dropdown driven by the
 * months actually present in the loaded events. A native `<select>`'s open dropdown is rendered
 * by the OS/browser chrome and ignores almost all CSS (always white on most platforms), so this
 * is a custom button + listbox instead, fully styled to match the page's dark/teal palette. */
export default function MonthFilter({ months, value, onChange, size = "md" }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  if (months.length === 0) return null;

  const isSmall = size === "sm";
  const activeLabel = months.find((m) => m.key === value)?.label || "Tous les mois";

  const select = (key: string) => {
    onChange(key);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 rounded-xl bg-surface-dark border transition-colors ${
          open ? "border-primary/50" : "border-white/10"
        } text-white font-bold hover:bg-white/5 ${isSmall ? "py-1.5 px-3 text-xs" : "py-2 px-4 text-sm"}`}
      >
        <span className={`material-symbols-outlined text-primary ${isSmall ? "text-[16px]" : "text-[18px]"}`}>
          calendar_month
        </span>
        <span className="whitespace-nowrap">{activeLabel}</span>
        <span
          className={`material-symbols-outlined text-gray-400 transition-transform ${isSmall ? "text-[16px]" : "text-[18px]"} ${
            open ? "rotate-180" : ""
          }`}
        >
          expand_more
        </span>
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-2 z-50 min-w-[10rem] rounded-xl border border-white/10 shadow-2xl overflow-hidden py-1"
          style={{ background: "#0e1a2e" }}
        >
          <button
            type="button"
            onClick={() => select("")}
            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
              value === "" ? "text-primary font-bold bg-primary/10" : "text-gray-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            Tous les mois
          </button>
          {months.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => select(m.key)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors capitalize ${
                value === m.key ? "text-primary font-bold bg-primary/10" : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
