"use client";
import { useState } from "react";

export interface FilterTab {
  id: string;
  label: string;
}

interface FilterTabsProps {
  tabs: FilterTab[];
  active: string;
  onChange: (id: string) => void;
}

export default function FilterTabs({ tabs, active, onChange }: FilterTabsProps) {
  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            active === tab.id
              ? "bg-white text-black font-bold shadow-md"
              : "bg-surface-dark border border-white/10 text-white hover:bg-white/10"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
