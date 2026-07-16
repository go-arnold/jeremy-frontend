import type { BlogCard, BlogPost, BlogCategory } from "@/types/blog";

// ── Filtres ───────────────────────────────────────────────────────────────────
export const blogCategories: BlogCategory[] = [
  "Tous", "Culture", "Société", "Mode", "Musique",
];



export const blogCards: BlogCard[] = [
  // ── Hero plein format ──
  {
    id: "1",
    slug: "mains-de-goma-sculpture",
    featured: true,
    title: "Les Mains de Goma: La sculpture comme résilience",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCnjzjfFpZhv4Ug6LeFt390F_qLJQAbPRUIY9FUu9vuq65Nv85zjfI2KcwoEpmZJnxxuSdU2YtPT5RVXe6HIgA0eMLHIVRSqBo78Y0YdA5363lvv58VM-TE3MWmtzRGpjYav3aJUNm2vyOxdL1VFUwQaquPzi24tE_ENn0p2NC4WqDZPU6QCjyMH4VLdAtGn3wsGQ2Gy9LB5ud6IgrcafzGUbKph6ffuamU5lOckFd79FcARiQcHDFuY0TGSlkezJZkDN7JrHidKZQ",
    category: "Culture",
    author: "Sarah Kabuyaya",
    readTime: "8 min",
  } as BlogCard & { author: string },

  // ── Colonne gauche, carte haute (h-64 + excerpt) ──
  {
    id: "2",
    slug: "elegance-du-kivu",
    title: "L'élégance du Kivu",
    excerpt: "La fashion week de Bukavu réinvente le pagne traditionnel.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5V1upyUvvJTLthbn_YDbkl9NQOi2PN_YWemTMLnYolcTyVLla3LClyZO9X19IhssvHg23EVUjFu8iSt3rhZKNL3tSjHW-7-Ecoz5JZIZ9Fa4TtZlQSD1F1HCQ8ex3j1CJgCZQCER2lUIDJDC2nG06OS2abWYCGoclpm91saxNztQZBxnuGY4VxPcuSFpeIZ2GJduMYpxIe7wW7BKkGDAc9BGSOqR_rhIEvc8cetZ22_Cjg_9P6cqHXN_DaLtfFqK6EZsUT87ahRw",
    category: "Mode",
    readTime: "4 min",
  },

  // ── Colonne droite, carte moyenne (h-40) ──
  {
    id: "3",
    slug: "festival-amani-2026",
    title: "Festival Amani 2026",
    excerpt: "La fashion week de Bukavu réinvente le pagne traditionnel.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9TF76oxtw1ukQKnWUfqI1Skl9lBQ_12-JNwB6KQTaA6iOhaSylro1dHy7I4S7Dfl30E9Oz9hq1NlOwb2wwko-qg9oXagT_JeQDFCptACX1zyCsztpUbNeqwFvT4CYQp6vCFFYdbZtTuT5iUyZJExzyk4JzPu4Bws34_EFNfv37KqqsNlSLtdmVC13Fh1CG_HgqX4UpUKhIXNSfxeabAThkMiWPw0gt52sBAs6S94zeto4vY8H3ifUzud3vSWJJnFz8jXI0SoVgyc",
    category: "Musique",
    badgeLabel: "Galerie Photo",
  },

  // ── Colonne gauche, petite carte (h-32 + publishedAt) ──
  {
    id: "4",
    slug: "or-bleu-lac-kivu",
    title: "L'Or Bleu",
    excerpt: "La fashion week de Bukavu réinvente le pagne traditionnel.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkK-LSIBcgUq7BD4XCYUSQJVwL-qvuRqcMsvUvzHKtMaM-1hQgJVJYmRSneA_TA_D4hgyqy516F0NUAtOLuUCKedHZ2cVuzg2fN3n3o05KGX8-GxpcjWZDiJsplPg2cSyaSE6qfLayjKGdi0UC--vMpOsnLTd4bgdmPl5cCH31SVqjhTJjx8zykSFNEZ3uTCRSZkRzPtdeABWCH6dfMcndTdxHcnT6VkqIil0SRxY1rgh1xS3kG-x0TPYCnEfRznmw39MLjthBl_E",
    category: "Société",
    publishedAt: "Il y a 2h",
  },

  // ── Colonne droite, grande carte (h-56 + excerpt) ──
  {
    id: "5",
    slug: "couleurs-de-la-ville",
    title: "Couleurs de la ville",
    excerpt: "La fashion week de Bukavu réinvente le pagne traditionnel.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXk1XnltqOHdEPj3TxCkYbZn8oIJfyXnT5d6rj_BqohoOlEvhH4MGIzFv39o_ZKP_xkOaJ_AZ7Na7gUe34mX_7koy9Rq934NcuqshhHXSmATeBK-aRzO8BUoDDuHtn-zKL1CFR6v7gJNKRDmOK5-jYn8caRbl6P7i79WNfil4s0DA6RZYWKO4UBwt0pRB4-l5fDcsEsM9pPqYsi4HK2VjMzJhSflpuBNXrapwspN84jt00iiDA_7C9En8FdabcBFAGCrs0r9ihZng",
    category: "Arts Visuels",
    readTime: "6 min",
  },
  {
    id: "6",
    slug: "emergence-electro-bukavu",
    title: "L'émergence de la scène électro à Bukavu",
    excerpt: "Une exposition qui capture l'âme vibrante des rues congolaises.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCq_z6cnhluVjpQzlcFPd_8Fu8NZWwR2ZlkI4kohYocCqOue3b30V_aPzbgAFUvqlkmm9akpppuH9-42wZ4uKUFoNcabmzHuaZy8GOaKVWUlal3YoxOt4tGVcuIQD27Ka8jpMy9uw-Wynw2atIijPEbUlJ1nt6HCunMcuMbiEznu02yt_B3_JBdBdOtnRaR5gwnWTWfo76BbkJizh7pvAk9FNwifgeEf77-aQShiiLok_y15WFycUw9HokfV0gAfa19gQ3OBW5GCoE",
    category: "Musique",
    readTime: "6 min",
    
  },

];

