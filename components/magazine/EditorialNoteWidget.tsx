export default function EditorialNoteWidget() {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "rgba(18,34,60,0.4)", border: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-accent-gold text-lg">auto_stories</span>
        <span className="text-xs font-black uppercase tracking-widest text-[#8A8178]">
          Note de la rédaction
        </span>
      </div>
      <p className="font-serif text-[#F0EDE8]/80 text-sm italic leading-relaxed">
        « Le Kivu est une scène culturelle vivante. Chaque semaine, nous documentons ses voix, ses sons et ses créateurs. »
      </p>
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5">
        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-sm">edit</span>
        </div>
        <div>
          <span className="text-[#F0EDE8] text-xs font-bold block">La Rédaction</span>
          <span className="text-[#8A8178] text-[10px]">Art du Kivu Magazine</span>
        </div>
      </div>
    </div>
  );
}
