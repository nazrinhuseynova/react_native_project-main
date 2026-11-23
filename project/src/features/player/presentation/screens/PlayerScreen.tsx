import type { VideoView } from 'expo-video';
import { useKeepAwake } from 'expo-keep-awake';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useServices } from '@/bootstrap/useServices';
import { AppError } from '@/core/errors/AppError';
import { toUserMessage } from '@/core/errors/toUserMessage';
import { useSecureScreen } from '@/core/security/useSecureScreen';
import { titleIdFromRoute, toRouteParams, type TitleId } from '@/features/catalog';
import { useSettings } from '@/features/settings';
import { useBackHandler } from '@/shared/hooks/useBackHandler';
import { makeStyles } from '@/shared/theme/makeStyles';
import { Button } from '@/shared/ui/Button';
import { ErrorState } from '@/shared/ui/ErrorState';

import type { GestureActions } from '../../application/gestures/GestureStrategy';
import { useBrightness } from '../../application/hooks/useBrightness';
import { useControlsVisibility } from '../../application/hooks/useControlsVisibility';
import { useOrientationLock } from '../../application/hooks/useOrientationLock';
import { usePictureInPicture } from '../../application/hooks/usePictureInPicture';
import { usePlaybackEvents } from '../../application/hooks/usePlaybackEvents';
import { usePlaybackSession } from '../../application/hooks/usePlaybackSession';
import { usePlaybackSpeed } from '../../application/hooks/usePlaybackSpeed';
import { usePlayerController } from '../../application/hooks/usePlayerController';
import { useScreenLock } from '../../application/hooks/useScreenLock';
import { useTracks } from '../../application/hooks/useTracks';
import { overlayRegistry } from '../../application/overlays/overlayRegistry';
import type { OverlayContext } from '../../application/overlays/PlayerOverlay';
import type { SkipSegment } from '../../domain/entities/SkipSegment';
import { formatSpeed } from '../../domain/entities/PlaybackSpeed';
import type { EpisodeRef } from '../../domain/services/NextEpisodeResolver';
import { toEpisodeId } from '../../domain/services/NextEpisodeResolver';
import type { PlaybackSession } from '../../domain/usercases/ResolvePlayback';
import { CastButton } from '../components/CastButton';
import { GestureLayer } from '../components/GestureLayer';
import { LockToggle } from '../components/LockToggle';
import { PipButton } from '../components/PipButton';
import { PlayerControls } from '../components/PlayerControls';
import { QualitySheet } from '../components/QualitySheet';
import { SpeedSheet } from '../components/SpeedSheet';
import { TracksSheet } from '../components/TracksSheet';
import { VideoSurface } from '../components/VideoSurface';

const useStyles = makeStyles(() => ({
  root: { flex: 1, backgroundColor: '#000000' },
  center: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  lockSlot: { position: 'absolute' as const, left: 24, top: '42%' },
}));

type Sheet = 'speed' | 'tracks' | 'quality' | null;

type ContentProps = {
  titleId: TitleId;
  episode: EpisodeRef | null;
  session: PlaybackSession;
  segments: SkipSegment[];
  nextEpisode: EpisodeRef | null;
  titleName: string;
};