// ── /blog/[slug] — articles détaillés ────────────────────────────────────────
export const blogPosts: Record<string, BlogPost> = {
  // Seul article fully mockée (visible dans la page lecture-article)
  "emergence-electro-bukavu": {
    id: "bp1",
    slug: "emergence-electro-bukavu",
    title: "L'émergence de la scène électro à Bukavu",
    coverImage: "https://a.cdn-hotels.com/gdcs/production197/d1754/ac4e2dfd-9944-430d-b089-2990c99d999d.jpg?impolicy=fcrop&w=1600&h=1066&q=medium",
    categories: ["Musique", "Culture"],
    author: {
      name: "Amani K.",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0ZQcv0wVvF2eSK_N_VTVxs0dGGmEzHM3IysIXqni7gwQJE8ycslWmr5tlYb045R1Vi22KWJ4c2CaVhmW_aklN0W9G51PT4a3HZV34Vzt0d6HLVu0tfXqsieOeFqUIACdHosypX1d2Z3IPxOjmtLDMAaaNxfFGcniDyjixlziLtVw8lckh16sMTk3e86R-5V5RewZoPHKsbMSPk9Pq0AsoNAAuImifxR1wlPBRmztQ0hU4ok9zdmK0FFAxB6cmEUbQPKgTIk1WDQU",
      publishedAt: "12 Oct 2026",
    },
    readTime: "6 min",
    blocks: [
      {
        type: "paragraph",
        content: "C'est dans les sous-sols éclairés au néon de la commune d'Ibanda que tout a commencé. Loin des rumbas classiques qui bercent nos dimanches, une nouvelle vibration s'empare des nuits de Bukavu.",
      },
      {
        type: "paragraph",
        content: "Une génération de producteurs autodidactes, armés de laptops reconditionnés et de versions crackées de FL Studio, est en train de réécrire l'identité sonore de la ville. Ce n'est pas seulement du bruit ; c'est une revendication.",
      },
      {
        type: "quote",
        content: "La musique électronique n'est pas juste un son, c'est une nouvelle identité pour la jeunesse du Kivu.",
      },
      {
        type: "paragraph",
        content: "Le collectif \"Kivu Bass\" organise désormais des soirées mensuelles qui affichent complet. Le mélange est audacieux : des percussions traditionnelles du Sud-Kivu samplées et hachées sur des rythmes techno industriels.",
      },
      {
        type: "figure",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAyKflftu1wt1dTIbqkgRswjRMz-SsCHkmlt4prdysKQtw7JrNrhA_2THL9KxFMuMl3IXjUrjDiW7bik4D_ppUs-_8HL11T10FTfu2Q78ybXYp6Pv_Q0MO-cBjsDtkV6jo5HraeK9cnJfKPv2nStc5MAeQldW6OnMJT_k_HsALN0dkFayDNlQqstoLiIgX2qscJftaIDVQiav9zL98v90jMsNDJE4xNXowP2YYjSSMSD5O5c9hHclNqXdr7uJpmG5SxchZl5NXrB7U",
        caption: "Session studio au Labo Art-Kivu.",
      },
      {
        type: "paragraph",
        content: "Alors que les festivals internationaux commencent à tourner leur regard vers cette scène émergente, la question de la professionnalisation se pose. Comment transformer cette effervescence créative en une industrie durable ?",
      },
    ],
    tags: ["Electro", "Bukavu", "Underground"],
    relatedPosts: [
      "sculpture-recyclee-goma",
      "poesie-urbaine-kivu",
      "heritage-danse-traditionnelle",
    ],
    comments: [
      {
        id: "c1",
        author: "Sarah M.",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC8u2-JpHbhpjbBhN2v4wJQ32wCN4kXU055sS_OE2gMM28u2Cyik8Ag-Q4-k0bbh5goeYoxXMBNf8JDhO7lQC-JzuprKeucr3ZthG-T59-LBICPJVjZdcHFoaW9la0mJlT0ZeJ1bkV_4Yh3DW7ssPdaH0EV49WbX3N6bIwrekr-ycRD4xigj_regd4vd77xVjavPTGMrwCsUtNunWfX_LOAhWN5PzW2s47aAtnRL4BJVokTyjxkc54thtqyS7Wcm_G6jweSC3mGg-g",
        content: "Incroyable article ! Je ne savais pas que la scène était si développée. Hâte de voir le prochain event.",
        publishedAt: "Il y a 2h",
        likes: 12,
      },
      {
        id: "c2",
        author: "David L.",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDn-g4XiY9jpC8pyqcHNd4PvOsKkizxW0lSpvjPLqhPXpOxu88DmzNrFiaKnC5-T9q8VwqckwZh2t2GSc3YYeN4RpAmTTtV8VsSRh_t7I-gS-iuu5ksGf2RA_TVptceYAUC8JIIgcRPBaedDoAyYuSWck9-gfGQoYciKOw8cBamTUexQM8Mh_Ua5-nRiXvTB0JtmWBgm4M3fGKapNIm7jZwfzXUR3rLQyG87Rknob9Xy2xy_Hn0HERAfkhVZOpYiXXNbwfuAYeoY4Y",
        content: "Le mélange tradition et modernité, c'est exactement ce qu'il nous faut.",
        publishedAt: "Il y a 5h",
        likes: 4,
      },
    ],
  },

  // Les autres slugs référencés dans relatedPosts — à remplir quand l'API est prête
  // "sculpture-recyclee-goma": { ... },
  // "poesie-urbaine-kivu": { ... },
  // "heritage-danse-traditionnelle": { ... },
};

