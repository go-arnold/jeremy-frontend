"use client";

import { shareContent } from "@/lib/share";

// No "Sauvegarder" action here — articles have no save/bookmark capability at all
// server-side, only like + comments, so a decorative-but-fake button was removed rather
// than wired to nothing.
export default function ShareWidget({ title, slug }: { title: string; slug: string }) {
  const url = `/blog/${slug}`;

  const actions = [
    {
      icon: "link",
      label: "Copier le lien",
      onClick: async () => {
        await navigator.clipboard.writeText(`${window.location.origin}${url}`);
      },
    },
    {
      icon: "share",
      label: "Partager",
      onClick: () => shareContent({ title, url }),
    },
  ];

  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: "rgba(18,34,60,0.4)", border: "1px solid rgba(255,255,255,0.05)" }}
    >
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8A8178] mb-3">
        Partager cet article
      </p>
      <div className="flex gap-2">
        {actions.map((a) => (
          <button
            key={a.icon}
            onClick={() => a.onClick().catch(() => {})}
            className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border border-white/8 text-[#8A8178] hover:text-[#F0EDE8] hover:border-white/15 transition-all"
            title={a.label}
          >
            <span className="material-symbols-outlined text-lg">{a.icon}</span>
            <span className="text-[9px] font-bold">{a.label.split(" ")[0]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