function PlayerContent({ titleId, episode, session, segments, nextEpisode, titleName }: ContentProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const styles = useStyles();
  const { player: playerServices } = useServices();
  const { settings } = useSettings();
  const videoRef = useRef<VideoView>(null);

  const [sheet, setSheet] = useState<Sheet>(null);
  const [scrubbing, setScrubbing] = useState(false);

  const controller = usePlayerController(session.source, session.startPositionSec);
  const { seekBy, seekTo, getVolume, setVolume, positionRef } = controller;
  const episodeId = episode ? toEpisodeId(episode) : null;

  const { notifySeek } = usePlaybackEvents({
    titleId,
    episodeId,
    isPlaying: controller.isPlaying,
    isBuffering: controller.isBuffering,
    ended: controller.ended,
    positionSec: controller.positionSec,
    durationSec: controller.durationSec,
  });

  const lock = useScreenLock();
  const controls = useControlsVisibility(!controller.isPlaying || sheet !== null || scrubbing);
  const { getBrightness, setBrightness } = useBrightness();
  const speed = usePlaybackSpeed(controller.player);
  const tracks = useTracks(controller.player);
  const pip = usePictureInPicture(videoRef);

  useBackHandler(() => true, lock.isLocked);

  const playNext = useCallback(() => {
    if (!nextEpisode) return;
    const route = toRouteParams(titleId);
    router.replace({
      pathname: '/player/[id]',
      params: {
        id: route.id,
        type: route.type,
        season: String(nextEpisode.seasonNumber),
        episode: String(nextEpisode.episodeNumber),
      },
    });
  }, [nextEpisode, router, titleId]);

  useEffect(() => {
    if (controller.ended && nextEpisode && settings.autoplay) playNext();
  }, [controller.ended, nextEpisode, settings.autoplay, playNext]);

  const handleSeekTo = useCallback(
    (sec: number) => {
      notifySeek(positionRef.current, sec);
      seekTo(sec);
    },
    [notifySeek, positionRef, seekTo],
  );

  const handleSeekBy = useCallback(
    (delta: number) => {
      const from = positionRef.current;
      seekBy(delta);
      notifySeek(from, from + delta);
    },
    [notifySeek, positionRef, seekBy],
  );

  const gestureActions = useMemo<Omit<GestureActions, 'showHud'>>(
    () => ({ seekBy: handleSeekBy, getBrightness, setBrightness, getVolume, setVolume }),
    [handleSeekBy, getBrightness, setBrightness, getVolume, setVolume],
  );

  const overlayContext: OverlayContext = {
    titleId,
    positionSec: controller.positionSec,
    durationSec: controller.durationSec,
    isBuffering: controller.isBuffering,
    controlsVisible: controls.visible,
    segments,
    nextEpisode,
    seekTo: handleSeekTo,
    playNext,
  };

  const subtitle = episode ? `S${episode.seasonNumber}:E${episode.episodeNumber}` : undefined;

  if (controller.errorMessage) {
    return (
      <View style={styles.center}>
        <ErrorState title={t('player.errors.playback')} onRetry={() => router.back()} retryLabel={t('common.back')} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      <VideoSurface ref={videoRef} player={controller.player} onPipStart={pip.onEnter} onPipStop={pip.onExit} />

      {!lock.isLocked && !pip.isInPip ? (
        <GestureLayer actions={gestureActions} onToggleControls={controls.toggle} />
      ) : null}

      {overlayRegistry
        .all()
        .filter((overlay) => overlay.shouldShow(overlayContext))
        .map(({ id, Component }) => (
          <Component key={id} ctx={overlayContext} />
        ))}

      {!lock.isLocked && !pip.isInPip ? (
        <PlayerControls
          title={titleName}
          subtitle={subtitle}
          visible={controls.visible}
          isPlaying={controller.isPlaying}
          positionSec={controller.positionSec}
          durationSec={controller.durationSec}
          bufferedSec={controller.bufferedSec}
          speedLabel={formatSpeed(speed.speed)}
          hasNext={nextEpisode !== null}
          onBack={() => router.back()}
          onTogglePlay={controller.toggle}
          onSeekBy={handleSeekBy}
          onSeek={handleSeekTo}
          onScrubStart={() => setScrubbing(true)}
          onScrubEnd={() => setScrubbing(false)}
          onOpenSpeed={() => setSheet('speed')}
          onOpenTracks={() => setSheet('tracks')}
          onOpenQuality={() => setSheet('quality')}
          onNext={playNext}
          cast={<CastButton cast={playerServices.cast} onPress={() => void playerServices.cast.connect()} />}
          pip={<PipButton supported={pip.isSupported} onPress={pip.enter} />}
          lock={<LockToggle locked={false} onPress={lock.lock} />}
        />
      ) : null}

      {lock.isLocked ? (
        <View style={styles.lockSlot}>
          <LockToggle locked onPress={lock.unlock} />
        </View>
      ) : null}

      <SpeedSheet visible={sheet === 'speed'} speed={speed.speed} onSelect={speed.setSpeed} onClose={() => setSheet(null)} />
      <TracksSheet
        visible={sheet === 'tracks'}
        audio={tracks.audio}
        subtitles={tracks.subtitles}
        audioId={tracks.audioId}
        subtitleId={tracks.subtitleId}
        onSelectAudio={tracks.selectAudio}
        onSelectSubtitle={tracks.selectSubtitle}
        onClose={() => setSheet(null)}
      />
      <QualitySheet
        visible={sheet === 'quality'}
        qualities={tracks.qualities}
        selectedId={tracks.qualityId}
        onSelect={tracks.selectQuality}
        onClose={() => setSheet(null)}
      />
    </View>
  );
}

export function PlayerScreen() {
  const params = useLocalSearchParams<{ id?: string; type?: string; season?: string; episode?: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const styles = useStyles();

  const titleId = titleIdFromRoute(params.id, params.type);
  const episode = useMemo<EpisodeRef | null>(() => {
    const seasonNumber = Number(params.season);
    const episodeNumber = Number(params.episode);
    return Number.isInteger(seasonNumber) && Number.isInteger(episodeNumber) && params.season && params.episode
      ? { seasonNumber, episodeNumber }
      : null;
  }, [params.season, params.episode]);

  useOrientationLock();
  useKeepAwake();
  useSecureScreen(true, 'player');

  const state = usePlaybackSession(titleId, episode);

  if (!titleId) {
    return (
      <View style={styles.center}>
        <ErrorState title={t('errors.notFound')} onRetry={() => router.back()} retryLabel={t('common.back')} />
      </View>
    );
  }

  if (state.isLoading) {
    return (
      <View style={styles.center}>
        <StatusBar hidden />
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  if (state.error || !state.session) {
    const notEntitled = state.error instanceof AppError && state.error.code === 'NOT_ENTITLED';
    return (
      <View style={styles.center}>
        <ErrorState
          title={t(toUserMessage(state.error))}
          onRetry={notEntitled ? undefined : () => void state.refetch()}
        />
        {notEntitled ? (
          <View style={{ width: 260, marginBottom: 24 }}>
            <Button label={t('player.seePlans')} onPress={() => router.replace('/billing/plans')} />
            <Button label={t('common.back')} variant="ghost" onPress={() => router.back()} />
          </View>
        ) : null}
      </View>
    );
  }

  return (
    <PlayerContent
      key={`${titleId}:${episode ? toEpisodeId(episode) : 'movie'}`}
      titleId={titleId}
      episode={episode}
      session={state.session}
      segments={state.segments}
      nextEpisode={state.nextEpisode}
      titleName={state.titleName}
    />
  );
}