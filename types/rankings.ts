export interface TopArtistItem {
  id: string;
  slug: string;
  name: string;
  bio: string;
  image: string;
  href: string;
}

export interface TopReleaseItem {
  id: string;
  slug: string;
  title: string;
  image: string;
  artists: string;
  listens: number;
  href: string;
}
