import type {
  FilterTab,
  PremierVideo,
  StudioSession,
  FreestyleVideo,
  DocVideo,
} from "@/types/webtv";

export const filterTabs: FilterTab[] = [
  { label: "All", active: true },
  { label: "Freestyles" },
  { label: "Studio Sessions" },
  { label: "Docs" },
  { label: "Interviews" },
];

export const premierVideo: PremierVideo = {
  title: "Kivu Kings: Studio Session Vol. 4",
  subtitle: "Behind the scenes with the rising stars of Goma's hip-hop scene.",
  liveTag: "En direct",
  location: "Goma",
  imageUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDzTrxP4TMSCy8KBy4MAqGdn3o3YDlQzjQ9ttpkyS-QXjtiRNKN2A1qxmJZBa4NJnBHRJQXMG0wknulHbtSWKnSVc926s0cl7tRSMZc5VIhSs09cmSsRsXa3eOc9DDbOl-We8a0No-cXs3NtMO4wl1sCpezpMo5728iWeX7hXR-aRd4ySjbP0PwmpXMRLduCPmjhY8EcCv-vvasNEOjeS5sniqN9AZTQFoTJFTpFaIr05rna8_iZBwdou9DHRXoGt5vt3MS78FZFAE",
  imageAlt: "Concert scène avec sombre blue éclairage and fumée effects",
  isLive: true,
};

export const studioSessions: StudioSession[] = [
  {
    id: "studio-1",
    title: "Afrobeat Rhythms",
    author: "DJ Kivu",
    publishedAt: "2 days ago",
    duration: "04:20",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB6vbcFGrtULCzBIBYstGq5onJ6V1rrKyBbSomUlOUaGp-vz86uhyKKgnM_wHz-89NGYMU1botdaWHzeMG-iXqtNLTzXJFzS9HYqHD7oWuDVKUtXDYKLV5qbDvSdOKr3cHgpg_4IAFIuoFwPVWLWXQH1OsAmWkwsP7k1ngd3oG_U-8bbWd5OWXQKlPMHwk0RdDgfm15nbV8OvpNJUvlWAAjRYnp17xWdQNRK0rmKswQlgF6Wp6MaNG_KAQy6-3T8ZBVIP9BYTOBRvg",
    imageAlt: "Gros plan sur un micro dans un studio d'enregistrement sombre avec lumière rouge",
  },
  {
    id: "studio-2",
    title: "Acoustic Soul: Bukavu",
    author: "Sarah M.",
    publishedAt: "1 week ago",
    duration: "12:15",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDAIBr4MbHCQtHW-r_XaWCpmLofynWVu2KRZBpy305b-vyh5inc7iBQ7kFmprZBR0hbOyKTo4sslxAGVKCqBKoAW3gLiXI8P-oEZNJzYR1NN0lPpPTvTr2wMhzakn0ik1cAVcPsW1-aUTHVtHMYHs8QSJTQ98KpFRslMWELaNFkcXKoy-MYU5Fn4GDg55rH-bzGi--yKiwB_IxIX7xg1MjCUatLtG_JB4nXF_KS-4bbCV4R45xQxsOhZO0IEE2hsc7WzHLGETjJHGM",
    imageAlt: "Person jouant an acoustique guitar avec focus on hands",
  },
  {
    id: "studio-3",
    title: "Rap Contenders Finale",
    author: "Urban Kivu",
    publishedAt: "3 weeks ago",
    duration: "08:45",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC12DL-JiWR3zxdv3CB595XtjFKeUO8nXHUBhuzRk6zrdQD0ny6V5HxbOj6qs1kftws5I2VwlTmeMUscS2LqMwkEwwNejAoq1oPffH1ijOsN4lMAhTzl_6hhLfz7Le7VjWEXDtXtdhdrUU9X_WWMwILUwFeKFHh45asd9ED31yjkbMMFnOvW8GMyalzkNwm8JUdH3q6A5BG9hJBSo2UsJy6sPX9mAm5tAPgy4H3CqxPigXbwqcMGhbUR-hO6rX0wpkJzDTP9CajjmE",
    imageAlt: "Rapper faisant avec hand gestures dans a dimly lit room",
  },
];

