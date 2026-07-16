import type {
  PodcastCategory,
  FeaturedEpisode,
  SelectionEpisode,
  RecentEpisode,
  LatestPickEpisode,
  PodcastEpisode,
} from "@/types/podcasts";

// ── Catégories (filtres) ──────────────────────────────────────────────────────
export const podcastCategories: PodcastCategory[] = [
  "Tout", "Artistes", "Société", "Histoire",
  "Entrepreneuriat Créatif", "Environnement",
];

// ── Hero "À la une" ───────────────────────────────────────────────────────────
export const featuredEpisode: FeaturedEpisode = {
  id: "f1",
  slug: "voix-de-la-paix-rencontre-panzi",
  title: "L'avenir du numérique au Kivu",
  description: "Le défi des jeunes innovateurs de Goma.",
  image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQ01zjaF5lSdK62jFzBJfk4IOo-wApO4lQ6yylAFWJxlv-TNsjahX54e5stdKRXYJohIwSSeDbNNUQOxaHme_hsB009d1VIP2KPLZ34dq6Qb1TvANHNf5uyAXMy7Q1GrMBT2vneV1zoIGzy-EAqwAJXAUs6Wu9N-Jqo5U6xCaQo9xM-LsEiPk37VgPEZBMqiJIHLTbCn6ykMonY_SP2J-SXLMsazD-MlK6n-Ck4ALPVhgGSlYP_MeibAhtEl7exQy8t0S0I-8wfik",
  duration: "52 min",
};

// ── Sélection (grand plein largeur) ──────────────────────────────────────────
export const selectionEpisode: SelectionEpisode = {
  id: "s1",
  slug: "voix-de-la-paix-rencontre-panzi",
  title: "Voix de Bukavu : Ép. 12",
  description: "L'art de la résilience face aux défis modernes. Une discussion profonde sur l'identité culturelle.",
  image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYOH93lnidE9q3dSKIyuCWt_6GOLa1MEgpLbDCszVutqZNfB7N8gKsafTf0XZZdI2oAyo63Womahdm61DvgKh0XwxN29N5kJft6EzAvfab6PSEli75z4U7GE1u41BXIVF1EmREK0wcMzfXRIaFR4Wo8dd5mNAJgz4SjpE3Qzc1yFU60aQHSHATkdMMNy-W_6sdNB5dDSgp83s9AIUhjHTnz2Kzs0SVrqWNypIPW5G0KM2q98QUKW3_ZfPvJ-1fKQIekRRjyZ8Bw6c",
  category: "Société",
  duration: "48 min",
  host: "Sarah M.",
};

// ── Récents (liste 3 épisodes) ────────────────────────────────────────────────
export const recentEpisodes: RecentEpisode[] = [
  {
    id: "r1",
    slug: "peindre-la-resilience",
    title: "Peindre la résilience",
    guest: "Invité : Akram Idriss",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6Eiv43JuUsovaFSryFou8OJfe9-sdOfmQnvkbwBG21Kac73kKpiUuIl_gt4B0MjguoFCftxRn1dR1Om2nIVIT5fC4KdrdEwbKdzcHGtGr6cZ87GdFeJnimxHHSWThAkpMFW_ujYRgq-uoBSskcL1plJhBbnBr4d1NA24luCTBcloraLqNzyZo4uMW1AvsDylnWzuZDmyZkzPDVv95HG0xTnlK_yYRz5iclQ5V0BHmLIHSMZqFvqvVO0o_4wky2y0mj4oGBYX6zfM",
    category: "Artistes",
    duration: "28 min",
    language: "FR",
  },
  {
    id: "r2",
    slug: "goma-ville-de-culture",
    title: "Goma : Ville de culture",
    guest: "Table ronde : Urban Voices",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJcjEB4a1UZWi1Ut1jMuM9-u330SiHNDOP5mGwC5cVGHTTZx28S1gJOlKbAI5Gerr4e5KeRBKT5xZOkaDg7fVdIDBsMlFI6QW7i1Qiy34_ToWyQxdMMbSngPKkS6sTrT0XwIVSJUJjpxCLbhceZS1jCbb1G2vVpK1nD1d23I_ZCfiWTJY5B0U3s79tyQI1ggFXw7x7HRy8wh7pSaHURhKc-GpIy4B5yPsegtyXH7o7hF_r1FYqnfSoAsk9NemZR3Q6xdBrt2p5L98",
    category: "Société",
    duration: "45 min",
    language: "Français",
  },
  {
    id: "r3",
    slug: "or-noir-du-kivu",
    title: "L'or noir du Kivu",
    guest: "Invité : Coopératives caféières",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB99lLNCqrf4JDM3G34WvUMMCABlTqMYom5-m-kYn_0gRVCEavfODtEUzKQY0Ww-DkMTkdSeIDwF6KIla-gNEANPNvoo9dTbinGpf3tZubP0bb_sJKpoBzOrmjlwygZTH1ix5JkWJC6W_yGj10cwTcrBMswUpZY2MlMVY1axmOEbjY77u7FsWJ2_MN01MnQjp6EkMiYe99ZLIc0C8zstCdOv9Ga0FmU_E0GtUXuZ_gnMaAYSB1wDCVun9Fr9L6Nv09JGJz-sR-bxc8",
    category: "Économie",
    duration: "35 min",
    language: "FR",
  },
];

