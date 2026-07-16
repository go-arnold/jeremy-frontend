"use client";

import { useState } from "react";

const TABS = [
  { id: "apercu", label: "Aperçu" },
  { id: "activite", label: "Activité" },
];

export default function ProfileTabs() {
  const [active, setActive] = useState("apercu");

  return (
    <div className="p-1 bg-surface-dark rounded-xl flex relative">
      <div
        className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-primary/20 border border-primary/20 rounded-lg pointer-events-none transition-all duration-300"
        style={{ left: active === "apercu" ? "4px" : "calc(50%)" }}
      />
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActive(tab.id)}
          className={`flex-1 py-2 text-sm z-10 text-center transition-colors ${
            active === tab.id
              ? "font-bold text-white"
              : "font-medium text-text-secondary hover:text-white"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
