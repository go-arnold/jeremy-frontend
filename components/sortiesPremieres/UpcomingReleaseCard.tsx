import type { UpcomingRelease } from "@/types/sortiesPremieres";

export default function UpcomingReleaseCard({ release }: { release: UpcomingRelease }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Cover with date badge */}
      <div className="relative h-60 w-full rounded-xl overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900">
        {release.coverImage && (
          <img
            alt={release.title}
            className="w-full h-full object-cover"
            src={release.coverImage}
          />
        )}
        <div className="absolute top-4 left-4 bg-white text-background-dark p-2 rounded-lg text-center min-w-[50px] shadow-lg">
          <span className="block text-lg font-black leading-none">{release.day}</span>
          <span className="block text-[10px] font-bold uppercase">{release.month}</span>
        </div>
      </div>

      {/* Info */}
      <div>
        <span className="text-xs font-bold text-primary uppercase tracking-widest">
          {release.format}
        </span>
        <h4 className="text-xl font-bold mb-1">{release.title}</h4>
        <p className="text-sm text-slate-400 mb-4 line-clamp-2">{release.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <span className="material-symbols-outlined text-sm">{release.releaseIcon}</span>
            <span>{release.releaseInfo}</span>
          </div>
          <button className="text-primary text-sm font-bold flex items-center gap-1">
            Détails{" "}
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
