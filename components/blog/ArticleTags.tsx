export default function ArticleTags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2 mt-8 mb-10">
      <span className="text-xs text-text-muted mr-2 my-auto">Tags:</span>
      {tags.map((tag) => (
        <a
          key={tag}
          href={`/blog?tag=${encodeURIComponent(tag)}`}
          className="px-3 py-1.5 text-sm rounded-lg bg-[#12223ce6] text-gray-300 hover:text-white hover:bg-white/10 transition"
        >
          #{tag}
        </a>
      ))}
    </div>
  );
}