export const freestyleVideos: FreestyleVideo[] = [
  {
    id: "free-1",
    title: "Street Poetry",
    author: "MC Goma",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBVP1tvVHBdeCww4-eBTA3VZlO8HZAJ4iaL_4G7MIbNL88o8IfSPs5djqJiBVAKYJR-63Dw44b55eiFABO5mMnqQOfvV0h9_leSk7DvKmxi5EqSmTnLVQQjZuIgt4NAzDhyw0uuQRbsPbDB5fZjinxGKtrgxHmYoLmV7_Si6aaLJy6DRKkc8X0BbTPHdH9N8eQUuWP9h3MTP0ZV53hEteVfGpCZPTDiTQVccEuJq2ZfAEdVDrUUbBs0AMRzIrH64G8PIPmfsph_um0",
    imageAlt: "Portrait d'une chanteuse holding a micro avec eyes closed",
    aspect: "3/4",
    isNew: true,
    showPlayButton: true,
  },
  {
    id: "free-2",
    title: "Dance Battle",
    author: "Crew 243",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCaETITyoVIpgEmMa6OSX_UfdZFw3fh6lbBBnznzfzkamxpMP_OAw49V-XMnYRs1ctGXyXlXlAs9E5E7vJsvAUE5AgXO5KYBS4QO5b-a0HykhNzmGpGlf9EgAB71A8mT_dJz9MmWmQQV3HEeCPsmZGhpOT_OeXUyTapXB3S_NZ6MLP68hUnuVhwAZLqBPtnx5J24MDlwbgzP4sKYTKTpZSQH9vSkH6Na-VoZpYPHhwwttwXyn1143OeDHDD9K0hRuJbc9Nw1vJ-J7E",
    imageAlt: "Silhouette of a person breakdancing on concrete",
    aspect: "square",
    showPlayButton: false,
  },
  {
    id: "free-3",
    title: "Midnight Bars",
    author: "Lil' K",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBPnFs9Jo4CQJ-wNcdUDe9E1F7dhmewgaYebhMxLeQSmTyaxl8JxLSt4U__ERGjXdWGwaamgVg1XP1aOJl1J8wHEHl3YRdxw9ylGqttcDMCrvnYFxc7rgz6EEJwamX1gPonX5TGRHsFzAPXsOM7T1CGFKV4E8i9lxfHhCJ1hXcCZngmmeKW4DgoxYefqXIWRa0V3ypwoMqLffsZt2SZEVS6N9H8VJjSOIRLHeLDIzeLU_MPJrAOGUnj5_7fxbioVRqkUc_rwuIgGHo",
    imageAlt: "Homme dans un hoodie dans une rue néon la nuit",
    aspect: "9/16",
    showPlayButton: true,
  },
  {
    id: "free-4",
    title: "Beat Making",
    author: "Prod. by Z",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAhg4iTjAa2N4XUpJ7ZlxtHfMe_oyR2NxGzlGjY42e5RIbEeEt0xUf_BjsSqmckHMywextP8Ro8HZIhpWijA9xhgVS-GlejHtQYZEU-V7NdrY823ZxS-SxiG5q8facGAJxwOvQ0C7FbAhuHlet2k_VKXU2ElFHl54tmywHSWxh8G5CVvFq8Y2KAi2XA1fYUrk3WWExQXyN5uKUETPEIIrX7fCxK0keTYzRmud8w-yrP-zhM20W5KshKr3yOZHRl7kuwLPistNuIPR8",
    imageAlt: "Hands of a DJ mixing musique on a turntable",
    aspect: "square",
    showPlayButton: false,
  },
];

export const docVideos: DocVideo[] = [
  {
    id: "doc-1",
    title: "Origins: The Sound of Kivu",
    description:
      "An in-depth look at how traditional rhythms influence modern urban music in the region.",
    tag: "Doc",
    date: "Oct 24, 2026",
    duration: "24:10",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBTJm6yRd-gyv97tdAd6FqlYQ8bZ4vm4h7CjA18NL63etQgr_qXv-PI1hkGkug8FQVjuT61OL1GH_FZDBN-kGxOdOjaVzjsQhkJIWRiynSxuL8WAr6JKEjshqwFXEC9kRvs_7wg2WCghodWSalJ94thnqJZCboghRJeqjRhaa7JUkEgrsfySlXdLMUjwUAOH6G3DI-NGU76hfKTFU_sA5fls5Sp_UySlJ8ArQI5x3exnRCBS4xxXboURxza68hp_nFoElFx7QdHT6s",
    imageAlt: "Équipe de tournage filmant un documentaire dans un cadre urbain",
  },
  {
    id: "doc-2",
    title: "Street Art Revolution",
    description: "How graffiti is changing the face of Bukavu's neighborhoods.",
    tag: "Culture",
    date: "Sep 12, 2026",
    duration: "18:05",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCnbWCdVlPbvRJgwKGt1PMpUugRgJrdH00Wb26JcOHjH6n0iz83Pg0qVeQhkBb7bn8ADePTGck8BzwSzv1rw5YLrJCrUhROAJT1irDK1-D4b_OKLvc-QIC9jCXLFkigFEd-GT-QblUfxelnD2Y7-gyDYIXNG7beDHqqhVAWPgl6qtRYrcWwGy3Mcq8o-uHiWV6pcxTZNmaBOTWosKEb4pMthwzZiWcS1N_UKThALUhzghDiTS3mlaIi2D6t3a4kOiA3vfxtS9lqgK8",
    imageAlt: "Colorful street art mural on a brick wall",
  },
];
