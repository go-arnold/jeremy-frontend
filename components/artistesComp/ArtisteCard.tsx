import Link from "next/link";
import type { Artiste } from "@/types/artistes";
import ContentImage from "@/components/ui/ContentImage";

export default function ArtisteCard({ artiste }: { artiste: Artiste }) {
  return (
    <Link
      href={artiste.href}
      className="group rounded-2xl overflow-hidden bg-card-dark border border-white/5 hover:border-primary/30 transition-all"
    >
      <ContentImage src={artiste.image} alt={artiste.name} className="h-28" />
      <div className="p-2.5 bg-[#10223ce6]">
        <p className="text-[10px] text-primary font-bold uppercase tracking-wider truncate">
          {artiste.genres.join(", ")}
        </p>
        <h3 className="text-sm font-bold text-white leading-snug truncate">{artiste.name}</h3>
        <p className="text-[10px] text-white/60">{artiste.city}</p>
      </div>
    </Link>
  );
}
