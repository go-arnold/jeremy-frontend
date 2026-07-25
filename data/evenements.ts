import type {
  FeaturedEvent,
  EventCard,
  EventDetail,
  EventCity,
} from "@/types/evenements";
import type { mapApiEventToEvent } from "@/lib/mappers";

// ── Filtres villes ────────────────────────────────────────────────────────────
export const eventCities: EventCity[] = ["Tous", "Goma", "Bukavu"];

// ── Événement en vedette ──────────────────────────────────────────────────────
export const featuredEvent: FeaturedEvent = {
  id: "1",
  slug: "festival-amani-2026",
  title: "Festival Amani 2026",
  description:
    "Trois jours de musique, de danse et de célébration pour la paix. Ne manquez pas les têtes d'affiche de cette année.",
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDTz0E31P4FHo6Lo8bsqDIUNKN2NRMYLJxzhJneRYI1_P2jUUmOzZmMhHXeT_5ObB9N1qKws18vl8yFQjIW4UUHWuwR2Xd4drV0mtTaOk5v_mx6hA4-vqa2W7wbETPk-QB3RzpT0xXKkGRwj_VAtDajf6Mt6tYYuBjWJ1TBfrjNgyZJFneXfCmpjSYkAtWJPOwWB_LsUYtRc0WkNeIP2QBS7Hs_8TkI8xA9Q8nO-GC1vPJHWg8rdVsjXf7hJUNRsVHXtg1Th1lSGuw",
  location: "Goma, Collège Mwanga",
  dateShort: { month: "Fév", day: "14" },
};

// ── Grille "Prochainement" (masonry) ─────────────────────────────────────────
// `app/evenements/page.tsx` falls back to this array (cast to the wider `mapApiEventToEvent`
// shape) when the real API fails — every field that mapper produces is included here too
// (`dateShort`, `description`, `isFeatured`, `time`, `monthKey`/`monthLabel`), not just the
// `EventGridItem` subset, so that fallback path never reads an undefined field again (see the
// 2026-07-25 CI build crash on `event.dateShort.month`).
export const upcomingEvents: ReturnType<typeof mapApiEventToEvent>[] = [
  {
    id: "2",
    slug: "concert-acoustique-voix-kivu",
    title: "Concert Acoustique: Voix du Kivu",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCBmwTnj2AXiGgw9qYqmMff2Q5lgO8xHPRYWUi0UuQGnuL1nCPrlbXuBRe3jus_d05uFF8ITGvpchwUT2_T6_qRypLILknsIYrZBsBHOBaQGWnlG7AuysxjLUJxPm4X1lQuD5feYzN6gS8uUDuz9ueSyusgH4NWdL5XKG7SI-yWokX1l1XGAzsjT9lMfeQwVvOzkbqVS24vMchLgM0ebncfWtuQQZ5HGXpz0LCXaAaAZnCiQWCYGtTmxtpcyh54sosT5Dn2eD-CRvk",
    category: "Musique",
    dateLabel: "18 Fév",
    city: "Bukavu",
    venue: "Centre Culturel Ndaro",
    aspectRatio: "aspect-[3/4]",
    date: "18 février 2026",
    dateShort: { month: "FÉV", day: "18" },
    location: "Centre Culturel Ndaro",
    description: "Une soirée acoustique intimiste avec les voix montantes du Kivu.",
    isFeatured: false,
    time: "19:00",
    monthKey: "2026-02",
    monthLabel: "Février 2026",
  },
  {
    id: "3",
    slug: "art-moderne-resilience",
    title: "Art Moderne & Résilience",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCiCmoxzgyub_O3C0j3ol_IqSUAyUn6k8fRcUF96ualha30Ghidjymi_W9XcK4rKe-DFCo1nXnbpsyO4uzDiWzWF0CLi9vhhGslSchYaf59xcR4wH7WZkOxPlSf5X6dUGANPU-m8bw1cwGhFF1CEb8fhvcHwHZs7_AaTp0QTnWbhuDx8N0XZTyvOlvlO3Se1Bqu6AlAPj80dXFKi6eEH3o92mTHwMBksrm1DdLAiucpZBGdzqArmz9y1ekoT42GrSNDq2PStntWGm0",
    category: "Expo",
    dateLabel: "20 Fév - 05 Mar",
    city: "Goma",
    venue: "Galerie Yole!",
    aspectRatio: "aspect-[4/3]",
    date: "20 février 2026",
    dateShort: { month: "FÉV", day: "20" },
    location: "Galerie Yole!",
    description: "Une exposition collective sur la résilience à travers l'art moderne.",
    isFeatured: false,
    time: "10:00",
    monthKey: "2026-02",
    monthLabel: "Février 2026",
  },
  {
    id: "4",
    slug: "soiree-slam-mots-libres",
    title: "Soirée Slam: Mots Libres",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAFjF__gWo5F454WxsqZIMEbDM5pvL5jUBhVwcyeCTNl_zAa8YS5EidX96_d2gUYzIUhFvtZ4VBIpQD36TD4tis218781S6cvMz_vGR_FWmHqHhqyeU8Ms2lCGbPOnFrRQShofMSBlwGrl2KmI7whkwv-8JG1CIWGscTFkoOJ24jNQARAN9w0apbQ047W2h41GVWS0TcCzCdF_95R4UU-J5BX9ptR3rZ11Lz2vvfybPs2ARxhZ3VNaNy3aP5SesQNN-5dunuCA5ABM",
    category: "Poésie",
    dateLabel: "22 Fév",
    city: "Goma",
    venue: "Institut Français",
    aspectRatio: "aspect-[3/5]",
    date: "22 février 2026",
    dateShort: { month: "FÉV", day: "22" },
    location: "Institut Français",
    description: "Une scène ouverte de slam et de poésie urbaine.",
    isFeatured: false,
    time: "20:00",
    monthKey: "2026-02",
    monthLabel: "Février 2026",
  },
  {
    id: "5",
    slug: "atelier-danse-urbaine",
    title: "Atelier Danse Urbaine",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDg-a5sPNvTnPu-wgT3YqjYOJNJFyn2W6n4KFpcm0_-aO1Sa-CzlKz0xgspC-axvGHR4g0deYDzboEMQR02i0sJVBWPp6REGjC_pJpPmgbEanLz2uRlmlafjVbGTX1Z30e16fXv_uSOCXJL5EwGhSKi1MjhJHp9niTQAU2wrZtmq1yhMhrIVScSaAVCy1969wui29_p7P2S8COA_17_HVqTo_T2fKCqqurntcECJ-zO80ReHnFOdGCfI90Mj_vIn5zUG87AEyWZzbY",
    category: "Atelier",
    dateLabel: "25 Fév",
    city: "Bukavu",
    venue: "Stade de la Concorde",
    aspectRatio: "aspect-square",
    date: "25 février 2026",
    dateShort: { month: "FÉV", day: "25" },
    location: "Stade de la Concorde",
    description: "Un atelier ouvert à tous pour découvrir la danse urbaine.",
    isFeatured: false,
    time: "15:00",
    monthKey: "2026-02",
    monthLabel: "Février 2026",
  },
];

