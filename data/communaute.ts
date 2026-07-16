import type {
  FilterTab,
  TalentPost,
  Challenge,
  Poll,
  ArtPost,
  FeedItem,
} from "@/types/communaute";

export const filterTabs: FilterTab[] = [
  { id: "pour-toi", label: "Pour toi" },
  { id: "defis", label: "Défis" },
  { id: "goma", label: "Goma" },
  { id: "bukavu", label: "Bukavu" },
];

const gomaKing: TalentPost = {
  id: "post-1",
  artist: {
    id: "gomaking",
    username: "GomaKing",
    location: "Goma, RDC",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBHrm8Y90b0qpX_GJpBh_WKTUZr5_VIBjjwYqzSoeBJVdzW4Q4tmN_wqIRC10Ngf0h1KSxEiE4RHcs4T4oRMNPe2KkplfIRPA9k7zd7ZDitv74h7gyRsaJCcJ3rKarpak2KnI6Ptzf2lmHHVWUZjpsjUXHL7AFlkhVLLKJGQqSk_GvFNyWCn02N0n1vHi1GyI2Pv4i5DOu2X5LIjCzWtIMrexayhoHFjkmbVA_iDMgxt8svYMytSateDo81we2lPE8c-GMvMAzXelY",
  },
  timeAgo: "2h",
  title: "Nouveau son studio",
  coverImage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB0FnwZ3gSltbltd8l94NzrQjpeJUvyUtEJ-TPqYf_quLTT8925uss3CCwJdDjmOWDe-WeW3rAlDjn10VWGR2KiQ-2Kr_Yj7rfCPsPtTgQW4mTFx73tGKoyTNJg2L94tOg5Me0l6wITk-sntgElj7vV-KSfuIB99Ace2KfBb_UU2P5-XekZCSWG2yCTJahzOZGTCN9dO3BzK2e1p_8eHXYO4mc__igcbg57PH02P3fPlwKWwbU9Xjz4Adg2F3tJdGDoR59gPfCjS0Q",
  duration: "02:14",
  likes: 1200,
  comments: 45,
  caption: "Nouveau son en direct du studio ! 🔥 Le mix est lourd. Dites-moi ce que vous en pensez en commentaires.",
  tags: ["#KivuRap", "#Goma", "#NouveauSon"],
  type: "audio",
};

const freestyleChallenge: Challenge = {
  id: "challenge-1",
  theme: "Résilience",
  endsIn: "04:12:59",
  isLive: true,
  participants: {
    avatars: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDOqIJc1IHBb6vNaHZz1mlvEvyU81kbif74P3saVIdhvX8EUdZ7SIrWVoCaOKmS7UW_CNFz1zDS6LSPD_5yBJMrlz9yF3V99PYtBX6-IeZVv0rgl4svqlMgm7HTVkxOYZ13Rzb8ht6UPhKJr3hD2JKM4WiVGuZbUrkdWMixoTRvgSih2TZbFRRN3KzEYNbwPxr3XCAhoVZPhdJ4vLCyy07jXMj1QcbtmgUy1L0gZHjAD7wyiLAP6a4JVPCEGVS7K6FK9YQnbNO6UJU",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC8BV3jefXV6wqVrGWIa_6oanKBzVYdRE4YDjQrO64M7Td8UabQyUdnxLHMV77U3phbyTa7jia3e03N-oz8_28171izVK0yY4CM846z_Q8xMqTwWUKGaqXxa8843VbW6dUl1Uv5uVfP-DzEBHHrAPZ6eQB8V93hBa2BRGwb0rRihjaGaNJ4Kmn_Qlq6tGpzXrCu-nRacDKU-nImDZRvX_7hyZc0aQZI93UyvuhABFUGV0eXkAzteCOP86owtrI82xld6sNgQGWj6GE",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC1iJCYAkBtlx-E09sZOaJ_QP86Lpn4ABem5Ngn4Xf-Ak9SiZtR3BvovHdq0tq5db1pBDj-EcR-wVilCbInXjjVSo9u_RcmBIdbU8AIrkK5uHcg0WhgXlGlFx8wb1aasJ-wIxFBfDy3SYGe2H-DU7vvrHhsFmA_Tm9C0u-2zn-msYKVVtdefB8orM_Agt1vqaxV1FUkrTjWUYu0ASucAqhGpXnovjGoXUUtBatu4_Jhz3-SxOFE-mlN2DfBJVhLpyKk6TtgKZF-Nvw",
    ],
    extraCount: 124,
  },
};

