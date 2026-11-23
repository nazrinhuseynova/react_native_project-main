import { clamp } from '@/core/utils/clamp';

import type { GestureActions, GestureStrategy, GestureZone } from './GestureStrategy';

const SENSITIVITY = 1.2;

/** Əvvəlcə yalnız pleyerin öz səsini idarə edir (Expo-only). */
export class VolumeSwipeGesture implements GestureStrategy {
  readonly id = 'volume-swipe';
  readonly order = 30;
  readonly zone: GestureZone = 'right';

  onPanStart(actions: GestureActions): number {
    return actions.getVolume();
  }

  onPanMove(start: number, delta: number, actions: GestureActions): void {
    const value = clamp(start + delta * SENSITIVITY, 0, 1);
    actions.setVolume(value);
    actions.showHud({
      icon: value === 0 ? 'volume-mute' : 'volume-high',
      label: `${Math.round(value * 100)}%`,
      value,
    });
  }

  onPanEnd(actions: GestureActions): void {
    actions.showHud(null);
  }
}