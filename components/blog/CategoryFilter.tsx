"use client";
import { useState } from "react";
import type { BlogCategory, BlogCard } from "@/types/blog";
import BlogGrid from "./BlogGrid";

interface Props {
  categories: BlogCategory[];
  posts: BlogCard[];
}

export default function CategoryFilter({ categories, posts }: Props) {
  const [active, setActive] = useState<BlogCategory>("Tous");

  const filtered =
    active === "Tous" ? posts : posts.filter((p) => p.category === active);

  return (
    <>
      {/* Barre catégories sticky */}
      <div className="sticky top-[72px] z-40 py-2 border-b border-white/5 pl-4 mb-6">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pr-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`flex shrink-0 items-center justify-center rounded-full h-9 px-5 text-sm font-bold transition-transform active:scale-95 ${
                active === cat
                  ? "bg-white text-background-dark"
                  : "bg-surface-card border border-white/10 hover:border-primary text-gray-300 hover:text-white font-medium"
              }`}
            >
              {cat === "Tous" ? "Tout" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grille filtrée */}
      <BlogGrid posts={filtered} />
    </>
  );
}