// ── Sélection récente (layout horizontal) ────────────────────────────────────
export const latestPickEpisodes: LatestPickEpisode[] = [
  {
    id: "lp1",
    slug: "entrepreneuriat-goma-defis",
    title: "Entrepreneuriat à Goma : Les défis de demain",
    guest: "Invitée : Imani K. • Fondatrice de KivuTech",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxtOBGGmXJyll8C3iUVIU4vvF9F_rsV1Fen43B4Nt78kx2g-ZJwDCwi1A7K6XC5yRm2UZ4jdcfmJej72KLt5hUqyz9_okbikmLEJKPIuEknk4x9Wzv9w-KY8G7rz7x4MW9Zdom7ZtBLcI9iV7COfatbpGDowMUOYpbHgUL4nAnrpFUw6uAUzkYFan3j4SwzjJzK_2ThMQGJL6m0NHvyjdMwazU6OAcho4kGLJrD-oWv9KTbio7IEWjcM7PUhaU_GPXL73aBz2b2_I",
    category: "Entrepreneuriat Créatif",
    duration: "45 min",
    publishedAt: "Il y a 2 jours",
  },
  {
    id: "lp2",
    slug: "racines-rumba-ame-congo",
    title: "Racines de la rumba : L'âme du Congo",
    guest: "Spécial : l'âge d'or de la musique",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfLJOf4TC-QSB96Q8H5o3OQEl9MA4RPCMV6qobuJEowDV55oS3-n2vbbYm9bVWzL4fjvT-4UgNmN5DUOccRlzX4fIyl28nMfW1kTbiv9jBe7H3Z9wJCDZUHTj2aRQ157CtarKYCGO6PSqcWNqMwFkaZED0jrbKJrtxqm4oEXV911uOQ6vTeAPbaj9rGS9bvSolK5HWdaFdc-MRxftfigEEGHCspEOgPL9UbwRwo0Q6G10FJbfo-0ybLl15QC7zMK7ZFfxHG1hlTjI",
    category: "Histoire",
    duration: "60 min",
    publishedAt: "Il y a 5 jours",
  },
  {
    id: "lp3",
    slug: "tech-kivu-coder-avenir",
    title: "Tech Kivu : Coder l'avenir",
    guest: "Table ronde avec des développeurs locaux",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGlBQ69dR6Tk4JxnjpRJJbwnCeGSQWx-4hd7doPe9Ft3z-BZQ2FwvbiACCGNULEXXtOxn6bzMRXc0uKineGymzEVaV6cB7m5yTEWqHmF8K0tnJ7j2nUMFXw5wf9-Mujw9jjIJCoNXhZdme8BQzeJj8_WlrEHUnQjkaSGFts_34K1B_MFUPWN6MtMCpDUKQhGAWFF2-PapgG2L3KE9qFUg0wu8Hvz4THN0DkG1RNoArjP9k1vQUjpDNIS9-nfM4bcNRZLLEn-GB14c",
    category: "Innovation",
    duration: "30 min",
    publishedAt: "Il y a 1 semaine",
  },
];

