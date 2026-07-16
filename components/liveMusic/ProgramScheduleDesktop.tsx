import type {ProgramSlot } from "@/types/liveMusic";


export default function ProgramScheduleDesktop({ slots }: { slots: ProgramSlot[] }) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: "rgba(18,34,60,0.6)", border: "1px solid rgba(230,48,18,0.1)" }}
    >
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">schedule</span>
            Programme
          </h3>
          <p className="text-[#8A8178] text-xs mt-1">Grille du jour</p>
        </div>
        <button className="text-primary text-xs font-bold hover:text-white transition-colors">
          Voir la grille complète
        </button>
      </div>

      {/* Slots en liste verticale mais avec plus d'espace */}
      <div className="flex flex-col gap-4">
        {slots.map((slot) => {
          const isOnAir = slot.status === "on-air";
          return (
            <div key={slot.id}>
              {/* Timeline marker */}
              <div className="flex items-center gap-3 mb-2">
                <span className={`font-mono text-sm font-bold min-w-[48px] ${isOnAir ? "text-primary" : "text-white/40"}`}>
                  {slot.time}
                </span>
                {isOnAir && (
                  <span className="flex h-2 w-2 relative shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                )}
                <div className={`h-px flex-1 ${isOnAir ? "bg-primary/50" : "bg-white/10"}`} />
              </div>

              {/* Card horizontale sur desktop */}
              <div
                className={`flex items-center gap-5 p-5 rounded-2xl relative overflow-hidden group transition-all ${
                  isOnAir
                    ? "border-l-4 border-primary shadow-lg"
                    : "border border-white/5 hover:border-white/10"
                }`}
                style={{
                  background: isOnAir
                    ? "linear-gradient(135deg, rgba(230,48,18,0.1), rgba(18,34,60,0.8))"
                    : "rgba(255,255,255,0.03)",
                }}
              >
                {/* Icône */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${isOnAir ? "bg-primary/20" : "bg-white/5"}`}>
                  <span
                    className={`material-symbols-outlined text-3xl ${isOnAir ? "text-primary" : "text-white/30"}`}
                    style={{ fontVariationSettings: isOnAir ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {slot.icon}
                  </span>
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${
                      isOnAir
                        ? "bg-primary/20 text-primary border-primary/20"
                        : "bg-white/5 text-white/40 border-white/10"
                    }`}>
                      {isOnAir ? "EN ONDE" : "À VENIR"}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-lg leading-none mb-1">{slot.title}</h4>
                  <p className="text-[#8A8178] text-sm">{slot.subtitle}</p>
                </div>

                {/* Action */}
                <div className="shrink-0">
                  {isOnAir ? (
                    <div className="flex items-center gap-2 text-primary">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                      <span className="text-xs font-black uppercase">En direct</span>
                    </div>
                  ) : (
                    <button className="px-4 py-2 rounded-xl border border-white/10 text-xs font-bold text-[#8A8178] hover:border-primary/40 hover:text-primary transition-all">
                      + Rappel
                    </button>
                  )}
                </div>

                {/* Icône déco en fond */}
                <span className="material-symbols-outlined absolute -right-2 -bottom-4 text-[80px] text-white/3 rotate-12 group-hover:rotate-0 transition-transform duration-500 pointer-events-none">
                  {slot.icon}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}