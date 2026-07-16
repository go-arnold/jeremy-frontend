export type Genre = string;

export interface GenreItem {
  id?: number | string;
  name: string;
  slug: string;
}

// ── /artistes (liste) ─────────────────────────────────────────────────────────
export interface Artiste {
  id: string;        // slug URL : "alesh", "innossb", etc.
  name: string;
  city: string;
  genres: string[];
  image: string;
  href: string;
}

// ── /artistes/[id] (détail) ───────────────────────────────────────────────────

export interface Release {
  id: string;
  title: string;
  year: string;
  type: "ALBUM" | "SINGLE" | "EP";
  coverImage: string;
  featuring?: string;
  producer?: string;
  href: string;
}

export interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;         // "3:42"
  views: string;            // "1.2M Views"
  publishedAt: string;      // "2 months ago"
  href: string;
}

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
}

export interface ArtisteDetail {
  id: string;
  name: string;
  city: string;
  country: string;
  genres: string[];          // ["Afro-Pop", "Hip-Hop"]
  bio: string;
  coverImage: string;
  bookingLabel?: string;     // texte du bouton CTA
  releases: Release[];
  videos: VideoItem[];
  gallery: GalleryPhoto[];
}
