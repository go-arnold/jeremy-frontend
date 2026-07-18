import type { ArticleBlock } from "@/types/blog";

export default function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  let paragraphIndex = 0;

  return (
    <article className="font-body text-lg leading-relaxed text-gray-300 space-y-6">
      {blocks.map((block, i) => {

        if (block.type === "paragraph") {
          const isFirst = paragraphIndex === 0;
          paragraphIndex++;
          return (
            <p
              key={i}
              className={
                isFirst
                  ? "first-letter:text-5xl first-letter:font-bold first-letter:text-primary first-letter:float-left first-letter:mr-3 first-letter:mt-[-6px]"
                  : undefined
              }
            >
              {block.content}
            </p>
          );
        }

        if (block.type === "quote") {
          return (
            <blockquote
              key={i}
              className="relative my-8 p-6 bg-surface rounded-xl border-l-4 border-primary"
            >
              <span className="absolute top-4 left-4 text-6xl text-white/5 font-display font-black leading-none">
                &quot;
              </span>
              <p className="font-display text-xl md:text-xl font-bold text-white italic relative z-10">
                {block.content}
              </p>
            </blockquote>
          );
        }

        if (block.type === "figure") {
          return (
            <figure
              key={i}
              className="my-8 rounded-2xl overflow-hidden shadow-lg border border-white/5 bg-surface"
            >
              <div
                className="w-full h-64 bg-cover bg-center"
                style={{ backgroundImage: `url('${block.image}')` }}
              />
              {block.caption && (
                <figcaption className="p-3 text-xs text-center bg-[#12223ce6] text-text-muted font-display">
                  {block.caption}
                </figcaption>
              )}
            </figure>
          );
        }

        return null;
      })}
    </article>
  );
}
