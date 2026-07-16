import Link from "next/link";
import type { DocVideo } from "@/types/webtv";


export default function DocsSectionDesktop({ docs }: { docs: DocVideo[] }) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-primary">movie</span>
        <h2 className="text-white text-xl font-bold tracking-tight">Documentaires</h2>
        <div className="kivu-divider flex-1" />
        <a className="text-primary text-xs font-bold hover:text-[#F0EDE8] transition-colors" href="/documentaires">
          Voir tout
        </a>
      </div>

      {/* Grille 3 colonnes */}
      <div className="grid grid-cols-3 gap-5">
        {docs.map((doc) => (
          <Link
            key={doc.id}
            href={doc.href || "#"}
            className="flex flex-col rounded-xl overflow-hidden bg-surface-dark ring-1 ring-white/5 group cursor-pointer"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden">
              <div
                className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: `url('${doc.imageUrl}')` }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-white text-3xl" style={{ marginLeft: "3px" }}>
                    play_arrow
                  </span>
                </div>
              </div>
              {/* Duration + tag */}
              <div className="absolute bottom-2 right-2 bg-black/70 px-1.5 py-0.5 rounded text-[10px] text-white font-bold">
                {doc.duration}
              </div>
              <div className="absolute top-2 left-2 bg-primary/90 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                {doc.tag}
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-2 p-4 flex-1">
              <h3 className="text-white font-bold text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                {doc.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 flex-1">
                {doc.description}
              </p>
              <span className="text-gray-500 text-xs mt-auto">{doc.date}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
