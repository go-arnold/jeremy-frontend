interface Props {
  icon: string;
  message: string;
}

/** Compact empty-state for an embedded section (releases/videos/gallery) on the artist detail
 * page — the generic <EmptyState> is sized for a whole page and would look oversized repeated
 * three times on one page. */
export default function ArtisteSectionEmptyState({ icon, message }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 px-4 text-center rounded-xl border border-dashed border-white/10">
      <span className="material-symbols-outlined text-[#4A443E] text-3xl">{icon}</span>
      <p className="text-[#8A8178] text-xs font-medium max-w-[220px]">{message}</p>
    </div>
  );
}
