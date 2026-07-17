import Link from "next/link";
import type { EmissionCard as EmissionCardType } from "@/types/emissions";

function formatScheduledAt(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_LABELS: Record<string, string> = {
  live: "En direct",
  scheduled: "Programmé",
  recorded: "Enregistré",
};

export default function EmissionCard({ emission }: { emission: EmissionCardType }) {
  return (
    <Link
      href={emission.href}
      className="group flex flex-col rounded-2xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-300"
      style={{ background: "rgba(18,34,60,0.5)" }}
    >
      <div className="relative aspect-video overflow-hidden bg-black">
        {emission.coverImage && (
          <img
            alt={emission.title}
            src={emission.coverImage}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div
          className={`absolute top-3 left-3 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg ${
            emission.isLive ? "bg-primary" : "bg-black/70 backdrop-blur-sm"
          }`}
        >
          {emission.isLive && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
          )}
          <span className="text-[10px] font-black uppercase text-white tracking-widest">
            {STATUS_LABELS[emission.status] || emission.status}
          </span>
        </div>
        {emission.isLive && emission.viewerCount > 0 && (
          <div className="absolute top-3 right-3 bg-black/70 px-2 py-1 rounded-lg flex items-center gap-1">
            <span className="material-symbols-outlined text-white text-xs">visibility</span>
            <span className="text-white text-[10px] font-bold">{emission.viewerCount}</span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="text-[#F0EDE8] font-bold text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {emission.title}
        </h3>
        <div className="flex items-center gap-1.5 text-[#8A8178] text-xs mt-auto pt-2 border-t border-white/5">
          <span className="material-symbols-outlined text-xs">
            {emission.status === "scheduled" ? "schedule" : "calendar_today"}
          </span>
          <span>
            {emission.status === "scheduled" && emission.scheduledAt
              ? formatScheduledAt(emission.scheduledAt)
              : `${emission.durationMinutes} min`}
          </span>
        </div>
      </div>
    </Link>
  );
}
