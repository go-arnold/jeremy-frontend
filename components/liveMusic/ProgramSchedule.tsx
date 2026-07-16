import type { ProgramSlot } from "@/types/liveMusic";

function ProgramSlotCard({ slot }: { slot: ProgramSlot }) {
  const isOnAir = slot.status === "on-air";

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`font-mono text-sm font-bold ${
            isOnAir ? "text-primary" : "text-white/60"
          }`}
        >
          {slot.time}
        </span>
        <div className={`h-px flex-1 ${isOnAir ? "bg-primary opacity-50" : "bg-white/10"}`} />
      </div>

      <div
        className={`p-5 rounded-2xl relative overflow-hidden group h-[140px] flex flex-col justify-center transition-colors ${
          isOnAir
            ? "bg-gradient-to-br from-[#19223ce6] to-[#230f13] border-l-4 border-primary shadow-lg"
            : "bg-[#19223ce6] hover:bg-[#11223ce6] border border-white/5"
        }`}
      >
        <div className={`relative z-10 ${!isOnAir ? "opacity-70 group-hover:opacity-100 transition-opacity" : ""}`}>
          <span
            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mb-2 border ${
              isOnAir
                ? "bg-primary/20 text-primary border-primary/20"
                : "bg-white/5 text-white/60 border-white/10"
            }`}
          >
            {isOnAir ? "EN ONDE" : "À VENIR"}
          </span>
          <h4 className="font-bold text-white text-xl leading-none mb-1">{slot.title}</h4>
          <p className="text-text-secondary text-xs">{slot.subtitle}</p>
        </div>

        <span
          className={`material-symbols-outlined absolute -right-2 -bottom-4 text-[80px] text-white/5 rotate-12 transition-transform duration-500 ${
            isOnAir ? "group-hover:rotate-0" : "group-hover:-rotate-12"
          }`}
        >
          {slot.icon}
        </span>
      </div>
    </div>
  );
}

export default function ProgramSchedule({ slots }: { slots: ProgramSlot[] }) {
  return (
    <div className="pt-6 pb-4">
      <div className="px-6 mb-4 flex justify-between items-end">
        <div>
          <h3 className="text-lg font-bold text-white uppercase tracking-wide">Programme</h3>
          <p className="text-text-secondary text-xs mt-1">Grille du jour</p>
        </div>
        <button className="text-accent-blue text-xs font-bold hover:text-white transition-colors">
          Voir la grille complète
        </button>
      </div>

      <div className="grid gap-4 px-6 pb-4">
        {slots.map((slot) => (
          <ProgramSlotCard key={slot.id} slot={slot} />
        ))}
      </div>
    </div>
  );
}
