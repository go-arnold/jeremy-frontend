import type { Artiste, ArtisteDetail, Genre } from "@/types/artistes";

// ── Filtres genres ────────────────────────────────────────────────────────────
export const genres: Genre[] = ["Tous", "Musique", "Hip-hop", "Rumba", "Afro", "Urbain"];

// ── Liste /artistes ───────────────────────────────────────────────────────────
export const artistes: Artiste[] = [
  {
    id: "innossb",
    name: "Innoss'B",
    city: "Goma",
    genres: ["Musique", "Afro"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhwQ3ABN9AL45xXWFHxhlQmmJLLIJa-LVnPlEueH8x90u3KA8AyTBHqjQjNfw42VYjKysxT6z1xA2-JjcfAMHdK9MBKjlhU3ryQOsVLvD39QCkqGQJW31KZOZWBXBLxoT_oEncn6A4hk3dW1kocMAuJs7aMd_GpiTPb0az9O53A1cZ0BbtxJbRIyFPWJ85knmvJ0ucEyGayOkTJ6Eg9sB77s3kEj7hLVl3EeDMSmPln85STETFETNzpqd-mp6Vqyuy0cmxlNGXXOA",
    href: "/artistes/innossb",
  },
  {
    id: "ferre",
    name: "Ferre Gola",
    city: "Kinshasa",
    genres: ["Musique", "Rumba"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhwQ3ABN9AL45xXWFHxhlQmmJLLIJa-LVnPlEueH8x90u3KA8AyTBHqjQjNfw42VYjKysxT6z1xA2-JjcfAMHdK9MBKjlhU3ryQOsVLvD39QCkqGQJW31KZOZWBXBLxoT_oEncn6A4hk3dW1kocMAuJs7aMd_GpiTPb0az9O53A1cZ0BbtxJbRIyFPWJ85knmvJ0ucEyGayOkTJ6Eg9sB77s3kEj7hLVl3EeDMSmPln85STETFETNzpqd-mp6Vqyuy0cmxlNGXXOA",
    href: "/artistes/ferre",
  },
  {
    id: "fally-ipupa",
    name: "Fally Ipupa",
    city: "Kinshasa",
    genres: ["Rumba"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtrPRYQYFAPsXXuAHCeIDydEd6PqMa8UL4jT5TwPHRw3fpvonMBDGQlDS9pM1eiC31Ge7Ua-KziJTlYWNaEDC5McDwmMuS7K2bOHl_o6HPBElaSECXQ3z-HeK3ZEktRtKlwnDF1IO-huddYfhZqxN80t9EcFKcRRKWvrYpFztvmmd1La68r4aLGnCL9Wj1qpbLic0IYRTm7gCS9J7Q8s1D9oioxDGmVYyUR5v44cLs2BlK9jdTqrgczMQzcPXr6b3ZwSjarWHIIAw",
    href: "/artistes/fally-ipupa",
  },
  {
    id: "alesh",
    name: "Alesh",
    city: "Bukavu",
    genres: ["Hip-hop", "Afro"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCleHMwVYsBgini3kL57RleWEOT3ChkuP1sA0VA5lB6Dka8BR3qg4YP_5efReAWYpH2oqXnhBZhCplJI64JSBCMgn_1Dvpb6cRwfksBNNXxv0fLS_4h11E7vCh6CwjIBxRgQRVIpCIsRwu1ySSdlXD4Cobjfc9k9QUnl3wqUDBaWX6KSK3LB0vnOal-GhvT4otV9wslVpgGYz6sGyXVQJ9wo_Tb_GLSHFlr5RKeo9XAPG9W0xiCVU9Cuf4KIBz15OHoJChu-Wh8Up4",
    href: "/artistes/alesh",
  },
  {
    id: "mpr",
    name: "MPR",
    city: "Goma",
    genres: ["Urbain", "Hip-hop"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6Eiv43JuUsovaFSryFou8OJfe9-sdOfmQnvkbwBG21Kac73kKpiUuIl_gt4B0MjguoFCftxRn1dR1Om2nIVIT5fC4KdrdEwbKdzcHGtGr6cZ87GdFeJnimxHHSWThAkpMFW_ujYRgq-uoBSskcL1plJhBbnBr4d1NA24luCTBcloraLqNzyZo4uMW1AvsDylnWzuZDmyZkzPDVv95HG0xTnlK_yYRz5iclQ5V0BHmLIHSMZqFvqvVO0o_4wky2y0mj4oGBYX6zfM",
    href: "/artistes/mpr",
  },
];

// ── Détails /artistes/[slug] ────────────────────────────────────────────────────
export const artistesDetail: Record<string, ArtisteDetail> = {
  alesh: {
    id: "alesh",
    name: "ALESH",
    city: "Goma",
    country: "DRC",
    genres: ["Afro-Pop", "Hip-Hop"],
    bio: "King of King... A voice for the voiceless. Combining sharp lyricism with infectious Afro-Pop rhythms to tell the story of a generation.",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDR3mpSRGCjTgAm3PwTRE93JhNXXhbTjw9aVAqgPmS8HkEMvCwb1m-4oUNQBMrUh7x7T4ZEt72NkT3x77ksnQQGXVV-jg2so_GX3SGUVy7Agb-N0zhAaLwnKGbcunnzN43IvcxTWi5WTNmVJZTNxST0pR8qkLG9gnIj3VcKbuSWjOny_HJWn7baxPa5i85FrGsf5vsUsxgj7920HCwx3FmzzNaV0Y5iwawKRHjJuORHfr5eA_w8YgSfvDU_FuN8lf6OKADRqxlCd4c",
    releases: [
      {
        id: "mongongo",
        title: "Mongongo",
        year: "2026",
        type: "ALBUM",
        coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9lGZSZqmUprryjrP70HX5BNnbRug7ZmlRRJu_LzKhqVUzYVB4momBr-ec4i3aCqJIyPL9FHB0i5hAkaVEAxT4qPXg68k5PMjjjJ9IcifCPp5wBUrZ6xGhdjCh75Hy94gxVBpMsEgwqQwQgKFqpJMiu4mVK5K9XELZCaywlcUOvM6tfY00PhLbqhuGLXUN5LhdN2XJdfjjOLNWwBC20O4qYAAbkgCocQVHYImO4NVWUXHXBrZexSki45lOtMkWAHYCQpappc6IaXo",
        featuring: "Feat. Youssoupha, Singuila",
        href: "/musique/mongongo",
      },
      {
        id: "bilokooto",
        title: "Bilokooto",
        year: "2026",
        type: "SINGLE",
        coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUgKrC-arCOdQkrpMFfjYHExfu3pwwqiAhqZCCcbrei2W6NTn67BhBKIPvsTY5f1xnFYEfWiGwTdbjOQWSwR_Yx7WVb8c1A7pb4BAwJeHZTRH4WiTWsmzuyNXUPBK20GYMhoXrOiTagEO5bfO3nhx4MM4HP3ZSQJDOZnueZJqjtyZw4YewGb_eO4T0Yb3I0F9CmSBf_ztU1ahAAy-0max9glktCZyt7h6G3Rs2KI3VH7J7xSU0BDzuNRe54wmMYCPterkMABKT2VE",
        producer: "Prod. by DJ P2N",
        href: "/musique/bilokooto",
      },
    ],
    videos: [
      {
        id: "mutu-clip",
        title: "Mutu (Clip officiel)",
        thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuAsJcMa_BDubwMXnH_EqQOCLqBruebSR5qs-tlBqZzEP6iMWOij_af0YIo65R7ySg7NCht2ap57iaijztFzd8dbxHazNUQI8lWwuR6Djpb5dPtUOgADUaApCZtAoRiG0hNZ3-3B7TrRAcVXG5uUbsgdlKgvqw9V81uN3jGYutDi-DFGNcQ16YicUtrfehgFXoS8RWDHJd6Jj8PHYcpldfI71PqZfnr5GWoQGJ4R7cpDxbv4LaA3UcjaOIYAIyGXzYqQ31CN0KHWI2g",
        duration: "3:42",
        views: "1.2M Views",
        publishedAt: "2 months ago",
        href: "https://youtube.com",
      },
      {
        id: "you-amani",
        title: "You (Direct at Amani Fest)",
        thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuA3HxzqkFKAgFfi_XyNO6ujtJJZf6r82kU0sUHpeoMefpvSv28h3atGXqntVj8McahrTrfuXGgf9WbulZXV_dBiJS7J4COA21ANZuF-5-diTLYjmuJxm1tX3MF7hwY2A6fKbOwqG5-pfZ8yHXdnqArdWadTBlwym_yS5m_T-E8kyS63Jsb9n2SUDELU1gaH3lhNcK05ckE2bIiV70RsxJl2GeDTLBcqJcHNa5EmomAwnD8a15niAW2pQUK9uC_jr07zcHF4V6GFbR4",
        duration: "4:15",
        views: "856K Views",
        publishedAt: "1 year ago",
        href: "https://youtube.com",
      },
    ],
    gallery: [
      {
        id: "g1",
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKSPsiXb1Ve0Y9HIdC4VOhjDb3Pe-KuMf1HAfzByOj-k2OcnBYpUihja-HphByxmC6To_4IVy2ABKR5fBz055nT09cfzJ0X9UOsL0QxkeF8_-5bSBlcXw9dMgE02zyMD2B7oiXkxvtR4BHoiOCMx-1H5NdeJ0Q-dZlUwGuJiyO7j1bNyTpKu0-jr9gYrcqAU1V2Iyijf8Y5DsAr88CnSiVdNKzP1DFZhFuiDuLiP8ppfMk4JOxHaICjdGcfWWTFkdykfZb7JD3pnc",
        alt: "Alesh live on scène avec micro",
      },
      {
        id: "g2",
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-W6OcYeCd4otG6SqhowJnEayUGSZTCHWwSJlI_R5x-fPwSXKhlsRjiN3MJcZuz6PRo8L3a7-WeD_EqoMyS7LCpl0ZiM4PWwt3Oz7kc9yUblkOm9HB3u3y2Z3X3Ha0xvJbreJnSp8AsbV3ak0nc9xvTiaRMQXRt7DSND_rtu8IZpy_U1SrzlS7nl1JvQWYRZk902JQVGtynvA9yQEvd9gnkziCIRfUG9YipLvEegWBOeBVhTsoWKSxzo0XVEIMpyiVEUBXgdfQLXI",
        alt: "Foule à un festival de musique à Goma",
      },
      {
        id: "g3",
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXA7GprDv0rg9DCUMhqiLSZbYG05hs-LU5fEbEUtI0ohnOfz-pPjdT44WlzXywvmxbKsJABJ0_c0_r70BoyD37p-ttN1T0qCsOaFk84gmoyayQSfwyhdOUDJhfY1r5jx2k4bJMDS6r-A9nEPh0LPKxoRbOcWQhSFFBxLHx9ELUTuhyhvjDTsZGgndA6SKuwTEgPlRRqkz_2K33LYyNjCT912y4Z_zfx7xIhBXHZbyTh0RkgwdEeJFOF13bisU9fMshgA0hDEk0QYk",
        alt: "Portrait artistique noir et blanc",
      },
      {
        id: "g4",
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkGh0PjuxuhH9N5TNmRE_DpndsHAKRoIC1GXV-OpHOMe70-6Nvv0oIEe5T_zT2ylw56JUIRrVaTOCIW1_fl4-7w2hEOvXYLugPPZiVTog9Z2fzYTTO3CRlf77K_VjETwaCLxCJOHELutFlTIDi8xEFyKbLGYZTq9sdul7MvMkQZLDEZe3_lgBNwkq6h3wSpNy9hZQqMaK284aGGEDuJjI7dKTr5TRFOdGXRHKOjjdqFQ7jSGOA5VKKEmdjYov3Y-ndtM5opbx1vr0",
        alt: "Session d'enregistrement en studio",
      },
    ],
  },
};

// Helper — 404
export function getArtisteDetail(id: string): ArtisteDetail | null {
  return artistesDetail[id] ?? null;
}