// ── Épisodes détail /podcasts/[slug] ──────────────────────────────────────────
export const podcastEpisodes: Record<string, PodcastEpisode> = {
  "voix-de-la-paix-rencontre-panzi": {
    id: "ep42",
    slug: "voix-de-la-paix-rencontre-panzi",
    episodeNumber: 42,
    publishedAt: "14 NOV",
    title: "La Voix de la Paix",
    subtitle: "Rencontre à Panzi",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBEoW0qHDH0t3_RjDyvIg7Q08lK4GUJhmJmiCob0A_pQ2rfp0mOAqT1RVtNXmg4qVxS9Ga7KCQA2UAEjZvuXqx9QN4qnwoqOKenTtgxot9uQe6XUy-TeL-M4_Dwt9mwrq5uERnqH9_fGAXINP-dKLJudutURyVWT4Bf75fN9Xw9IYOwGDy_Fa5pes0mpho40CLVSiGim-ycuAGBFI5ZhdPMHw35iXXrmA6FeGcA4D08Wm0zVJGKBbX7r5iIuW7zBw5YQ14z2poHpsg",
    tags: ["Société", "Santé"],
    badge: "Exclusif",
    description: "Dans cet épisode, nous voyageons jusqu'à l'hôpital de Panzi pour rencontrer un homme qui a consacré sa vie à réparer les corps et les âmes des femmes dans la région du Kivu.\n\nUne discussion profonde sur la résilience, l'espoir et l'avenir de la médecine humanitaire en République Démocratique du Congo.",
    duration: "45:00",
    currentTime: "14:20",
    progressPercent: 35,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    guest: {
      name: "Dr. Denis Mukwege",
      title: "Prix Nobel de la Paix",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4CgrqFaQjaYgh-nDE-4z0RxlvUomgAvMcQoj27tUqV72Wtja7LE_OMH8VjHZPYZZw5GA8jie2Q-u2Hzg0drvXuE-VwsP0cnL4dn1YVfgWdFCcfCgJe62OiHNB2crpQZISQchEd1mB1pEb805KqbyS4kZ1uya0N8NobANqsDh77R12TkTfm0gtAPkYA6wQxAhBgvyv8FLLdAg_0YGdxKzPLuYjhkMPdNjjcnVO6Lnmq5WUicG9lCTZaeDb30ROznTbphF9yrprjwA",
      bio: "Gynécologue congolais et pasteur pentecôtiste. Il a fondé et travaille à l'hôpital de Panzi à Bukavu.",
      website: "#",
      twitter: "@DrMukwege",
    },
    relatedEpisodes: [
      {
        id: "ep41",
        slug: "rythmes-urbains-goma",
        episodeNumber: 41,
        title: "Rythmes Urbains de Goma",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpDXM-fsIZGg2O_FkyLiajBo_DI4RE_s7voXrGRT3aHIPRC7gQaHkEifVcyXy7cfSIHtq5K2M6qqLb-CrlGH7gtFdmOfo_jN2c7sEUWawOko5WZsaI7w0Sd60phSUUb3v5Lz2sV9cRQ8fTDAKRWiSHlX_kFqPdGXEjI4Jxqg0Jos6nwi9stoB9pO0Ov21IS2xeVW8VQ8-ZFcsV8GJdZC-dBxl9SSHjr3nkMX8P0t1G5X1Zs18sWPmYYV7oxk7MzBgHNrEKFMljipw",
        duration: "24:00",
      },
      {
        id: "ep40",
        slug: "cafe-kivu-or-est",
        episodeNumber: 40,
        title: "Café du Kivu : L'Or de l'Est",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMRca2uQSfZ4hOoTb2y3hx-ORJ9JtIPpEIdaUD4ixfdekYUAKCV4gXKyW-0QeyFegzrqIeoBk5ot29SCeyct8I_22x85vpeC0VijdoW9SHb05j8Jm9ix2JIf28_ftUMC0fsw9O6_vW19AYsEYXN1e2IYUAas3RQMomvR77VQ5D9v7R60fuR2dIg2CoumO-dFwUpEd6IXXRGgrqWOBqvP3iBzO1vnS1d7vjucVktfVfOtHC09UhaWX0de0oXU4j8WgwQrM1e62SZz0",
        duration: "32:15",
      },
      {
        id: "ep39",
        slug: "gardiens-virunga",
        episodeNumber: 39,
        title: "Gardiens des Virunga",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuANMPm0Hy4haj391ofIt_Kq2EDJGdG4L2_KQkoEa8AMGLR2OlLHIsU0HE-fIVEzU2CfYSMuzQTfxGtaDtINK-bv5EeNp5tuow5TyT79HdIJGFyKRnAR-WbkxR2S01faCWXaXmGrCsrCGbhZbPa4mpLrnto6UCW5pJm734MBMQwfQgVOVH3koJCcZevooJIrA_xTFjOu5sQa-7OIi_4x0Bu-7-nTYx9o6o1OM3JGNQ2wM3G8uVnhn9fbI-sBBmFkY1rblfqA",
        duration: "18:50",
      },
    ],
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
export function getPodcastEpisode(slug: string): PodcastEpisode | null {
  return podcastEpisodes[slug] ?? null;
}
