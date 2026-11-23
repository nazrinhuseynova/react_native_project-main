import type { DownloadItem } from '../entities/DownloadItem';

export type SmartDownloadDecision = {
  
  deleteId: string | null;
 
  nextEpisodeId: string | null;
};

const NOTHING: SmartDownloadDecision = { deleteId: null, nextEpisodeId: null };


export class SmartDownloadPolicy {
  decide(
    watched: DownloadItem | null,
    nextEpisodeId: string | null,
    enabled: boolean,
  ): SmartDownloadDecision {
    if (!enabled || !watched || watched.status !== 'completed' || !watched.episodeId) return NOTHING;
    return { deleteId: watched.id, nextEpisodeId };
  }
}