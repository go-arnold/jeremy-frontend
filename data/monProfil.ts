import type {
  UserProfile,
  ProfileStat,
  FavoriteArtist,
  ListenHistoryItem,
  Badge,
} from "@/types/monProfil";

export const userProfile: UserProfile = {
  displayName: "Amani Juma",
  handle: "@urbanKivu",
  bio: "Amateur de musique",
  coverImage:     
    "https://th.bing.com/th/id/OIP.-nMStko-OOVvPxIuojNJyQHaCe?w=286&h=116&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",

  avatar:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBqRhGXi71k6Xn2leGjLetAO6P6K0G59T7HZMbH7gfLL48Eun1okdXKFf56ysK_ETsggv623CqAlohWGI9btNB6sGFXSS47_IpsW85j8Irw6kCdBoEVM3gF7dmLRDQtjInkAoXDZoe8C8ds9xgU19GiMZTi7ddI5VNqSzVktt2KOT3aO--NlrOVFZbCtukS2gcWny6lPL67-dbPvJ-mu15j8kKQrKg1X9K77TxWzZ55SPMYDDXYyL_miYyCs3wSwV4KqUM-mSmQsBM",
  isOnline: true,
};

export const profileStats: ProfileStat[] = [
  { id: "ecoute", value: "24h", label: "Écouté" },
  { id: "artistes", value: "12", label: "Artistes" },
  { id: "badges", value: "5", label: "Badges" },
];

export const favoriteArtists: FavoriteArtist[] = [
  {
    id: "fally",
    name: "Fally I.",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDS6v2Nb8LMZZioyxO6kVwWO1CGhC9W9cfui4-dEYhxrJ3Zcd9UqbnaVPhqkTKyCHMnbRjvB70lyja-MQAV_y-sKiPjRJAw3IiDlLQfIDibHZnUq77plGlblPtb264NJ-taRgTX8O0NoLp-tHv4neCYivnWDOWhrNw5ta2WjGwxkt9Gxn-w0nq0qKm3sHLb48TgcjkahJSs2bBAhxG8k611QOA5Uzqiqwgd8050OPXLOlF9Lo0zdc3c6MMkNRbC8s8Ax4mI9hAiBuY",
  },
  {
    id: "innossb",
    name: "Innoss'B",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB491uGg5g8sD49itA4bUuhTWTwcBM0SARGEogroiwDhgMoeil2EuRm8h6ge5H0_lpZ7sh-895GlFTsDug8iXmEeY0brXWgg-nYmdQOw23W1YcCU0isayC8d4xqzPDpgfVw16e0TGxOY_Xreazv1YBEMIR9SQTJDC2h66rRVtmhjTAqNo5nMGUkjadFaADkrgnJ608schGCOmakGq1S5SmSfVqqdCd96rplD5wMDZzGjryG_zvSbiqOBT2l_eVrnd45sPIOJztdtoc",
  },
  {
    id: "dadju",
    name: "Dadju",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDfer4iMSXC7ENoobWX6420W7ePm_3nBbp9iaTxkF758ADGURtqWONhCNm6DWMWr-tnMRYKWiuXEdmhWrxKwKU6Eh9FdsVE-0QTHmqxVcffPvRHz_-wWgTBKTnrVLN-5tOAhF0j95XfoSBrbqwl8iKFNRT3_SLZWFrDsLsD_17pOnoZIbhCxGTluVTpUWDMaT-H-2PC2QSD6QAdxEXENtkXvVQ8RvxKrD6eoxWyNoAW0gOTlEl5F4_PIX6iAz_DhOW6G1_47qmP3dg",
  },
  {
    id: "diamond",
    name: "Diamond",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAO6a2bB5EcwT7nKKfcrgIZofbxETLby1Y4v6ZyAUPHgSwKOQcpkoDiM8bNki5OnitwSnBjgZ3sKzjEj62026oO5nlH71-OnBmQgvpSOFi0H0eC8yc44ZWpOrdMGSrB-j2KXOFcfeFLmxCD7z4q7_0LrpyPHacHd27jB25wgFpo4NRYefptP0ceBtiuyGhvzZSkhiGEZy0LVNKraeIOmO-6RlMCfq-6mXUlShX2jozzdIqKbvh8auwqtb5RdV0WZJ16EBugI8PzUUg",
  },
];

export const listenHistory: ListenHistoryItem[] = [
  {
    id: "history-1",
    status: "idle",
    title: "Le Kivu Matin",
    subtitle: "Radio Direct • 10:00",
    coverImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuClEfqpVgnumchc2wHSwsTN637hL9k79CqfsDMdFMUT14-_qwW7yYfTq0TbvHlM_0Q3GgtRyrX6Qlu9xdU462J4FGX3R0oP5VKdhUe5y2bxQBT8Z65C10K6sblEbMEV6XTIXo2bZ1c5oyGWQ1qGyFvBRUitC-pBNNBMffNHjsqawKIOqxcXIpdBuy93VdfkhV27jSjnis5Hvcxu5TSL_hryKXkqDnkx2hSIoUWb8EwWvXM6ChZEuOOQBdHvfJa-aGYW1JAzjc19BA0",
    accentColor: "bg-orange-500/20",
    iconColor: "text-orange-500",
    icon: "radio",
  },
  {
    id: "history-2",
    status: "playing",
    title: "Vibes urbaines Ép. 4",
    subtitle: "",
    coverImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDzXHDIe9ZQup9a6OmklE1w3naBU6cj9m6-KpoNhTRqs62SxjPjqKzD215SVIqH-aWy1OGbq57sQFdOn1dC9xm0I5_jS4wF_KVp8RSI__dwL1hIGt1XjK2byF6qXM2qfhqty_pJoerMVUxBrrqJhvERTESW_DpdXGXSMTL5qHssbMJbZEAoeacT-zglVt1YwCf3Vt0C4iDNU2jfTzUBXLCViMJ94jxWK0KsMSD-_On842yi24LiNeTc7--BjYPIJlbo2YRGYFGzqbk",
    accentColor: "bg-purple-500/20",
    iconColor: "text-purple-400",
    icon: "podcasts",
    progressPercent: 50,
    timeRemaining: "Reste 15m",
  },
];

export const badges: Badge[] = [
  {
    id: "super-fan",
    icon: "mic",
    label: "Super\nFan",
    color: "text-yellow-400",
    glowColor: "rgba(250,204,21,0.2)",
    unlocked: true,
  },
  {
    id: "explorateur",
    icon: "explore",
    label: "Explorateur\nKivu",
    color: "text-primary",
    glowColor: "rgba(0,178,161,0.25)",
    unlocked: true,
  },
  {
    id: "collection",
    icon: "album",
    label: "Collection.\nVinyle",
    color: "text-pink-500",
    glowColor: "rgba(236,72,153,0.2)",
    unlocked: true,
  },
  {
    id: "locked",
    icon: "lock",
    label: "",
    color: "",
    glowColor: "",
    unlocked: false,
  },
];
