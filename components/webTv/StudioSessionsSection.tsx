import Link from "next/link";
import type { StudioSession } from "@/types/webtv";

interface Props {
  sessions: StudioSession[];
}

export default function StudioSessionsSection({ sessions }: Props) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">
          Studio Sessions
        </h2>
        <a className="text-primary text-sm font-bold" href="/studio-sessions">
          Voir tout
        </a>
      </div>

      <div className="flex overflow-x-auto gap-4 px-4 pb-4 no-scrollbar snap-x snap-mandatory">
        {sessions.map((session) => (
          <Link
            key={session.id}
            href={session.href || "#"}
            className="snap-start shrink-0 w-64 flex flex-col px-3 gap-3 group cursor-pointer"
          >
            <div className="relative aspect-video rounded-lg overflow-hidden bg-surface-dark ring-1 ring-white/5">
              {/* Duration badge */}
              <div className="absolute top-2 right-2 z-10 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                {session.duration}
              </div>

              <div
                className="w-full h-full bg-cover bg-center group-hover:opacity-80 transition-opacity"
                data-alt={session.imageAlt}
                style={{ backgroundImage: `url('${session.imageUrl}')` }}
              />

              {/* Play — toujours visible (pas seulement au survol, inutile sur mobile) */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                <span
                  className="material-symbols-outlined text-white drop-shadow-lg"
                  style={{ fontSize: "40px" }}
                >
                  play_circle
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-0.5">
              <h4 className="text-white text-base font-bold leading-tight group-hover:text-primary transition-colors">
                {session.title}
              </h4>
              <p className="text-gray-400 text-xs">
                {session.author} • {session.publishedAt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
