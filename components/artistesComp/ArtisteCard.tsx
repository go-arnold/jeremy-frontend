import Link from "next/link";
import type { Artiste } from "@/types/artistes";
import ContentImage from "@/components/ui/ContentImage";

export default function ArtisteCard({ artiste }: { artiste: Artiste }) {
  return (
    <Link
      href={artiste.href}
      className="group rounded-2xl overflow-hidden bg-card-dark border border-white/5 hover:border-primary/30 transition-all"
    >
      <ContentImage src={artiste.image} alt={artiste.name} className="h-32" />
      <div className="p-3 bg-[#10223ce6]">
        <p className="text-xs text-primary font-bold uppercase tracking-wider">
          {artiste.genres.join(", ")} 
        </p>
        <h3 className="text-base font-bold text-white">{artiste.name}</h3>
        <p className="text-[11px] text-white/60">{artiste.city} </p>
        
      </div>
    </Link>
  );
}
