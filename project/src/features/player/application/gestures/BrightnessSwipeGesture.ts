import { clamp } from '@/core/utils/clamp';

import type { GestureActions, GestureStrategy, GestureZone } from './GestureStrategy';

const SENSITIVITY = 1.2;

export class BrightnessSwipeGesture implements GestureStrategy {
  readonly id = 'brightness-swipe';
  readonly order = 20;
  readonly zone: GestureZone = 'left';

  onPanStart(actions: GestureActions): number {
    return actions.getBrightness();
  }

  onPanMove(start: number, delta: number, actions: GestureActions): void {
    const value = clamp(start + delta * SENSITIVITY, 0, 1);
    actions.setBrightness(value);
    actions.showHud({ icon: 'sunny', label: `${Math.round(value * 100)}%`, value });
  }

  onPanEnd(actions: GestureActions): void {
    actions.showHud(null);
  }
}