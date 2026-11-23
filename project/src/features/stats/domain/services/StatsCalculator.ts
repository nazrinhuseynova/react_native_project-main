import type { GenreCount, WatchStats } from '../entities/WatchStats';

export type WatchedSample = {
  kind: 'movie' | 'tv';
  genreIds: readonly number[];
  watchedSeconds: number;
};

export type StatsInput = {
  watched: readonly WatchedSample[];
  ratings: readonly number[];
  genreNames: Readonly<Record<number, string>>;
};

export class StatsCalculator {
  calculate({ watched, ratings, genreNames }: StatsInput): WatchStats {
    const genreCounts = new Map<number, number>();
    let movies = 0;
    let series = 0;
    let seconds = 0;

    for (const sample of watched) {
      if (sample.kind === 'movie') movies += 1;
      else series += 1;
      seconds += Math.max(0, sample.watchedSeconds);
      sample.genreIds.forEach((id) => genreCounts.set(id, (genreCounts.get(id) ?? 0) + 1));
    }

    const genres: GenreCount[] = [...genreCounts.entries()]
      .map(([id, count]) => ({ id, count, name: genreNames[id] ?? '' }))
      .filter((genre) => genre.name !== '')
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    const ratingSum = ratings.reduce((sum, value) => sum + value, 0);

    return {
      totalTitles: watched.length,
      totalMovies: movies,
      totalSeries: series,
      totalHours: Math.round(seconds / 360) / 10,
      topGenre: genres[0] ?? null,
      genres,
      averageRating: ratings.length > 0 ? Math.round((ratingSum / ratings.length) * 10) / 10 : null,
      reviewCount: ratings.length,
    };
  }
}