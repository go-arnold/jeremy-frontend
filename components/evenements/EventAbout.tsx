export default function EventAbout({ about }: { about: string }) {
  return (
    <section className="px-4 mt-6">
      <h2 className="text-lg font-bold mb-3">À propos</h2>
      <p className="text-sm text-slate-400 leading-relaxed">{about}</p>
    </section>
  );
}
