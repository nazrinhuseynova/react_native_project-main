import { LOGIN_LOCKOUT_SECONDS, LOGIN_MAX_ATTEMPTS } from '@/core/config/constants';

export type LoginAttemptState = {
  failures: number;
  lockedUntil: number | null;
};

export const INITIAL_LOGIN_ATTEMPTS: LoginAttemptState = { failures: 0, lockedUntil: null };

/** UX cooldown-dur. Real brute-force qoruması Supabase rate limit-dədir. */
export class LoginAttemptPolicy {
  private readonly maxAttempts: number;
  private readonly lockoutSeconds: number;

  constructor(maxAttempts = LOGIN_MAX_ATTEMPTS, lockoutSeconds = LOGIN_LOCKOUT_SECONDS) {
    this.maxAttempts = maxAttempts;
    this.lockoutSeconds = lockoutSeconds;
  }

  normalize(state: LoginAttemptState, now: number): LoginAttemptState {
    if (state.lockedUntil !== null && state.lockedUntil <= now) return INITIAL_LOGIN_ATTEMPTS;
    return state;
  }

  isLocked(state: LoginAttemptState, now: number): boolean {
    return state.lockedUntil !== null && state.lockedUntil > now;
  }

  remainingSeconds(state: LoginAttemptState, now: number): number {
    if (state.lockedUntil === null || state.lockedUntil <= now) return 0;
    return Math.ceil((state.lockedUntil - now) / 1000);
  }

  recordFailure(state: LoginAttemptState, now: number): LoginAttemptState {
    const current = this.normalize(state, now);
    const failures = current.failures + 1;

    if (failures >= this.maxAttempts) {
      return { failures: 0, lockedUntil: now + this.lockoutSeconds * 1000 };
    }
    return { failures, lockedUntil: null };
  }

  recordSuccess(): LoginAttemptState {
    return INITIAL_LOGIN_ATTEMPTS;
  }
}