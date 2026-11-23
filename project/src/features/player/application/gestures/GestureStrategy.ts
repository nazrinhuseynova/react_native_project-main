import type { RegistryItem } from '@/core/registry/Registry';
import type { IconName } from '@/shared/types/common';

export type GestureZone = 'left' | 'right' | 'full';
export type TapSide = 'left' | 'right';

export type HudInfo = {
  icon: IconName;
  label: string;
  /** 0..1 — verilərsə HUD-da bar göstərilir */
  value?: number;
};

export type GestureActions = {
  seekBy(deltaSec: number): void;
  getBrightness(): number;
  setBrightness(value: number): void;
  getVolume(): number;
  setVolume(value: number): void;
  showHud(hud: HudInfo | null): void;
};

export interface GestureStrategy extends RegistryItem {
  readonly zone: GestureZone;
  onDoubleTap?(side: TapSide, actions: GestureActions): void;
  /** başlanğıc dəyəri qaytarır; onPanMove-a ötürülür */
  onPanStart?(actions: GestureActions): number;
  /** delta: yuxarı sürüşdürmə müsbətdir, ekran hündürlüyünə nisbətdə (−1..1) */
  onPanMove?(start: number, delta: number, actions: GestureActions): void;
  onPanEnd?(actions: GestureActions): void;
}