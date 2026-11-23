import { SEEK_STEP_SECONDS } from '@/core/config/constants';

import type { GestureActions, GestureStrategy, GestureZone, TapSide } from './GestureStrategy';

export class DoubleTapSeekGesture implements GestureStrategy {
  readonly id = 'double-tap-seek';
  readonly order = 10;
  readonly zone: GestureZone = 'full';

  onDoubleTap(side: TapSide, actions: GestureActions): void {
    const delta = side === 'left' ? -SEEK_STEP_SECONDS : SEEK_STEP_SECONDS;
    actions.seekBy(delta);
    actions.showHud({
      icon: side === 'left' ? 'play-back' : 'play-forward',
      label: `${delta > 0 ? '+' : '−'}${SEEK_STEP_SECONDS}s`,
    });
  }
}