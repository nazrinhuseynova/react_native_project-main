import { VideoView, type VideoPlayer } from 'expo-video';
import { forwardRef } from 'react';
import { StyleSheet } from 'react-native';

type VideoSurfaceProps = {
  player: VideoPlayer;
  onPipStart?: () => void;
  onPipStop?: () => void;
};

export const VideoSurface = forwardRef<VideoView, VideoSurfaceProps>(function VideoSurface(
  { player, onPipStart, onPipStop },
  ref,
) {
  return (
    <VideoView
      ref={ref}
      player={player}
      style={StyleSheet.absoluteFill}
      contentFit="contain"
      nativeControls={false}
      allowsPictureInPicture
      startsPictureInPictureAutomatically
      onPictureInPictureStart={onPipStart}
      onPictureInPictureStop={onPipStop}
    />
  );
});