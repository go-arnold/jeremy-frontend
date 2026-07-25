"use client";

export interface FilterTab {
  id: string;
  label: string;
}

interface FilterTabsProps {
  tabs: FilterTab[];
  active: string;
  onChange: (id: string) => void;
}

const TAB_ICON: Record<string, string> = {
  tous: "apps",
  talent: "music_note",
  challenge: "emoji_events",
  poll: "bar_chart",
};

export default function FilterTabs({ tabs, active, onChange }: FilterTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar p-1 rounded-2xl bg-black/20 border border-white/5 w-fit">
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap px-3 py-1.5 lg:px-4 lg:py-2 rounded-xl text-xs lg:text-sm font-bold transition-all ${
              isActive
                ? "bg-primary text-white shadow-[0_0_16px_rgba(230,48,18,0.4)]"
                : "text-[#8A8178] hover:text-[#F0EDE8] hover:bg-white/5"
            }`}
          >
            <span className="material-symbols-outlined text-sm lg:text-base">{TAB_ICON[tab.id] || "label"}</span>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
