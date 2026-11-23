import {
  OTP_EXPIRY_SECONDS,
  OTP_LENGTH,
  OTP_MAX_ATTEMPTS,
  OTP_RESEND_COOLDOWN_SECONDS,
} from '@/core/config/constants';

export class OtpPolicy {
  readonly length = OTP_LENGTH;
  readonly expirySeconds = OTP_EXPIRY_SECONDS;
  readonly resendCooldownSeconds = OTP_RESEND_COOLDOWN_SECONDS;
  readonly maxAttempts = OTP_MAX_ATTEMPTS;

  isWellFormed(code: string): boolean {
    return new RegExp(`^\\d{${this.length}}$`).test(code);
  }

  isExpired(issuedAt: number, now: number): boolean {
    return now - issuedAt >= this.expirySeconds * 1000;
  }

  resendRemainingSeconds(lastSentAt: number, now: number): number {
    const elapsedSeconds = (now - lastSentAt) / 1000;
    return Math.max(0, Math.ceil(this.resendCooldownSeconds - elapsedSeconds));
  }

  canResend(lastSentAt: number, now: number): boolean {
    return this.resendRemainingSeconds(lastSentAt, now) === 0;
  }

  attemptsLeft(used: number): number {
    return Math.max(0, this.maxAttempts - used);
  }

  hasAttemptsLeft(used: number): boolean {
    return this.attemptsLeft(used) > 0;
  }
}