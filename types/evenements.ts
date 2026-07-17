export type EventCategory =
  | "Musique" | "Expo" | "Poésie" | "Atelier" | "Culture" | "Art" | "Danse";

export type EventCity = string;

// ── Événement vedette (grand hero) ───────────────────────────────────────────
export interface FeaturedEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  location: string;
  dateShort: { month: string; day: string };
}

// ── Événement grille masonry "Prochainement" ──────────────────────────────────
export interface EventGridItem {
  id: string;
  slug: string;
  title: string;
  image: string;
  category: EventCategory;
  dateLabel: string;    // "18 Fév" | "20 Fév - 05 Mar"
  city: EventCity;
  venue: string;        // "Centre Culturel Ndaro"
  aspectRatio: string;  // "aspect-[3/4]" | "aspect-[4/3]" | "aspect-[3/5]" | "aspect-square"
}

// ── Carte simple pour SimilarEvents ──────────────────────────────────────────
export interface EventCard {
  id: string;
  slug: string;
  title: string;
  image: string;
  location: string;
  date: string;
  dateShort: { month: string; day: string };
  category: EventCategory;
  price?: string;
}

// ── Détail /evenements/[slug] ─────────────────────────────────────────────────
export interface EventScheduleItem {
  date: string;
  label: string;
  time: string;
}

export interface EventVenue {
  name: string;
  address: string;
  image: string;
}

export interface EventDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  about: string;
  coverImage: string;
  location: string;
  dateShort: { month: string; day: string };
  date: string;
  time: string;
  category: string;
  price: string;
  schedule: EventScheduleItem[];
  venue: EventVenue;
  similarEvents: string[];
}

// ── POST /events/{slug}/register/ ────────────────────────────────────────────
export interface EventRegistrationResponse {
  detail: string;
  code?: "full" | "already_registered";
}
