export type Category =
  | "MUSIQUE"
  | "MODE"
  | "LITTÉRATURE"
  | "URBAN"
  | "INTERVIEW"
  | "LIFESTYLE"
  | "PODCAST";

export interface Author {
  name: string;
  role: string; // ex: "Critique d'art"
  avatarUrl?: string;
}

export interface HeroArticle {
  id: string;
  slug?: string;
  tag: string; // ex: "À la une"
  readTime: number; // en minutes
  title: string;
  titleEn?: string;
  excerpt: string;
  excerptEn?: string;
  imageUrl: string;
  imageAlt: string;
  author: Author;
}

export interface NewsArticle {
  id: string;
  slug?: string;
  /** Real API categories are free-form (`CategorySerializer.name`), not this fixed mock enum —
   * loosened rather than mapping every possible admin-created category name onto it. */
  category: Category | string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  imageAlt?: string;
  author?: Pick<Author, "name">;
  date?: string; // ex: "12 Oct"
  excerpt?: string; // pour les articles sans image (type littérature)
  quote?: string; // citation stylisée
  /** Variante visuelle de la card */
  variant: "tall-image" | "square-image" | "text-only" | "short-image";
}

export interface YouthItem {
  id: string;
  type: "article" | "podcast";
  category?: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  imageAlt?: string;
  /** Pour le podcast uniquement */
  ctaLabel?: string;
}

export interface RadioBanner {
  label: string;
  isLive: boolean;
}
