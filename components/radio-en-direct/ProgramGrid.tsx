import type { ProgramSlot } from "@/types/radio";

interface Props {
  slots: ProgramSlot[];
}

const STATUS_CONFIG: Record<
  ProgramSlot["status"],
  { label: string; color: string; bg: string; border: string; showBar: boolean }
> = {
  now: {
    label: "En cours",
    color: "#ac2e1b",
    bg: "rgba(230,48,18,0.09)",
    border: "rgba(255,255,255,0.05)",
    showBar: true,
  },
  next: {
    label: "Prochain",
    color: "#F0EDE8",
    bg: "rgba(255,255,255,0.03)",
    border: "rgba(255,255,255,0.05)",
    showBar: false,
  },
  later: {
    label: "Later",
    color: "#8A8178",
    bg: "transparent",
    border: "rgba(255,255,255,0.04)",
    showBar: false,
  },
};

export default function ProgramGrid({ slots }: Props) {
  return (
    <section className="mt-5">
      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-3">
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-primary"
            style={{ fontSize: "18px" }}
          >
            schedule
          </span>
          <h3 className="text-white text-sm font-black uppercase tracking-wider">
            Programme
          </h3>
        </div>
        <button className="text-primary text-xs font-bold uppercase tracking-widest">
          Voir tout
        </button>
      </div>

      {/* Liste verticale */}
      <div
        className="mx-4 rounded-2xl overflow-hidden"
        style={{
          background: "rgba(13,35,76,0.55)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {slots.map((slot, idx) => {
          const statusKey = (slot.status || 'later') as keyof typeof STATUS_CONFIG;
          const cfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG.later;
          const isNow = statusKey === "now";
          const isLast = idx === slots.length - 1;

          return (
            <div
              key={slot.id}
              className="relative flex items-center gap-3 px-4 py-3"
              style={{
                background: cfg.bg,
                borderBottom: isLast ? "none" : `1px solid ${cfg.border}`,
              }}
            >
              {/* Barre latérale rouge pour "now" */}
              {cfg.showBar && (
                <div
                  className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-primary"
                />
              )}

              {/* Heure */}
              <div className="shrink-0 w-[46px]">
                <span
                  className="text-xs font-bold font-mono"
                  style={{ color: isNow ? "#E63012" : "#8A8178" }}
                >
                  {slot.time}
                </span>
              </div>

              {/* Titre + host */}
              <div className="flex-1 min-w-0">
                <h4
                  className="text-sm font-extrabold leading-tight truncate"
                  style={{ color: isNow ? "#F0EDE8" : "#D4D0CB" }}
                >
                  {slot.title}
                </h4>
                <p className="text-[11px] text-white/40 font-medium truncate mt-0.5">
                  {slot.host}
                </p>
              </div>

              {/* Badge status / action */}
              <div className="shrink-0">
                {isNow ? (
                  <div className="flex items-center gap-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                    </span>
                    <span className="text-[10px] font-extrabold uppercase text-primary">
                      Live
                    </span>
                  </div>
                ) : (
                  <button
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all"
                    style={{
                      border: "1px solid rgba(255,255,255,0.10)",
                      color: "#8A8178",
                    }}
                  >
                    Rappel
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
