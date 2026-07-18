import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="material-symbols-outlined text-6xl text-primary">search_off</span>
      <h1 className="text-2xl font-black uppercase tracking-tight text-[#F0EDE8]">
        Page introuvable
      </h1>
      <p className="max-w-sm text-sm text-[#8A8178]">
        Le contenu que vous cherchez n'existe pas ou a été déplacé.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-[#B8240C]"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