// ── Helpers (remplacés par des fetch() lors de la migration API) ───────────────

export function getBlogPost(slug: string): BlogPost | null {
  return blogPosts[slug] ?? null;
}

// Cartes pour la section "Vous aimerez aussi"
// Les articles liés non encore mockés sont ignorés plutôt que de 404
export const relatedCardsPool: Record<string, BlogCard> = {
  "sculpture-recyclee-goma": {
    id: "r1",
    slug: "sculpture-recyclee-goma",
    title: "La sculpture recyclée envahit les rues de Goma",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZ1jEO1swUfdNm7qA5zMNR4xgttd8bmO9-AqPVjEkVhPMXUN9zLVXcS1J0JnYcgIANjP2y2Qslo4mnIljE4X2sbsfT1P6HuqSBNV8bFZcHY5COSveBucQPKHJAz3isI-4prpQB9N6oJyezmoZTJgO6bQZ7bgor_dp8B0E6u0U5bB3ew7MWw_AymUoqiiditU0LJyGPGWqxAqUg8HUGwEJ7Oi3jtcZzqNHu-MqnajZaFVM1s-ibvaWC4jDobLcYWNqDQ1i0KlproeM",
    category: "Arts Visuels",
  },
  "poesie-urbaine-kivu": {
    id: "r2",
    slug: "poesie-urbaine-kivu",
    title: "Poésie Urbaine: Les voix du changement",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLetNfJFH6LSNovCpg92nHMqbbwOFlDq0_OyDdE8v8LJDqKYuknNseiBiIcyZHk-pzpEmiFyBSZtjB5vlzenUY6N5XAoDlOwajZuxA3N__ZOyV3bEmVTWnZRqWlTLx_ldcxx0DAFWyok8LfuKVjOHcQ6hDThXaEaiUjM-IOt42yxOBUiyE4OuCsSPpjtSkfzQy06JJEZGLqrFy8qHOZI26W-rHW1femFGmYIKatPsmLP2bOGuvpiiCCai3l6_Fg2vpBVTcEs8g7AE",
    category: "Littérature",
  },
  "heritage-danse-traditionnelle": {
    id: "r3",
    slug: "heritage-danse-traditionnelle",
    title: "Héritage: Moderniser la danse traditionnelle",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAXgw1p8vmk3bZjqADoGgKMfMCSlgTXYB3klzy1HW0EsRoQf8PQPENwK-lXnLCxFdEWYxNd_SFICE9EjEOCZ5FaXHUKqhf82R4dzWXRyulZVUMWFiKDtWWUY8xcsmoNKAaxgJJaVd4CuyeN6Bz9-Tk8msQpJmXejt9ilQWOZNebenxgBzCsxYZlBSIZaKgKdABl04Cv74DtjEokDd25wnLNxSREY3wdUBYlYv9txaDyhJqQYY94lzueXw",
    category: "Danse",
  },
};

export function getRelatedCards(slugs: string[]): BlogCard[] {
  return slugs
    .map((s) => relatedCardsPool[s])
    .filter(Boolean);
}