const flowPoll: Poll = {
  id: "poll-1",
  question: "Qui a le meilleur flow cette semaine ?",
  totalVotes: 1500,
  options: [
    { id: "mc-kivu", label: "MC Kivu", percentage: 62, isLeading: true },
    { id: "lil-beni", label: "Lil Beni", percentage: 38, isLeading: false },
  ],
  voterAvatars: [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCPaXR1h-TRPVZ73cnEOXLfx_8hN7fALXMUhAkKgSdwsnsA6yIsdP2kDvE6hkosjjiU5Y7xObwN8DpJGLpWC77Bf6Ye9WhguerFab9OYkLV-Z7Gt0SgDaAzObdZRRjesIfTCrabXalkKZ4siDX6GLQeovumvO28bCcuFdcv5O9Vsw3fy8_YsVXAPmK1xHW65J82uNfH_FDJvWTB-e1JQBjHW5gnjWZ6yhMH7XfEnQ9DbxktRqjQw8Cy9oKznVIZVaa0vOAKrSGkZqo",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB1p6P-3k8b0gvbAOgavLvA0EYPo1iNfuMTsbQ7RiPG7jLHpvNASMzLPje3UIHidTmxDUVJxKPoNK-BaxjGAmbpIrvNPdwkoLymVZn9CPuzRS8JV86iZdgddn6DoqXFiV3Avz-iKEu9UhivxZeFU6txJRRn_qyjQBKziv9eZ1XePiqG1Q_3jb0TyW97YVyGxES6R70WFA4Jb4Qh1SUizSCKTkvD01lhodeU1ucFEHRFJNIdlejd-Ai6oQsPECTJHG17UVtrkJqd1Ls",
  ],
};

const bukavuArtPost: ArtPost = {
  id: "art-1",
  artist: {
    id: "bukavuart",
    username: "BukavuArt",
    location: "Bukavu, RDC",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDl6FBJr9vE9j49TLxr65K5vhEEqbvAelqH72mvPbWZhu_foJWTiyHNdm2khQqpQ6w-wf2YsI7heaoMz_omU5dWJW_0LJLdFTRr7UADKWkMDmkA0RBqWaqIE8WDxyfQUq8TOwtSYvoCVi9GOtmt9xJSYp0s2NEIy_5QpeYdH4Ce1NzjI874ml0XbLtojHT3uaxoVE9cdMBe8vxVP02JgxhuhUT_gGpY9T_DuY60O2agRBrNyYBM9jPvt8P7YXJvl3LFp5mzSPcwB7A",
  },
  timeAgo: "5h",
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBdAx6AlH1pK88dG7EilEMF58IQfSYltZXrWxXRnfBzZGx41q1ed0lwhCkBXpYOR9aAHBdIaNn9HWBaSkmUDcpQSWkU0NHT10WVq15OfQ_5RXBb8gGh8YlsvQqH_F0ASlnsgynM-wG_AGOccL_OYxhzrIFM6dmhDPRB8Ite-IJLQlfmNRmsLTPG16M8fvTjf3vlX1sCsq5N8mV6R3iwe0YXp3TPpzC83yNO9TZTMXQPb3M17w5hUz5F56gkHhyqp_z1MS4w3g4P1Tg",
  caption: "Les couleurs de ma ville. 🎨",
  tags: ["#StreetArt", "#Bukavu", "#Culture"],
};

export const feedItems: FeedItem[] = [
  { type: "talent", data: gomaKing },
  { type: "challenge", data: freestyleChallenge },
  { type: "poll", data: flowPoll },
  { type: "art", data: bukavuArtPost },
];
