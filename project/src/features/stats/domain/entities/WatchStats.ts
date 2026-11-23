export type GenreCount = {
  id: number;
  name: string;
  count: number;
};

export type WatchStats = {
  totalTitles: number;
  totalMovies: number;
  totalSeries: number;
  totalHours: number;
  topGenre: GenreCount | null;
  genres: GenreCount[];
  averageRating: number | null;
  reviewCount: number;
};

export const EMPTY_WATCH_STATS: WatchStats = {
  totalTitles: 0,
  totalMovies: 0,
  totalSeries: 0,
  totalHours: 0,
  topGenre: null,
  genres: [],
  averageRating: null,
  reviewCount: 0,
};