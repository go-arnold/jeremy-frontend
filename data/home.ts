import type {
  Hero,
  FeaturedShow,
  NewsCard,
  ContentCard,
  Track,
  MagazineArticle,
} from "@/types";

// ── Hero ─────
export const heroData: Hero = {
  title: "La Voix, le Son et l'Âme du",
  titleHighlight: "Kivu",
  subtitle: "Magazine & Radio culturelle de la région des Grands Lacs",
  backgroundImage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCieTxxvKeIrckC7rrdrPqwUsO_7sw69Hp82hxoOZ66kakfhv2LCWq8VJ2TS-ivTONuqi7Tjgc7w4pFIX4cfl0R1IQkNcKV_AKLHoWY9Uz0DCDapUEQR2pE9Cu3Xt4A5gABQqrnbPVXjAwJYfdhSJtxclht2SIUybSo_qDHahghcl2tcbs4c2x7vUOHt2iH4j3NrTEmAcXEWeHKOG-p4UsPhg2Fc29aCRuZ-BiQhgDPiq7a96NurFcnf7WdjIA9XSpxtX7eT7ZFdB0",
  ctaPrimary: { label: "Écouter la Radio", href: "/radio-en-direct" },
  ctaSecondary: { label: "Découvrir les Artistes", href: "/artistes" },
};

// ── Emission en direct ────────────
export const featuredShowData: FeaturedShow = {
  title: "La scène du jour : Studio Nyota",
  backgroundImage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDlSFiL6bH8aNv9m1bBTM7KwHW-0j-QQpA5zwqp7zgEhwa3M1hSVeRQIOyegMGjW3Lz68Kqv-TM-T4zxIPGRzhCr84lYK-88sUgzUFDmUXmg2wadQA7bMZMdys3x5r9_Iv_R7NFMc_lUaNnXkhLd9scDuBygsIIltqBZvRcx7w35vuwlgmbvhGyP0ToEGvwq6xfLRg8QtrZBXPrMeQjuZlLXWLViwW4yyyV3453mzCl7vYLtwqOJ4-B_O0NvtaJ-yWhkc4mKH6yqKA",
  isLive: true,
  ctaPrimary: { label: "Écouter Direct", href: "/radio-en-direct" },
  ctaSecondary: { label: "Découvrir", href: "/artistes" },
  description: ""
};

// ── Carrousel "À la Une" ─────────
export const newsCards: NewsCard[] = [
  {
    id: "innossb",
    title: "Innoss'B",
    subtitle: "AfroCongo Vibes",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAhwQ3ABN9AL45xXWFHxhlQmmJLLIJa-LVnPlEueH8x90u3KA8AyTBHqjQjNfw42VYjKysxT6z1xA2-JjcfAMHdK9MBKjlhU3ryQOsVLvD39QCkqGQJW31KZOZWBXBLxoT_oEncn6A4hk3dW1kocMAuJs7aMd_GpiTPb0az9O53A1cZ0BbtxJbRIyFPWJ85knmvJ0ucEyGayOkTJ6Eg9sB77s3kEj7hLVl3EeDMSmPln85STETFETNzpqd-mp6Vqyuy0cmxlNGXXOA",
    badge: "Artiste du Mois",
    badgeVariant: "primary",
    href: "/artistes/innossb",
    actionIcon: "arrow_forward",
    actionColor: "primary",
  },
  {
    id: "kivu-tech-talk",
    title: "Kivu Tech Talk",
    subtitle: "Ep. 42 : Innovation à Goma",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD5kS52TehhBPDTjVbARmYZ7wY9IP7jH4Qd1s7shDDNrGi3XsC3WKBAEBS8UsWuOD4hC-B1DyRGa_IpP_KUxN67XFjh6rbBDQGy7eq7ndJhhIOtYsqCQRBe8e-dJUOjW5ajxeHDG9TrnstqDj0j6nF3FmxICNEBUV_kdifLI86wyUXKlGx34aUaBepgqr8P0sTX1t_QFavt6qq2kmTFK1hdBs1cJP5ActXcw4Oi-HvsR6noljZKDZ45wqHi5lmgLEH7nEtxpbpmw14",
    badge: "Podcast à la Une",
    badgeVariant: "teal",
    href: "/podcasts/kivu-tech-talk",
    actionIcon: "play_arrow",
    actionColor: "teal",
  },
  {
    id: "festival-amani",
    title: "Festival Amani",
    subtitle: "Bientôt — Fév 2026",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC-yXDcWo46qoYE5pzXOjxcCogyxM9qwYpqif_yyJgKzylW_hdckI_DThgxkLa5lftbeOFX5TJgRDOTjHyfNGvLtVMS7pqb37GMpfdWuIz_ZT7JScQ5L6cKcXlFKES5uiDikfBchaI3S6OnvVNU25lzwclGhm0Qzt8KdSfy1KfaiFDhxm-td7VeeUb61eaASMO181AVvI9QBON0DQF9bnA9ai8Qs9_nlwg0ftC8u9I07Cny33MzxJwhGxrszzuJbPem-ikn1S1wZQM",
    badge: "Événement",
    badgeVariant: "navy",
    href: "/evenements/festival-amani",
    actionIcon: "calendar_month",
    actionColor: "teal",
  },
];

