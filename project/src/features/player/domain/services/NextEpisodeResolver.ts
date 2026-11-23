export const NEXT_EPISODE_WINDOW_SEC = 20;

export type EpisodeRef = { seasonNumber: number; episodeNumber: number };
export type SeasonInfo = { seasonNumber: number; episodeCount: number };

export function toEpisodeId(ref: EpisodeRef): string {
  return `s${ref.seasonNumber}e${ref.episodeNumber}`;
}

export function parseEpisodeId(id: string | null): EpisodeRef | null {
  if (!id) return null;
  const match = /^s(\d+)e(\d+)$/.exec(id);
  if (!match) return null;
  return { seasonNumber: Number(match[1]), episodeNumber: Number(match[2]) };
}

export class NextEpisodeResolver {
  resolve(current: EpisodeRef, seasons: readonly SeasonInfo[]): EpisodeRef | null {
    const ordered = seasons
      .filter((season) => season.seasonNumber > 0 && season.episodeCount > 0)
      .sort((a, b) => a.seasonNumber - b.seasonNumber);

    const season = ordered.find((item) => item.seasonNumber === current.seasonNumber);
    if (season && current.episodeNumber < season.episodeCount) {
      return { seasonNumber: season.seasonNumber, episodeNumber: current.episodeNumber + 1 };
    }

    const nextSeason = ordered.find((item) => item.seasonNumber > current.seasonNumber);
    return nextSeason ? { seasonNumber: nextSeason.seasonNumber, episodeNumber: 1 } : null;
  }

  shouldPrompt(positionSec: number, durationSec: number, windowSec = NEXT_EPISODE_WINDOW_SEC): boolean {
    if (durationSec <= 0) return false;
    const remaining = durationSec - positionSec;
    return remaining > 0 && remaining <= windowSec;
  }

  remaining(positionSec: number, durationSec: number): number {
    return Math.max(0, Math.ceil(durationSec - positionSec));
  }
}