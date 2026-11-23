export type Video = {
  id: string;
  key: string;
  site: string;
  name: string;
  type: string;
  official: boolean;
  publishedAt: string | null;
};

export function pickTrailer(videos: readonly Video[]): Video | null {
  const youtube = videos.filter((video) => video.site === 'YouTube');
  const trailers = youtube.filter((video) => video.type === 'Trailer');
  const pool = trailers.length > 0 ? trailers : youtube.filter((video) => video.type === 'Teaser');
  const sorted = [...pool].sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''));
  return sorted.find((video) => video.official) ?? sorted[0] ?? null;
}

export function youTubeUrl(video: Video): string {
  return `https://www.youtube.com/watch?v=${video.key}`;
}