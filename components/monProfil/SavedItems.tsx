import Link from "next/link";
import ContentImage from "@/components/ui/ContentImage";

export interface SavedEntry {
  id: string;
  title: string;
  coverImage: string;
  href: string;
}

export default function SavedItems({ items }: { items: SavedEntry[] }) {
  if (items.length === 0) return null;

  return (
    <section className="glass-card rounded-2xl p-5 flex flex-col gap-4">
      <h3 className="text-lg font-bold flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-xl">bookmark</span>
        Signets
      </h3>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors"
          >
            <ContentImage src={item.coverImage} alt={item.title} className="w-11 h-11 rounded-lg shrink-0" />
            <p className="text-sm font-bold text-white truncate flex-1">{item.title}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
