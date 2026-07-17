import Link from "next/link";
import type { StudioSession } from "@/types/webtv";

export default function StudioSessionsDesktop({ sessions }: { sessions: StudioSession[] }) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">Studio Sessions</span>
          <div className="kivu-divider w-8" />
        </div>
        <a className="text-primary text-xs font-bold hover:text-[#F0EDE8] transition-colors" href="/studio-sessions">
          Voir tout
        </a>
      </div>

      {/* Grille 2×N */}
      <div className="grid grid-cols-2 gap-4">
        {sessions.map((session) => (
          <Link key={session.id} href={session.href || "#"} className="flex flex-col gap-2 group cursor-pointer">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-surface-dark ring-1 ring-white/5">
              {/* Duration */}
              <div className="absolute top-2 right-2 z-10 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                {session.duration}
              </div>
              <div
                className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: `url('${session.imageUrl}')` }}
              />
              {/* Play — toujours visible */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center text-white shadow-lg">
                  <span className="material-symbols-outlined text-2xl" style={{ marginLeft: "2px" }}>play_arrow</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-white text-sm font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                {session.title}
              </h4>
              <p className="text-gray-400 text-xs mt-0.5">
                {session.author} • {session.publishedAt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}