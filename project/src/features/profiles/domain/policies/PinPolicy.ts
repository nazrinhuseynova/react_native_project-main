import { PIN_LENGTH, PIN_LOCKOUT_SECONDS, PIN_MAX_ATTEMPTS } from '@/core/config/constants';

export type PinAttemptState = {
  failures: number;
  lockedUntil: number | null;
};

export const INITIAL_PIN_ATTEMPTS: PinAttemptState = { failures: 0, lockedUntil: null };

export class PinPolicy {
  readonly length = PIN_LENGTH;
  private readonly maxAttempts: number;
  private readonly lockoutSeconds: number;

  constructor(maxAttempts = PIN_MAX_ATTEMPTS, lockoutSeconds = PIN_LOCKOUT_SECONDS) {
    this.maxAttempts = maxAttempts;
    this.lockoutSeconds = lockoutSeconds;
  }

  isValidFormat(pin: string): boolean {
    return new RegExp(`^\\d{${this.length}}$`).test(pin);
  }

  normalize(state: PinAttemptState, now: number): PinAttemptState {
    if (state.lockedUntil !== null && state.lockedUntil <= now) return INITIAL_PIN_ATTEMPTS;
    return state;
  }

  isLocked(state: PinAttemptState, now: number): boolean {
    return state.lockedUntil !== null && state.lockedUntil > now;
  }

  remainingSeconds(state: PinAttemptState, now: number): number {
    if (state.lockedUntil === null || state.lockedUntil <= now) return 0;
    return Math.ceil((state.lockedUntil - now) / 1000);
  }

  attemptsLeft(state: PinAttemptState): number {
    return Math.max(0, this.maxAttempts - state.failures);
  }

  recordFailure(state: PinAttemptState, now: number): PinAttemptState {
    const current = this.normalize(state, now);
    const failures = current.failures + 1;
    if (failures >= this.maxAttempts) {
      return { failures: 0, lockedUntil: now + this.lockoutSeconds * 1000 };
    }
    return { failures, lockedUntil: null };
  }

  recordSuccess(): PinAttemptState {
    return INITIAL_PIN_ATTEMPTS;
  }
}