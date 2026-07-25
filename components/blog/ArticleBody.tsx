import type { ArticleBlock } from "@/types/blog";
import ContentImage from "@/components/ui/ContentImage";

export default function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  let paragraphIndex = 0;

  return (
    <article className="font-body text-lg leading-relaxed text-gray-300 space-y-6 max-w-3xl">
      {blocks.map((block, i) => {
        if (block.type === "html") {
          return (
            <div
              key={i}
              className="space-y-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-white [&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-white [&_p]:text-gray-300 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:bg-surface [&_blockquote]:p-4 [&_blockquote]:italic [&_a]:text-primary [&_a]:underline [&_br]:leading-loose"
              dangerouslySetInnerHTML={{ __html: block.content }}
            />
          );
        }

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
              <div className="w-full h-64 relative">
                <ContentImage src={block.image} alt={block.caption || "Illustration de l'article"} className="absolute inset-0" />
              </div>
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
