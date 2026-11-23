import type { ComponentType } from 'react';

import type { RegistryItem } from '@/core/registry/Registry';

import type { SkipSegment } from '../../domain/entities/SkipSegment';
import type { EpisodeRef } from '../../domain/services/NextEpisodeResolver';

export type OverlayContext = {
  titleId: string;
  positionSec: number;
  durationSec: number;
  isBuffering: boolean;
  controlsVisible: boolean;
  segments: SkipSegment[];
  nextEpisode: EpisodeRef | null;
  seekTo(sec: number): void;
  playNext(): void;
};

export interface PlayerOverlay extends RegistryItem {
  shouldShow(ctx: OverlayContext): boolean;
  Component: ComponentType<{ ctx: OverlayContext }>;
}