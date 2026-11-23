import type { EventBus } from './EventBus';

export type AppEvents = {
  'auth.signedIn': { userId: string };
  'auth.signedOut': { userId: string | null; reason: 'user' | 'expired' | 'revoked' };
  'profile.switched': { profileId: string };
  'playback.started': { titleId: string; episodeId?: string; positionSec: number };
  'playback.progress': {
    titleId: string;
    episodeId?: string;
    positionSec: number;
    durationSec: number;
  };
  'playback.paused': { titleId: string; episodeId?: string; positionSec: number };
  'playback.seeked': { titleId: string; fromSec: number; toSec: number };
  'playback.buffering': { titleId: string; positionSec: number };
  'playback.completed': { titleId: string; episodeId?: string; durationSec: number };
  'title.saved': { titleId: string; saved: boolean };
  'title.favorited': { titleId: string; favorite: boolean };
  'title.rated': { titleId: string; stars: number };
  'download.completed': { downloadId: string; titleId: string };
  'rental.started': { titleId: string; rentalId: string };
  'subscription.purchased': { planId: string };
};

export type AppEventBus = EventBus<AppEvents>;