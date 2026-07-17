import type { FilterTab } from "@/types/webtv";

interface Props {
  tabs: FilterTab[];
}

export default function FilterBar({ tabs }: Props) {
  const getHref = (label: string) => {
    switch (label) {
      case "Freestyles": return "#freestyles";
      case "Studio Sessions": return "#studio-sessions";
      case "Docs": return "#docs";
      case "Interviews": return "#interviews";
      case "Concerts": return "#concerts";
      default: return "#top";
    }
  };

  return (
    <div className="sticky top-[64px] z-30 backdrop-blur-sm border-b border-white/5"
      style={{ background: "rgba(18,34,60,0.7)" }}
    >
      {/* ── MOBILE : chips scrollables ── */}
      <div className="lg:hidden pb-4 pl-4 pt-3">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pr-4">
          {tabs.map((tab) => (
            <a
              key={tab.label}
              href={getHref(tab.label)}
              className={
                tab.active
                  ? "flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white text-background-dark px-5 transition-transform active:scale-95"
                  : "flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-surface-dark border border-white/10 px-5 transition-all active:scale-95 hover:border-primary/50"
              }
            >
              <p className={tab.active ? "text-sm font-bold" : "text-gray-300 text-sm font-medium"}>
                {tab.label}
              </p>
            </a>
          ))}
        </div>
      </div>

      {/* ── DESKTOP : tabs pleine largeur centrées ── */}
      <div className="hidden lg:flex items-center max-w-7xl mx-auto px-8">
        {tabs.map((tab) => (
          <a
            key={tab.label}
            href={getHref(tab.label)}
            className={`relative px-5 py-4 text-sm font-bold transition-all duration-200 whitespace-nowrap ${
              tab.active
                ? "text-white"
                : "text-[#8A8178] hover:text-[#F0EDE8]"
            }`}
          >
            {tab.label}
            {/* Indicator bas */}
            {tab.active && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
