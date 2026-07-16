import type {YouthItem } from "@/types/magazine";

export default function YouthSectionDesktop({ items }: { items: YouthItem[] }) {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-8">
        <h2 className="font-serif text-3xl text-white italic">
          Culture Jeunesse{" "}
          <span className="not-italic text-primary text-xl">/ Youth</span>
        </h2>
        <a className="text-primary text-sm font-bold hover:text-[#F0EDE8] transition-colors flex items-center gap-1" href="#">
          Voir tout <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </a>
      </div>

      <div className="grid grid-cols-4 gap-5">
        {items.map((item) => {
          if (item.type === "podcast") {
            return (
              <div
                key={item.id}
                className="relative rounded-2xl overflow-hidden flex flex-col items-center justify-center bg-surface-dark border border-white/5 p-6 text-center group hover:border-primary/30 transition-colors aspect-square"
              >
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-primary group-hover:bg-primary/30 transition-colors">
                  <span className="material-symbols-outlined text-3xl">podcasts</span>
                </div>
                <h4 className="text-white font-serif text-lg italic mb-2 leading-tight">{item.title}</h4>
                {item.subtitle && (
                  <p className="text-gray-400 text-xs mb-4 line-clamp-2">{item.subtitle}</p>
                )}
                {item.ctaLabel && (
                  <button className="bg-primary hover:bg-[#B8240C] text-white px-5 py-2 rounded-full text-xs font-bold transition-colors">
                    {item.ctaLabel}
                  </button>
                )}
              </div>
            );
          }

          return (
            <div
              key={item.id}
              className="relative rounded-2xl overflow-hidden group cursor-pointer aspect-square"
            >
              {item.imageUrl && (
                <img
                  className="w-full h-full object-cover brightness-75 group-hover:brightness-100 group-hover:scale-105 transition-all duration-500"
                  src={item.imageUrl}
                  alt={item.imageAlt ?? item.title}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                {item.category && (
                  <span className="text-primary text-xs font-bold uppercase block mb-1">
                    {item.category}
                  </span>
                )}
                <h4 className="font-serif text-white italic text-base leading-tight">{item.title}</h4>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}