// ── Contenus à la Une ───────
export const contentCards: ContentCard[] = [
  {
    id: "lina-nashi",
    title: "Lina Nashi",
    description: "Voix soul de Bukavu, nouvelle sortie en exclusivité.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCleHMwVYsBgini3kL57RleWEOT3ChkuP1sA0VA5lB6Dka8BR3qg4YP_5efReAWYpH2oqXnhBZhCplJI64JSBCMgn_1Dvpb6cRwfksBNNXxv0fLS_4h11E7vCh6CwjIBxRgQRVIpCIsRwu1ySSdlXD4Cobjfc9k9QUnl3wqUDBaWX6KSK3LB0vnOal-GhvT4otV9wslVpgGYz6sGyXVQJ9wo_Tb_GLSHFlr5RKeo9XAPG9W0xiCVU9Cuf4KIBz15OHoJChu-Wh8Up4",
    badge: "Artiste du Mois",
    badgeVariant: "primary",
    ctaLabel: "Voir le Profil",
    ctaVariant: "primary",
    href: "/artistes/lina-nashi",
  },
  {
    id: "kivu-morning",
    title: "Kivu Morning",
    description: "Actualités culturelles et vibes locales avec DJ Mike.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDooTlnr-f6VrHDGO8ropARzDt89P5IMyxA16muqBN_ZfpC6uzAy0nhSyPEG8tFvtZGOsqY_0vs-zEdHfy5bFR5iwc3lOZQlPT6UNassgU3zpGIME_1tJ9DO4Ks0ti5tvim_KGA0dykx6ONJLlHgcmlZTOkfN5-GPz0nTNp-NsF6ct5Jgz5MrvMyQpx5Ud0lzzAm86Jlo13MWXH4s3DhjYGi0LSh_fg5SciU3QK22540bvh5mVcQwX4vU4VKi-QrR6ihC-LFdvdFAQ",
    badge: "Émission en direct",
    badgeVariant: "yellow",
    ctaLabel: "Rejoindre le direct",
    ctaVariant: "teal",
    href: "/radio-en-direct",
  },
];

