import type { VideoPlayer } from 'expo-video';
import { useCallback, useEffect, useState } from 'react';

import type { AudioOption } from '../../domain/entities/AudioOption';
import { SUBTITLES_OFF_ID, type SubtitleOption } from '../../domain/entities/SubtitleOption';

export const QUALITY_AUTO_ID = 'auto';

export type QualityOption = { id: string; label: string; height: number };

type TrackLike = { id: string; language?: string | null; label?: string | null };
type VideoTrackLike = { id: string; size?: { width: number; height: number } | null; bitrate?: number | null };

/**
 * NOTE: subtitle/audio track API-si expo-video-da var. Manual keyfiyyət seçimi (video tracks)
 * versiyadan asılıdır: dəstəklənmirsə `qualities` boş qalır və yalnız "Auto" (adaptiv HLS) göstərilir.
 */
type TrackPlayer = {
  availableSubtitleTracks?: TrackLike[];
  subtitleTrack?: TrackLike | null;
  availableAudioTracks?: TrackLike[];
  audioTrack?: TrackLike | null;
  availableVideoTracks?: VideoTrackLike[];
  videoTrack?: VideoTrackLike | null;
  addListener(event: string, listener: () => void): { remove(): void };
};

function toLabel(track: TrackLike): string {
  return track.label || track.language || track.id;
}

export function useTracks(player: VideoPlayer) {
  const source = player as unknown as TrackPlayer;

  const [subtitles, setSubtitles] = useState<SubtitleOption[]>([]);
  const [audio, setAudio] = useState<AudioOption[]>([]);
  const [qualities, setQualities] = useState<QualityOption[]>([]);
  const [subtitleId, setSubtitleId] = useState<string>(SUBTITLES_OFF_ID);
  const [audioId, setAudioId] = useState<string | null>(null);
  const [qualityId, setQualityId] = useState<string>(QUALITY_AUTO_ID);

  const refresh = useCallback(() => {
    setSubtitles(
      (source.availableSubtitleTracks ?? []).map((track) => ({
        id: track.id,
        language: track.language ?? '',
        label: toLabel(track),
        uri: null,
      })),
    );
    setAudio(
      (source.availableAudioTracks ?? []).map((track) => ({
        id: track.id,
        language: track.language ?? '',
        label: toLabel(track),
      })),
    );
    const videoTracks = (source.availableVideoTracks ?? [])
      .filter((track) => (track.size?.height ?? 0) > 0)
      .map((track) => ({
        id: track.id,
        height: track.size?.height ?? 0,
        label: `${track.size?.height}p`,
      }))
      .sort((a, b) => b.height - a.height);
    setQualities(videoTracks);

    setSubtitleId(source.subtitleTrack?.id ?? SUBTITLES_OFF_ID);
    setAudioId(source.audioTrack?.id ?? null);
  }, [source]);

  useEffect(() => {
    refresh();
    const events = [
      'availableSubtitleTracksChange',
      'subtitleTrackChange',
      'availableAudioTracksChange',
      'audioTrackChange',
      'statusChange',
    ];
    const subscriptions = events.map((event) => {
      try {
        return source.addListener(event, refresh);
      } catch {
        return { remove: () => undefined };
      }
    });
    return () => subscriptions.forEach((subscription) => subscription.remove());
  }, [source, refresh]);

  const selectSubtitle = useCallback(
    (id: string) => {
      const track = (source.availableSubtitleTracks ?? []).find((item) => item.id === id) ?? null;
      (player as unknown as { subtitleTrack: TrackLike | null }).subtitleTrack = track;
      setSubtitleId(track ? track.id : SUBTITLES_OFF_ID);
    },
    [player, source],
  );

  const selectAudio = useCallback(
    (id: string) => {
      const track = (source.availableAudioTracks ?? []).find((item) => item.id === id);
      if (!track) return;
      (player as unknown as { audioTrack: TrackLike | null }).audioTrack = track;
      setAudioId(track.id);
    },
    [player, source],
  );

  const selectQuality = useCallback(
    (id: string): boolean => {
      if (id === QUALITY_AUTO_ID) {
        setQualityId(QUALITY_AUTO_ID);
        return true;
      }
      const track = (source.availableVideoTracks ?? []).find((item) => item.id === id);
      if (!track) return false;
      try {
        (player as unknown as { videoTrack: VideoTrackLike | null }).videoTrack = track;
        setQualityId(id);
        return true;
      } catch {
        return false;
      }
    },
    [player, source],
  );

  return {
    subtitles,
    audio,
    qualities,
    subtitleId,
    audioId,
    qualityId,
    selectSubtitle,
    selectAudio,
    selectQuality,
  };
}