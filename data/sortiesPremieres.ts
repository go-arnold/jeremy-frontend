import type {
  FormatFilter,
  FeaturedRelease,
  UpcomingRelease,
} from "@/types/sortiesPremieres";

export const formatFilters: FormatFilter[] = [
  { id: "all", label: "Toutes les sorties" },
  { id: "musique", label: "Musique" },
  { id: "clip", label: "Clip" },
  { id: "documentaire", label: "Documentaire" },
  { id: "expo", label: "Expo" },
];

export const featuredRelease: FeaturedRelease = {
  id: "featured-1",
  month: "MARS 2026",
  title: "Lueurs du Nyiragongo : Album-événement",
  releaseDate: "Sortie le 15 mars • Toutes plateformes",
  coverImage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBBiFIG3Fz4PwKQbPiXYOFDuodTdGWC_EIFA9f9HzllBUKmRFkXc4oOcOf1QSLg3wVVipsNvhpwbhJfnBwyuX4B01GR2wTXe4ZWNNEgDKUxN1AGl-4iXwia9TsoenIYjRboOhFR8riwWyyRHgpUKm5i0U_QnDqFYHMXyc7m-c3lvxYEiWJwfZ8M3lLoCSnKoGGdwgznf6RZDejpkQgNQpL-UkCWeHskDmtHwxv5twQd5oNrRafZZCQOcX6xyw5c4MUYK3tBMfd-LYs",
  isPremiere: true,
};

// Fallback for `ReleaseCalendar` when `/releases/calendar/` is unreachable — real usage builds
// the month grid client-side from these raw ISO dates via `buildCalendarMonth()`.
const inDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};
export const mockReleaseDates: string[] = [inDays(5), inDays(12)];

export const upcomingReleases: UpcomingRelease[] = [
  {
    id: "release-1",
    day: 12,
    month: "Oct",
    format: "Album • Musique",
    title: "Bukavu Jazz Session : Volume 4",
    description:
      "Un album live capturé au Cercle Sportif, avec des improvisations inédites et des cuivres majestueux.",
    releaseInfo: "Sortie : 12 mars",
    releaseIcon: "calendar_today",
    coverImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA2ef3hKFiyDV4X-rg5XJd7Wsj52yLy0oUX6Io0OJ60DOLpbc7lBZPfiQJQSnXjFW5FxbhtSYNjANB0-kM2eNQfVchUpjUAxUvYKqOzaPLYbtR0LinieIOqohNgxWu4DAPrUIeVyIKpPZwLFqLlnfb1nEv-NNxcPxoGfzRFyf10mFZOb_q_qfi5d22BuNovW_aa19KYvkF1kXU8utJkXSRto-mEN60dAQkhzw9COicc4qG8iIoMEA-8NRjZlrHicVfVi9L2AVVLzeY",
  },
  {
    id: "release-2",
    day: 20,
    month: "Oct",
    format: "Documentaire • Première",
    title: "Kivu Visionnaires",
    description:
      "Un documentaire sur les jeunes créateurs de Butembo et Beni, avec une première diffusion exclusive.",
    releaseInfo: "Première : Web-TV",
    releaseIcon: "play_circle",
    coverImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCjrCDplw6he86Pb2pvcjCyJIYWq3zH6vR6GrZOBQKZSgafu6M2AS0c0-ecVsAvclHLf-TWqYVRcJ_g2p0YIKNjRLhmEczUYfOJ47z53sAv1tRQ6XGCjWpC02XWVREVgRVsm1pSY80MCkqrbFo1d8yi7zsaKulxYb-xKFm97Fz-Cj83gIOrECooKd4Aw-zVQ11yFJ3KnyMOfxXbMqLX9f4xpVJY1SRGNtG58t6CDwxnmTxFzmXmH6LCU5cXvpcaVLmbCfQkX2zk8NE",
  },
];
