import type {
  HeroArticle,
  NewsArticle,
  YouthItem,
  RadioBanner,
} from "@/types/magazine";

export const heroArticle: HeroArticle = {
  id: "hero-1",
  tag: "À la une",
  readTime: 5,
  title: "Le Renouveau Artistique de Goma",
  titleEn: "Goma's Artistic Revival",
  excerpt:
    "Comment une nouvelle génération de peintres transforme les cicatrices de la ville en toiles d'espoir.",
  excerptEn:
    "How a new generation of painters is transforming the city's scars into canvases of hope.",
  imageUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD9q90lveddneK2zXxqYHghOi7zduNDVvQzsmJFT_newnaAQ-KDq5fz5KzZToNifiIMim2OZMhsHa6YOcOWBt2l4Ygfjtpfn_zy13tBPLdpYLGNot6lvmNTT6kODjtfrlpz8mEFpQ6S2j8ZtI8rVBuStBg1gQxiVIF-UlE7x_4VMAtG6holcwxlPDUWyiMas7CoRTdrtosUOOSOt7HFF84fBo0oyQc9vpY9RIYrdZxWcGnuhdZdfYeKo7y8KfptPlLK3ulkQYHxUfE",
  imageAlt:
    "Portrait d'un jeune artiste congolais peignant une fresque vibrante à Goma au coucher du soleil",
  author: {
    name: "Jean-Luc M.",
    role: "Critique d'art",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDD94kUypopypn-jlPpxFrMbQvVAHO5ZZfO-GJHAHcZLSFCtjmoylz3pisWPfu5l7yKKYXdorSRnAWN9I4zzIsVWlBAT2ti2rTavg5Gf-Et93guqsy_xnhgQw0Dhl53djJw51zwUrb7sDjhsnmq6Cn3i_LIJov-P8o5DnXKfmLivO6oC8bPCF14wgH4Xxdwlbi-TqJuDODKEwEVz51Z6S-nY-Dku5JqDPgguGDmzpvzt_ZD8_pdrLAzS3hBl_hKwPW29IfzhMlE1Qs",
  },
};

export const newsArticles: NewsArticle[] = [
  {
    id: "news-1",
    category: "MUSIQUE",
    title: "Festival Amani 2026",
    subtitle: "Un hymne à la paix.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCWVZFelLCTsbAfmPDgihCRF9vfF4TR1VMx0yY-b3y4vDSdche0k9ssnhKCK95aZV1uAAaL-Xo4NBRZE9y7n4KPoMZG2WQGId7AXYTMBoQCv7HVgzDblp8thGzh4HEEeaeFjPjhAmsVn9_hN3A88aSguOAoitrY_I5GNt03v9VP0fjx9WzrgqSQhFZ3lkmNtVBYFnDsuEX0g2sl7rwmtx5E1L9hjeZG66c5UFX0vK3yJMjFK-H334I0_Mj4-GxURm2ZLj4BAlt4FhE",
    imageAlt: "Foule à un festival de musique avec scène lumières en arrière-plan",
    variant: "tall-image",
  },
  {
    id: "news-2",
    category: "MODE",
    title: "Sustainable Fashion in Bukavu",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAU4ptq1xa3_fuDUzOlP6oX_qxKjd2mjdNipjYhbPA7ejQEG8n-ylXz90Hfs_RWB0f4w9TIfKzeTzY_uo27WCryIov7E038EKJwaUohv7hC5BBK8Uma5dXFMAGlHvFIIz9U_m5rpTgAti3DaLBpMt2ta0pGy4TFparooDtuaVr9hKq2L-73Bn8Xx7mL52yfxdIxLgv7UXklmSW0E0LZJIecO2HuJdrMS8uvKW_jW2H__gWa4sxJ_PavsdLttHDG0png98VxII2ErG8",
    imageAlt: "Mannequin africain portant des vêtements géométriques colorés",
    author: { name: "Sarah K." },
    variant: "square-image",
  },
  {
    id: "news-3",
    category: "LITTÉRATURE",
    title: "Poésie du lac Kivu",
    quote:
      '"Les eaux sombres murmurent des histoires d\'anciens rois..." Une anthologie à découvrir.',
    date: "12 Oct",
    variant: "text-only",
  },
  {
    id: "news-4",
    category: "URBAN",
    title: "Street Art & Peace",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDHzOPOXpuF1hPJaJQBJenNBsmoDoCCk7tiJ44goD-lKPxfHmf1bHcOlbuIfwcXQrQxrbpOc2EBAwcA7PLivD3vwrKJh0GN_aLHERGPih0aZjgyU4549fK0VgG4FvVMbxQQD1KCoEFNmBbA2adTN9QSgul4sk7mRb5i7wpkAyKwfn1-j_iTLOyhgVGcI41Grex24g42SEg48yW_Ey-6j2oEm8rszKVxv2K0ukEKEA6yfJVOZGS_xhZ-qPcMgGDjZLQUxkH3WroQxH0",
    imageAlt: "Jeune danseur de rue en milieu urbain, sautant en l'air",
    variant: "short-image",
  },
];

export const youthItems: YouthItem[] = [
  {
    id: "youth-1",
    type: "article",
    category: "Interview",
    title: "La Voix de Goma",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDJ0OyHwwOBoPKvQJHBqLBlSl2U37V_WAYbCHUKcqmyotkn1yuYXKXYl6rCQrrTSgvTxhZvYtDAe-6QTJKj66_iWB-eiGFBI66wPLZvFHz5o7mJkB4k315WCSMU4QBF5VBp0Zuxb-Zi4xoeLhNDWWSwyOM3lQG8F88aekPNIh1pTLWdQ8HtZTZtjaQqL36A4kjzyEGqtC6aDA0NmCkiIF52IjCKAvp9QWY_ZlisDTYvBLnzemuTL83-JSJMMAuDzhPry8S4Ekl3h3k",
    imageAlt: "Gros plan portrait d'un jeune homme africain avec des lunettes stylées",
  },
  {
    id: "youth-2",
    type: "article",
    category: "Lifestyle",
    title: "Café Culture & Chill",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBTqXyabCx_AvvIz0hHNnoQN7gR8Cg2HdgS2RcejGVx3lHf9L-lfBzJhWyREE5Vf52tFE2QD75WT6yVU2rYQB5dzltxVSIgVNPiLMXomiMkkaY1wcqCV-xauijzdNYNQGtbyGTJzE2OhEjiCowqc_4l-a48VTIwRftJvuvE_-cDGYyYfcuMFcWlkkUIbMluhXFFh5wOhvJuc64HhlMbTV186cgDr1WEjKkOJjEF-a0SrQVvNuOV4F1_TR4heD3Bc8KVWUr_TPJIMEc",
    imageAlt: "Groupe d'amis riant et discutant dans un café en plein air",
  },
  {
    id: "youth-3",
    type: "podcast",
    title: "Podcast: Kivu Talk",
    subtitle: "Écoutez les leaders de demain.",
    ctaLabel: "Écouter maintenant",
  },
];

export const radioBanner: RadioBanner = {
  label: "Direct : Kivu FM",
  isLive: true,
};
