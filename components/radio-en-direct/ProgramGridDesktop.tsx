import type { ProgramSlot } from "@/types/radio";

const STATUS_LABELS: Record<ProgramSlot["status"], string> = {
  now: "En cours",
  next: "Prochain",
  later: "Plus tard",
};

export default function ProgramGridDesktop({ slots }: { slots: ProgramSlot[] }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "rgba(13, 35, 76, 0.6)", border: "1px solid rgba(230,48,18,0.12)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#F0EDE8] text-base font-black tracking-tight uppercase flex items-center gap-2">
          <span className="material-symbols-outlined text-[#E63012] text-lg">schedule</span>
          Programme
        </h3>
        <button className="text-[#E63012] text-xs font-bold uppercase tracking-widest hover:text-[#F0EDE8] transition-colors">
          Voir tout
        </button>
      </div>

      {/* Grille 2 colonnes */}
      <div className="grid grid-cols-2 gap-3">
        {slots.map((slot) => {
          const isNow = slot.status === "now";
          return (
            <div
              key={slot.id}
              className={`rounded-xl p-4 flex flex-col gap-2 transition-all ${
                isNow
                  ? "border border-[#E63012]/40"
                  : "border border-white/5 hover:border-white/10"
              }`}
              style={{
                background: isNow
                  ? "rgba(230,48,18,0.12)"
                  : "rgba(255,255,255,0.03)",
              }}
            >
              <div className="flex justify-between items-center">
                <span className={`text-[10px] font-black tracking-widest uppercase ${isNow ? "text-[#E63012]" : "text-[#8A8178]"}`}>
                  {STATUS_LABELS[slot.status]}
                </span>
                <span className="text-[10px] font-medium text-[#8A8178]">{slot.time}</span>
              </div>
              <h4 className="font-extrabold text-sm text-[#F0EDE8] leading-tight">{slot.title}</h4>
              <p className="text-xs text-[#8A8178]">{slot.host}</p>
              <div className="mt-1">
                {isNow ? (
                  <div className="flex items-center gap-1 text-[#E63012]">
                    <span className="material-symbols-outlined !text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                    <span className="text-[10px] font-black uppercase">En direct</span>
                  </div>
                ) : (
                  <button className="w-full py-1.5 rounded-lg text-[10px] font-bold uppercase text-[#8A8178] hover:text-[#F0EDE8] transition-colors border border-white/10 hover:border-white/20">
                    Rappel
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}