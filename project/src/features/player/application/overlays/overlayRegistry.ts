import { Registry } from '@/core/registry/Registry';

import { bufferingOverlay } from './BufferingOverlay';
import { nextEpisodeOverlay } from './NextEpisodeOverlay';
import type { PlayerOverlay } from './PlayerOverlay';
import { skipIntroOverlay } from './SkipIntroOverlay';


export const overlayRegistry = new Registry<PlayerOverlay>().registerAll([
  bufferingOverlay,
  skipIntroOverlay,
  nextEpisodeOverlay,
]);