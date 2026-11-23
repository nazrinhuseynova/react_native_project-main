import type { Rental, RentalStatus } from '../entities/Rental';

export interface RentalEvaluation {
  status: RentalStatus;
  canWatch: boolean;
  expiresAt: Date | null;
  remainingMs: number;
  reason:
    | 'active_playback_window'
    | 'awaiting_first_play'
    | 'first_play_window_expired'
    | 'availability_window_expired';
}

const MS_PER_HOUR = 60 * 60 * 1000;
const MS_PER_DAY = 24 * MS_PER_HOUR;

export class RentalWindowPolicy {
  evaluate(rental: Rental, now: Date = new Date()): RentalEvaluation {
    const purchasedTime = new Date(rental.purchasedAt).getTime();
    const availabilityDeadline = new Date(
      purchasedTime + rental.availabilityDays * MS_PER_DAY,
    );

  
    if (!rental.firstPlayAt) {
      const remainingToStartMs = availabilityDeadline.getTime() - now.getTime();
      if (remainingToStartMs <= 0) {
        return {
          status: 'expired',
          canWatch: false,
          expiresAt: availabilityDeadline,
          remainingMs: 0,
          reason: 'availability_window_expired',
        };
      }

      return {
        status: 'unstarted',
        canWatch: true,
        expiresAt: availabilityDeadline,
        remainingMs: remainingToStartMs,
        reason: 'awaiting_first_play',
      };
    }

  
    const firstPlayTime = new Date(rental.firstPlayAt).getTime();
    const playbackDeadline = new Date(
      firstPlayTime + rental.playbackHours * MS_PER_HOUR,
    );
    const remainingPlaybackMs = playbackDeadline.getTime() - now.getTime();

    if (remainingPlaybackMs <= 0) {
      return {
        status: 'expired',
        canWatch: false,
        expiresAt: playbackDeadline,
        remainingMs: 0,
        reason: 'first_play_window_expired',
      };
    }

    return {
      status: 'active',
      canWatch: true,
      expiresAt: playbackDeadline,
      remainingMs: remainingPlaybackMs,
      reason: 'active_playback_window',
    };
  }

  canPlay(rental: Rental, now: Date = new Date()): boolean {
    return this.evaluate(rental, now).canWatch;
  }
}