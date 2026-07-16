export default function NewsletterWidget() {
  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{ background: "rgba(18,34,60,0.5)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-primary rounded-full blur-3xl opacity-15" />
      <h3 className="font-serif text-lg text-white mb-1">Restez Connecté</h3>
      <p className="text-gray-400 text-xs mb-4 leading-relaxed">
        Newsletter hebdomadaire — culture, musique & actualités du Kivu.
      </p>
      <div className="flex flex-col gap-2">
        <input
          className="bg-[#12100F] border border-white/10 rounded-xl px-4 py-3 text-white text-sm w-full focus:ring-1 focus:ring-primary focus:border-primary outline-none placeholder:text-gray-600 transition-all"
          placeholder="votre@email.com"
          type="email"
        />
        <button className="bg-primary hover:bg-[#B8240C] text-white rounded-xl py-3 text-sm font-bold transition-all flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-lg">send</span>
          S'abonner
        </button>
      </div>
    </div>
  );
}