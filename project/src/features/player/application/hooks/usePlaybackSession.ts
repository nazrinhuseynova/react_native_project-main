import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useServices } from '@/bootstrap/useServices';
import { isSeries, useTitleDetails } from '@/features/catalog';

import {
  NextEpisodeResolver,
  toEpisodeId,
  type EpisodeRef,
} from '../../domain/services/NextEpisodeResolver';
import { playerKeys } from '../playerKeys';

const nextResolver = new NextEpisodeResolver();

export function usePlaybackSession(titleId: string | null, episode: EpisodeRef | null) {
  const { player } = useServices();
  const episodeId = episode ? toEpisodeId(episode) : null;

  const session = useQuery({
    queryKey: playerKeys.session(titleId, episodeId),
    queryFn: () => player.resolvePlayback.execute({ titleId: titleId as string, episodeId }),
    enabled: !!titleId,
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });

  const segments = useQuery({
    queryKey: playerKeys.segments(titleId, episodeId),
    queryFn: () => player.skipSegments.listFor(titleId as string, episodeId),
    enabled: !!titleId,
  });

  const { details } = useTitleDetails(titleId);

  const nextEpisode = useMemo<EpisodeRef | null>(() => {
    if (!episode || !details || !isSeries(details.title)) return null;
    return nextResolver.resolve(
      episode,
      details.title.seasons.map((season) => ({
        seasonNumber: season.seasonNumber,
        episodeCount: season.episodeCount,
      })),
    );
  }, [episode, details]);

  return {
    session: session.data ?? null,
    segments: segments.data ?? [],
    nextEpisode,
    titleName: details?.title.name ?? '',
    isLoading: session.isLoading,
    error: session.error,
    refetch: session.refetch,
  };
}