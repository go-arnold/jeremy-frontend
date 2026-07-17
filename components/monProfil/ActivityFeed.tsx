import Link from "next/link";
import ContentImage from "@/components/ui/ContentImage";
import type { ActivityEntry } from "@/types/monProfil";

export default function ActivityFeed({ items }: { items: ActivityEntry[] }) {
  if (items.length === 0) return null;

  return (
    <section className="glass-card rounded-2xl p-5 flex flex-col gap-4">
      <h3 className="text-lg font-bold flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-xl">bolt</span>
        Activité
      </h3>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.targetHref}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors"
          >
            <span
              className={`material-symbols-outlined text-lg shrink-0 ${
                item.action === "like" ? "text-red-500" : "text-primary"
              }`}
              style={{ fontVariationSettings: item.action === "like" ? "'FILL' 1" : undefined }}
            >
              {item.action === "like" ? "favorite" : "chat_bubble"}
            </span>
            <ContentImage src={item.targetCoverImage} alt={item.targetTitle} className="w-9 h-9 rounded-lg shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">
                {item.action === "like" ? "Vous avez aimé " : "Vous avez commenté "}
                <span className="font-bold">{item.targetTitle}</span>
              </p>
              {item.excerpt && <p className="text-xs text-[#8A8178] truncate italic">« {item.excerpt} »</p>}
            </div>
            <span className="text-[10px] text-[#8A8178] shrink-0">{item.createdAt}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
