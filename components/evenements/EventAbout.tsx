export default function EventAbout({ about }: { about: string }) {
  if (!about.trim()) return null;

  return (
    <section className="px-4 mt-6">
      <h2 className="text-base font-bold mb-2.5">À propos</h2>
      <p className="text-xs text-slate-400 leading-relaxed">{about}</p>
    </section>
  );
}
