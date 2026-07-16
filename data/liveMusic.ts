import type { NowPlaying, ChatMessage, ProgramSlot } from "@/types/liveMusic";

export const nowPlaying: NowPlaying = {
  title: "Kivu Morning Flow",
  djName: "DJ P-Square",
  coverImage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBirQvLhHaZlzqjiyZP-Zn1t2TZFsdp6Pi3VhUIjBg1kCrvCr57_UmvxEYH0uSpgq-4X7v7fpdtOJMyQBv15501CxebPk-AH91QPyreAA-qUMpYwKPppnAS4qejZPTf1LnObZDP3bysOAcBzpreygmfhnCWPEOmLuluLoNUcj5qx--j4peyMHF9pkwtXTCSuv7QvWFKnbo_lxhkL1PJrZRBqn4z-Z7Q1BOssHsDzBtcnhZL6TIGgFwwOKbrOfGZoHHMrKEt6yaoZkI",
  isLive: true,
  listenerCount: 245,
};

export const chatMessages: ChatMessage[] = [
  {
    id: "msg-1",
    username: "Patou",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA1UHF0LvYygODikuhuy8FQow21uJ_VMziyPaKB3wtsexcmcdW-a7zBQgA08P0trzCsACiSGw4QSsSYsKV69oXCyBgAXh9To_FIDERYtzmrFiQ7x2PYezgKqnZehJiTVu9QoIjyHIBzaM250ddH6KpSx2Tq-mMJeLWrzfhLjcZrFJRU1y8i3kIJPGZSo0kX_cH6WBgJbOBzpXnWvo9SfFAVgzp6ESYGJHgx5PrOZYqbxR1DD50fseC-4MpW2Colw_f0h1ZDlzrhxGU",
    message: "Le son est bon ! 🔥 Goma représente !",
    tag: "#KivuVibes",
    timeAgo: "2m",
  },
  {
    id: "msg-2",
    username: "Sarah K.",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBie_bP7cBY_dC31GEeaR2qxY_i3LtEvSdY06heQakn-5AUzyguhkbyUNBg8PPecnQACpKqG1P54a7e8TsdQnHRJDvIGJwjOc4i3fl8ENkB29dQBNC1wAlNtiYWsVAuZVhqrKi0mVaALRRnRaPDkofpw6CrMeE_qZAxFd8W-aYbJLaLRV2qbZ28eGLyrpFPgLcB5XD4zn_LR9ANm5j6BNiGhE5kLSZOWPfSgk0hcBM0lsvaiw7L2gykqnjZD_B7XL6efRbTwYvBvG4",
    message: "Big up DJ P-Square ! J'adore ce morceau. ❤️",
    timeAgo: "À l'instant",
  },
];

export const programSlots: ProgramSlot[] = [
  {
    id: "slot-1",
    time: "10:00",
    title: "Morning Flow",
    subtitle: "Infos, trafic & vibes",
    icon: "mic_external_on",
    status: "on-air",
  },
  {
    id: "slot-2",
    time: "12:00",
    title: "Patrimoine urbain",
    subtitle: "Plongée culturelle",
    icon: "museum",
    status: "upcoming",
  },
  {
    id: "slot-3",
    time: "13:00",
    title: "Parole des jeunes",
    subtitle: "Débat & Vox Pop",
    icon: "groups",
    status: "upcoming",
  },
];