// ── Hits du Mois ─────────
export const hitsOfMonth: Track[] = [
  {
    rank: "01",
    title: "Yope Remix",
    artist: "Innoss'B ft. Diamond Platnumz",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAdgdewkhTiz47pGrXuHujxHqKN3epRW43NN6sEUHr4jbNeYRU1vSm_aqhOy6DtmFvtodHdXqqMrKQqDTyAxSjXlHVYOv8L9M5YOhdRTB8pmPSVd8F_cCla6r3sOi5ftmfOgKXSchBEx65e7ls_K1F8S2S0MKhtmPoeSSo4Yqd__TpGeqtmgSzGW77Wlq40BDXJdOplnML4OurgniVz9ajHj1n8upgPDdVdFiHwZgvS-6_fvgcmHw8uvLBqGmeI4IEzRpcpunLD4ZQ",
    featured: true,
    href: "/live-music",
  },
  {
    rank: "02",
    title: "Amani",
    artist: "Fally Ipupa",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBltkVMhZTP7vJJq6G4kTLgVtVPQ__y0L72l7hUNzgbDB35kpyUfcQohjJHTb3HAfhiiaKGzKdqaguWwD4iMZA-YwOyxMvnp3dA8NkxL0jKOxrxY1ejQfwQaRaLgtk-PSPGhXKR3N-8OWua44y9nqfmphcYsTk2F4Lwe2rQOhNwdItFrZEa7QFe0GSboq4Y5DpYWKGvgD7D_6IKfOE9EbEQCKJszKUvVg1lprpKpNUy7QGaxAKu-4Tuy8Bd5T_IJWSYQRBI0lmmAmc",
    href: "/live-music",
  },
  {
    rank: "03",
    title: "Nini Tosali Te",
    artist: "MPR",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDtrPRYQYFAPsXXuAHCeIDydEd6PqMa8UL4jT5TwPHRw3fpvonMBDGQlDS9pM1eiC31Ge7Ua-KziJTlYWNaEDC5McDwmMuS7K2bOHl_o6HPBElaSECXQ3z-HeK3ZEktRtKlwnDF1IO-huddYfhZqxN80t9EcFKcRRKWvrYpFztvmmd1La68r4aLGnCL9Wj1qpbLic0IYRTm7gCS9J7Q8s1D9oioxDGmVYyUR5v44cLs2BlK9jdTqrgczMQzcPXr6b3ZwSjarWHIIAw",
    href: "/live-music",
  },
  {
    rank: "04",
    title: "Tokooos II",
    artist: "Fally Ipupa",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuADTqs64yTqwHAjH5pQIMqMmddXRm2Tl_Oz03x5MRv1_StQ0fnZjYNBl7lw27sms32PkYw7bHbdqSKDfByzQ4VftsLZho8CgJf2XhevYYBxHNb_t1YLIjnnv_sVMQw8MNWevvsO6mz-FmcA1LgPAZibJhKmEzY_Iw1r5TjmWQ6YF-EoC_t0smfro_Syd0Ll_FnqyQtHzTvhwk-1Qqf8T-ZRJWUQpugXbD7ZGKaepMfWNzqC9zdQ6OvYekgzCi4qAlxRqMA9bhTfa38",
    href: "/live-music",
  },
];

