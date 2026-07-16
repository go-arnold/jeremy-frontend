export type FilterTab = {
  id: string;
  label: string;
};

export type Artist = {
  id: string;
  username: string;
  location: string;
  avatar: string;
};

export type TalentPost = {
  id: string;
  artist: Artist;
  timeAgo: string;
  title: string;
  coverImage: string;
  duration: string; // e.g. "02:14"
  likes: number;
  comments: number;
  caption: string;
  tags: string[];
  type: "audio" | "video" | "image";
};

export type Challenge = {
  id: string;
  theme: string;
  endsIn: string; // countdown string e.g. "04:12:59"
  participants: {
    avatars: string[];
    extraCount: number;
  };
  isLive: boolean;
};

export type PollOption = {
  id: string;
  label: string;
  percentage: number;
  isLeading: boolean;
};

export type Poll = {
  id: string;
  question: string;
  totalVotes: number;
  options: PollOption[];
  voterAvatars: string[];
};

export type ArtPost = {
  id: string;
  artist: Artist;
  timeAgo: string;
  image: string;
  caption: string;
  tags: string[];
};

export type FeedItem =
  | { type: "talent"; data: TalentPost }
  | { type: "challenge"; data: Challenge }
  | { type: "poll"; data: Poll }
  | { type: "art"; data: ArtPost };
