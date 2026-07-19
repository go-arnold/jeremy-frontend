"use client";

import { useFavoriteArtist } from "@/hooks/useFavoriteArtist";
import AuthPromptModal from "@/components/ui/AuthPromptModal";

interface Props {
  artistId: number | null | undefined;
  artistSlug: string;
}

export default function ArtisteDetailCTA({ artistId, artistSlug }: Props) {
  const { favorited, loading, toggle, authPromptOpen, closeAuthPrompt } = useFavoriteArtist(artistId, artistSlug);

  if (!artistId) return null;

  return (
    <div className="mt-4">
      <button
        onClick={toggle}
        disabled={loading}
        className={`w-full flex items-center justify-center gap-2 h-12 rounded-xl font-display font-bold text-sm transition-all duration-200 active:scale-95 ${
          favorited
            ? "bg-primary/15 border border-primary text-primary"
            : "bg-primary hover:bg-primary-dark text-white shadow-[0_4px_14px_rgba(163,78,41,0.4)]"
        }`}
      >
        <span
          className="material-symbols-outlined text-lg"
          style={{ fontVariationSettings: favorited ? "'FILL' 1" : "'FILL' 0" }}
        >
          favorite
        </span>
        {favorited ? "Dans vos favoris" : "Ajouter aux favoris"}
      </button>

      <AuthPromptModal
        open={authPromptOpen}
        onClose={closeAuthPrompt}
        redirectTo={`/artistes/${artistSlug}`}
        message="Connectez-vous ou créez un compte pour ajouter cet artiste à vos favoris — ça ne prend que 2 secondes !"
      />
    </div>
  );
}
