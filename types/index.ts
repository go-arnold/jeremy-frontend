export interface Hero {
  title: string;
  titleHighlight: string;   // mot coloré en rouge
  subtitle: string;
  backgroundImage: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
}

export interface FeaturedShow {
  title: string;
  backgroundImage: string;
  description: string;
  isLive: boolean;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
}

export type CardBadgeVariant = "primary" | "teal" | "navy" | "yellow";

export interface NewsCard {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  badge: string;
  badgeVariant: CardBadgeVariant;
  href: string;
  actionIcon: "arrow_forward" | "play_arrow" | "calendar_month";
  actionColor: "primary" | "teal";
}

export interface ContentCard {
  id: string;
  title: string;
  description: string;
  image: string;
  badge: string;
  badgeVariant: CardBadgeVariant;
  ctaLabel: string;
  ctaVariant: "primary" | "teal";
  href: string;
}

export interface Track {
  rank: string;
  title: string;
  artist: string;
  image: string;
  featured?: boolean;
  likes?: string;
  href: string;
}

export interface MagazineArticle {
  id: string;
  title: string;
  image: string;
  category: string;
  featured?: boolean;
  href: string;
  excerpt : string;
}
