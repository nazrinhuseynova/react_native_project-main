import { isPictureInPictureSupported, type VideoView } from 'expo-video';
import { useCallback, useMemo, useState, type RefObject } from 'react';

export function usePictureInPicture(videoRef: RefObject<VideoView | null>) {
  const [isInPip, setIsInPip] = useState(false);
  const isSupported = useMemo(() => {
    try {
      return isPictureInPictureSupported();
    } catch {
      return false;
    }
  }, []);

  const enter = useCallback(() => {
    videoRef.current?.startPictureInPicture();
  }, [videoRef]);

  const onEnter = useCallback(() => setIsInPip(true), []);
  const onExit = useCallback(() => setIsInPip(false), []);

  return { isSupported, isInPip, enter, onEnter, onExit };
}