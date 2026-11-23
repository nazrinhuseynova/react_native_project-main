import { downloadKey } from '../entities/DownloadItem';

export type ForYouCandidate = {
  titleId: string;
  episodeId: string | null;
  title: string;
  posterPath: string | null;
  estimatedBytes: number;
};

const BYTES_PER_GB = 1024 ** 3;

/** İstifadəçinin ayırdığı GB limitinə uyğun namizədləri seçir. */
export class DownloadsForYouPolicy {
  select(
    candidates: readonly ForYouCandidate[],
    usedBytes: number,
    limitGb: number,
    alreadyDownloaded: ReadonlySet<string>,
  ): ForYouCandidate[] {
    let budget = limitGb * BYTES_PER_GB - usedBytes;
    const picked: ForYouCandidate[] = [];

    for (const candidate of candidates) {
      if (alreadyDownloaded.has(downloadKey(candidate.titleId, candidate.episodeId))) continue;
      if (candidate.estimatedBytes > budget) continue;
      budget -= candidate.estimatedBytes;
      picked.push(candidate);
    }
    return picked;
  }
}