// ── Top 10 ─────────────
export const top10: Track[] = [
  {
    rank: "01",
    title: "Yo Pe",
    artist: "Innoss'B ft. Diamond Platnumz",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBJPdTfO_55lfrmeT02qrIuSvnCesFoHayZUtqKUN4su_ePz43g9fvwkrZkfoRMqihG7oBZs3SVKZCBEG666ZvP0N8BAXkTiBi9B2AR8EdRF9gQMfEJHpYK4JH6-3UrKqCwYYnhr3GtJ-la6iQ_mgch4Bqh3pD9akOoOEffBncljO4MS3u3A4BP1FfcKAaTG_WIjMWY1xzU1T3Tmzaxg3i-hurcuxKsLj7sTZ5fg8XuFjrFsRyz9kkjP0lLhWmwUfnv5O0OQnH8pc0",
    featured: true,
    likes: "12.4k",
    href: "/live-music",
  },
  {
    rank: "02",
    title: "Goma Noir",
    artist: "Fally Ipupa",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAbUJPopprgNVOmuR7yZgWTMTeLhhR4_aLt0msKLQmrMdoW1eZLh9VMP4982Nwje08QmhSdLpsUb_gUrVyAT_YHmSeUwz0joVoMGFLbMzyRDckxeK17SbSYv5f5YTYIg1PCPtHG07bqOlseCXG2wkq_jeDNF3mhWJolAbn-2ZTImpa6xDadshNfvBxi_530-sK7RmsjFFsNY3iLpL-bp4qBvXs1slbf4o63Mwlgt7b0xHaQm1B2bUqiZTdI6v8db5T_T7YW7XL0IGw",
    likes: "8.1k",
    href: "/live-music",
  },
  {
    rank: "03",
    title: "Virunga Soul",
    artist: "Alesh",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAvl4ucd7yBKsoKK4IJFnoocFJJ4N-Sehqn8TGFbfhPp8nBtlEuV8XVyOmmCv7_R6qx75wyXIIFAkEq5s7_e1UEsS39bMLVpgow-9_dtmV-s7God3rXz0w_wmXxvX0ou4L44HtMAwLIijTQu9zVaAU9Yl0tbCsBV4MAiAFUPSYoWlICcqww0MfJrARgKvIyqwPXOLQ-nsDxD4LykivIL955H2M7CW9mVS2RjE1gqEWysb0HVReemVshj7pw_x0TKaA0TA87KtPrrB4",
    likes: "7.6k",
    href: "/live-music",
  },
];

// ── Magazine Culturel ──────
export const magazineArticles: MagazineArticle[] = [
  {
    id: "bukavu-jazz",
    title: "Bukavu Jazz Festival 2026 : les premières têtes d'affiche",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAK1pEYD18hjhhUYOlVzPtTIRgsBeDBYOW944m-Z4wjDonYCiMUnoY179qqn_aD9geWehV031kkEOuUlK6zI6BHCUuevdNClQlaxKFJavNGDdJcXd4lWidQ-_yYy9Q57n3XKDP-xIPKIyPQMV-4HDUWrmfElIk8u4qoPzstKYFxNAgLwghHlS0qpCBLUG2MXx-S6ir2fWSMpTn8W98MeE7rWPPRfJm6BmlLi-ZOeIL-36eBTbBpyNXyFo8uQKNdr1fjOLZA4ZL4LZA",
    category: "Festival",
    featured: true,
    href: "/magazine/bukavu-jazz-2026",
    excerpt: ""
  },
  {
    id: "peintres-goma",
    title: "L'ascension des artistes peintres de Goma",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBOHxmEE5pAQf3lYsvGonNUJFItsJcNkJeom782O0PSbHVp6llmZcnlrUbvTRyzAUxALfxo7QnpsYWYhv_EQKa5wJNTt9LBMTm-dT_BwB3akKHvOq1dg1EfwmwRiW7T9qwFnWoyjlSLp7-aR-ZhzZaeh0V7aLPbgWYk9yehjgIx7fLxWuaXpj7o7XxCvmttWAjLNXvrh2jtsU1Qt-63ZvIgPhz0mj8__9ALeBdHfRVciA14eK2KJC5KNwV6mmc-P81XEckIqqB-HMQ",
    category: "Art visuel",
    href: "/magazine/peintres-goma",
    excerpt: ""

  },
  {
    id: "kivu-fashion",
    title: "La Kivu Fashion Week revient en force",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuASI7qEl7-tc4Q48ooZkSlD38QsWa3TGo3YNa3V2LRCDCkwHKC6VpOR6PJfD0x6CzxluqjVSKPBjQ_ZISWe_rhK_A586j_YFN3NwnAEXbgOjLk-LkE60A4u30_ermBhY2z4Ts8rGRL8JCsXoVFRtSh548MZO-TGG9W07MA8Zu4mYWrPEfFz6R4y2eMfTJPBM6mNHbx5HrqN2cQHwDRYXeIezP6ME0SW3m-QoFTJ2mdVNASlANraL5GhDo3kax6_YDHOnIHXyPbJGjY",
    category: "Mode",
    href: "/magazine/kivu-fashion-week",
    excerpt: ""

  },
];
