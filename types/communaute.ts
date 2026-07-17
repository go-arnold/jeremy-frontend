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

export type ArtPost = {
  id: string;
  artist: Artist;
  timeAgo: string;
  image: string;
  caption: string;
  tags: string[];
};

// Real `/community/posts/` responses only ever have `post_type` "talent" | "art" | "news"
// (`CommunityPost.TYPE_CHOICES`) — challenges/polls are separate models fetched from their own
// endpoints (`/community/challenges/`, `/community/polls/`), never part of the posts feed.
export type FeedItem =
  | { type: "talent"; data: TalentPost }
  | { type: "art"; data: ArtPost };

// ── Real API shapes (GET /community/challenges/, /community/polls/) ─────────
export interface ApiChallenge {
  id: number;
  title: string;
  slug: string;
  description: string;
  cover_url: string | null;
  prize: string;
  deadline: string;
  participant_count: number;
  is_active: boolean;
}

export interface ApiPollOption {
  id: number;
  text: string;
  vote_count: number;
  percentage: number;
}

export interface ApiPoll {
  id: number;
  question: string;
  vote_count: number;
  options: ApiPollOption[];
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}
