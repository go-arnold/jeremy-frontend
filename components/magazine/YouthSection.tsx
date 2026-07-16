import type { YouthItem } from "@/types/magazine";

interface Props {
  items: YouthItem[];
}

export default function YouthSection({ items }: Props) {
  return (
    <section className="mt-12 mb-8 py-10 relative">
      <div className="px-5 mb-6 flex justify-between items-baseline">
        <h3 className="font-serif text-2xl text-white italic">
          Culture Jeunesse{" "}
          <span className="not-italic text-primary"></span>Youth
        </h3>
      </div>

      <div className="overflow-x-auto no-scrollbar flex gap-4 px-5 snap-x snap-mandatory">
        {items.map((item) => {
          if (item.type === "podcast") {
            return (
              <div
                key={item.id}
                className="snap-center shrink-0 w-[280px] h-[350px] relative rounded-2xl overflow-hidden group flex items-center justify-center bg-surface-dark border border-white/5"
              >
                <div className="text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 text-primary">
                    <span className="material-symbols-outlined text-3xl">podcasts</span>
                  </div>
                  <h4 className="text-white font-serif text-xl italic mb-2">{item.title}</h4>
                  {item.subtitle && (
                    <p className="text-gray-400 text-sm mb-4">{item.subtitle}</p>
                  )}
                  {item.ctaLabel && (
                    <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full text-sm font-bold transition-colors">
                      {item.ctaLabel}
                    </button>
                  )}
                </div>
              </div>
            );
          }

          // type === "article"
          return (
            <div
              key={item.id}
              className="snap-center shrink-0 w-[280px] h-[350px] relative rounded-2xl overflow-hidden group"
            >
              {item.imageUrl && (
                <img
                  className="w-full h-full object-cover brightness-75 group-hover:brightness-100 transition-all duration-500"
                  src={item.imageUrl}
                  data-alt={item.imageAlt}
                  alt={item.imageAlt ?? item.title}
                />
              )}
              <div
                className={`absolute inset-0 bg-gradient-to-t ${
                  item.category?.toLowerCase() === "interview"
                    ? "from-primary/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    : "from-black/80 to-transparent"
                }`}
              />
              <div
                className={`absolute bottom-0 left-0 right-0 p-5 ${
                  item.category?.toLowerCase() === "interview"
                    ? "translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                    : ""
                }`}
              >
                {item.category && (
                  <span
                    className={`text-xs font-bold uppercase mb-1 block ${
                      item.category.toLowerCase() === "interview"
                        ? "text-white/80"
                        : "text-primary"
                    }`}
                  >
                    {item.category}
                  </span>
                )}
                <h4
                  className={`font-serif text-white italic leading-tight ${
                    item.category?.toLowerCase() === "interview"
                      ? "text-xl"
                      : "font-bold not-italic text-lg"
                  }`}
                >
                  {item.title}
                </h4>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
