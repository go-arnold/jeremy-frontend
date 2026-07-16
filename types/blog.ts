export type BlogCategory =
  | "Tous"
  | "Culture"
  | "Société"
  | "Mode"
  | "Musique"
  | "Arts Visuels"
  | "Littérature"
  | "Danse";

// ── /blog — carte dans la grille ───
export interface BlogCard {
  id: string;
  slug: string;             // → /blog/[slug]
  title: string;
  excerpt?: string;         // texte sous le titre (optionnel)
  image: string;
  category: BlogCategory;
  readTime?: string;        // "8 min"  — absent si pas affiché
  publishedAt?: string;     // "Il y a 2h" — affiché à la place du readTime
  featured?: boolean;       // article hero grand format
  badgeLabel?: string;      // "Galerie Photo" | "À la une" | …
}

// ── /blog/[slug] — article complet ───────────────────────────────────────────

export interface Author {
  name: string;
  avatar: string;
  publishedAt: string;      
}

// Un bloc = une unité du corps de l'article
export type ArticleBlock =
  | { type: "paragraph"; content: string }
  | { type: "quote";     content: string }
  | { type: "figure";    image: string; caption?: string };

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  publishedAt: string;
  likes: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  categories: BlogCategory[];
  author: Author;
  readTime: string;         // "6 min"
  blocks: ArticleBlock[];
  tags: string[];           // ["Electro", "Bukavu", "Underground"]
  relatedPosts: string[];   // slugs → résolus via getRelatedPosts()
  comments: Comment[];
}
