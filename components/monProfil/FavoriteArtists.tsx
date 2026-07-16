import type { FavoriteArtist } from "@/types/monProfil";
import Avatar from "@/components/ui/Avatar";

function ArtistAvatar({ artist }: { artist: FavoriteArtist }) {
  return (
    <div className="flex flex-col items-center gap-2 min-w-[72px] cursor-pointer group">
      <Avatar
        src={artist.avatar}
        alt={artist.name}
        size="custom"
        className="w-16 h-16 border-2 border-transparent group-hover:border-primary transition-all"
      />
      <span className="text-xs font-medium text-center truncate w-full">{artist.name}</span>
    </div>
  );
}

export default function FavoriteArtists({ artists }: { artists: FavoriteArtist[] }) {
  return (
    <section className="glass-card rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Artistes Favoris</h3>
        <a className="text-xs font-bold text-primary hover:text-primary-dark" href="#">
          Voir tout
        </a>
      </div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1">
        {artists.map((artist) => (
          <ArtistAvatar key={artist.id} artist={artist} />
        ))}
        {/* Add button */}
        <div className="flex flex-col items-center gap-2 min-w-[72px] cursor-pointer group">
          <div className="w-16 h-16 rounded-full bg-surface-dark-highlight flex items-center justify-center border border-dashed border-white/20 group-hover:border-primary transition-all">
            <span className="material-symbols-outlined text-white/50 group-hover:text-primary">add</span>
          </div>
          <span className="text-xs font-medium text-center text-white/50">Ajouter</span>
        </div>
      </div>
    </section>
  );
}
