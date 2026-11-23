import { Registry } from '@/core/registry/Registry';

import { BrightnessSwipeGesture } from './BrightnessSwipeGesture';
import { DoubleTapSeekGesture } from './DoubleTapSeekGesture';
import type { GestureStrategy } from './GestureStrategy';
import { VolumeSwipeGesture } from './VolumeSwipeGesture';

// Yeni jest = yeni fayl + aşağıya 1 sətir
export const gestureRegistry = new Registry<GestureStrategy>().registerAll([
  new DoubleTapSeekGesture(),
  new BrightnessSwipeGesture(),
  new VolumeSwipeGesture(),
]);