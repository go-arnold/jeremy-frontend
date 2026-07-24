import type { FilterTab, TalentPost, ArtPost, FeedItem } from "@/types/communaute";
import type { ApiChallenge, ApiPoll } from "@/lib/api-types";

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

export const mockChallenges: ApiChallenge[] = [
  {
    id: -1,
    title: "Défi Freestyle : Résilience",
    slug: "defi-freestyle-resilience",
    description: "Propose ton meilleur freestyle sur le thème de la résilience.",
    cover_url: null,
    prize: "Mise en avant sur la page d'accueil",
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 26).toISOString(),
    participant_count: 124,
    is_active: true,
  },
];

export const mockPolls: ApiPoll[] = [
  {
    id: -1,
    question: "Qui a le meilleur flow cette semaine ?",
    vote_count: 1500,
    options: [
      { id: -1, text: "MC Kivu", vote_count: 930, percentage: 62 },
      { id: -2, text: "Lil Beni", vote_count: 570, percentage: 38 },
    ],
    expires_at: null,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

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
  { type: "art", data: bukavuArtPost },
];
