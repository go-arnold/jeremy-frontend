import type { LiveShow, ProgramSlot, MembershipBanner } from "@/types/radio";

export const liveShow: LiveShow = {
  title: "Kivu Morning Flow",
  host: "DJ P-Square",
  listenerCount: "1.2k",
  isPlaying: true,
  imageUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDDKa4RfLf3yt_VWFPhaKMHiMnrx59fByK3ZybsAxSj2jIrkM5x1A8gVWx_1hM8izNhHG1-7xjEIEXPYQ7mRXOBFa-JHRSb4N-xXPmpSrMUyPmgIMNsvyPbACN3mQuHfPO3kc4ZzdGYehkVooJUx2Zl4wbOKVYRqN3FVfd34orMr86n8tsfDRBLG8dx4zOsROb4UzJVyHCaqTlL_qupJHaeHBM6f-o_Vd-w5XP1KvBexssIu3SOC-dORTn0uZ1y706Q6Ktgnnr9GWg",
  imageAlt: "Animateur radio dans un studio professionnel avec microphones",
  messages: [
    {
      id: "msg-1",
      username: "Amani_K",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBRzy9RK1DOj0iFtaIyyUM0JBkGCh0nwLBY-nzCwJDecuCYql2cNmRfoKVmfodVJ6jnpTLz3fdxlKOR1MUKq87I21QQ65TsrWE4RtSFOLYYctPjyktG3LKkIEXSWlxbo-hcgDzoNFFazMXfxc3f7APQVOZzROc1HURJctyp8s0yVrIpke3SrF70vNoPp4YNwKNoC-h5bQUuAZN1umao9xIHVORvQfSC22OutNHyozVFAWJ5Y7g4ZpzfG6JfRQD9v54w8rK3VKWESu0",
      text: "Best morning vibes from Goma! 🔥",
      timeLabel: "2m",
    },
    {
      id: "msg-2",
      username: "Zawadi.M",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCBiSpY1U1iOyEEcSo9O9sNXfhgBO0X2H39hAZWbupUEjUR1k7m4pHLcMPGl_y9G8rSIROFBkqZNT6ODbzepbRYPqepkwqLHJBUg4l8MDNaoJl1kBE_AVBhBKGbcKbNHtgxGgpf5KpW27HDzluEOInl3dMJ0DE1fRbICT_P-hS9dM9HoLoTP9oTPEdrV3qleasll4OcfpTJDo69o2pjQKkUmNqcQVKuYAeP_ME_z0d-Cz8QtGkZgKrKPc38XV-gFKNK7CJoqLinZNM",
      text: "Slay the day with those beats!",
      timeLabel: "Now",
    },
  ],
};

export const programSlots: ProgramSlot[] = [
  {
    id: "slot-1",
    status: "now",
    time: "08:00",
    title: "Kivu Morning Flow",
    host: "DJ P-Square",
  },
  {
    id: "slot-2",
    status: "next",
    time: "10:00",
    title: "Héritage urbain",
    host: "Béatrice N.",
  },
  {
    id: "slot-3",
    status: "later",
    time: "12:00",
    title: "Youth Talk",
    host: "The Squad",
  },
];

export const membershipBanner: MembershipBanner = {
  title: "Support Kivu Art",
  subtitle: "Join our membership to access exclusive sessions.",
  ctaLabel: "En savoir plus",
};