// ── Détails /evenements/[slug] ────────────────────────────────────────────────
export const eventDetails: Record<string, EventDetail> = {
  "festival-amani-2026": {
    id: "1",
    slug: "festival-amani-2026",
    title: "Festival Amani 2026",
    description: "Trois jours de musique, de danse et de célébration pour la paix.",
    about:
      "Le Festival Amani rassemble chaque année les artistes majeurs de la région des Grands Lacs. Concerts, expositions et débats offrent un espace de dialogue et de célébration de la paix.",
    coverImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDTz0E31P4FHo6Lo8bsqDIUNKN2NRMYLJxzhJneRYI1_P2jUUmOzZmMhHXeT_5ObB9N1qKws18vl8yFQjIW4UUHWuwR2Xd4drV0mtTaOk5v_mx6hA4-vqa2W7wbETPk-QB3RzpT0xXKkGRwj_VAtDajf6Mt6tYYuBjWJ1TBfrjNgyZJFneXfCmpjSYkAtWJPOwWB_LsUYtRc0WkNeIP2QBS7Hs_8TkI8xA9Q8nO-GC1vPJHWg8rdVsjXf7hJUNRsVHXtg1Th1lSGuw",
    location: "Goma, Collège Mwanga",
    dateShort: { month: "Fév", day: "14" },
    date: "14 - 16 février 2026",
    time: "12:00 - 23:30",
    category: "Musique & Culture",
    price: "À partir de 5 $",
    schedule: [
      { date: "14 février", label: "Ouverture & grandes scènes", time: "18:00" },
      { date: "15 février", label: "Ateliers & showcases",       time: "14:00" },
      { date: "16 février", label: "Clôture & concert final",    time: "20:00" },
    ],
    venue: {
      name: "Collège Mwanga",
      address: "Avenue du Lac, Goma",
      image:
        "https://th.bing.com/th/id/OIP._1Qy8B5x4fGFZTyv_C7mtAHaEK?w=327&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    },
    similarEvents: ["bukavu-jazz-session", "kivu-visionnaires"],
  },
};

// ── Pool cartes pour SimilarEvents ────────────────────────────────────────────
export const eventCardsPool: Record<string, EventCard> = {
  "bukavu-jazz-session": {
    id: "r1",
    slug: "bukavu-jazz-session",
    title: "Bukavu Jazz Session",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA2ef3hKFiyDV4X-rg5XJd7Wsj52yLy0oUX6Io0OJ60DOLpbc7lBZPfiQJQSnXjFW5FxbhtSYNjANB0-kM2eNQfVchUpjUAxUvYKqOzaPLYbtR0LinieIOqohNgxWu4DAPrUIeVyIKpPZwLFqLlnfb1nEv-NNxcPxoGfzRFyf10mFZOb_q_qfi5d22BuNovW_aa19KYvkF1kXU8utJkXSRto-mEN60dAQkhzw9COicc4qG8iIoMEA-8NRjZlrHicVfVi9L2AVVLzeY",
    location: "Bukavu",
    date: "12 mars",
    dateShort: { month: "Mar", day: "12" },
    category: "Musique",
  },
  "kivu-visionnaires": {
    id: "r2",
    slug: "kivu-visionnaires",
    title: "Kivu Visionnaires",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCjrCDplw6he86Pb2pvcjCyJIYWq3zH6vR6GrZOBQKZSgafu6M2AS0c0-ecVsAvclHLf-TWqYVRcJ_g2p0YIKNjRLhmEczUYfOJ47z53sAv1tRQ6XGCjWpC02XWVREVgRVsm1pSY80MCkqrbFo1d8yi7zsaKulxYb-xKFm97Fz-Cj83gIOrECooKd4Aw-zVQ11yFJ3KnyMOfxXbMqLX9f4xpVJY1SRGNtG58t6CDwxnmTxFzmXmH6LCU5cXvpcaVLmbCfQkX2zk8NE",
    location: "Goma",
    date: "20 mars",
    dateShort: { month: "Mar", day: "20" },
    category: "Expo",
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
export function getEventDetail(slug: string): EventDetail | null {
  return eventDetails[slug] ?? null;
}

export function getSimilarEvents(slugs: string[] = []): EventCard[] {
  return slugs.map((s) => eventCardsPool[s]).filter(Boolean) as EventCard[];
}
