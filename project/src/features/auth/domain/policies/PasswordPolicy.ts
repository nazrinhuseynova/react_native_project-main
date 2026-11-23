import { PASSWORD_MIN_LENGTH } from '@/core/config/constants';

export type PasswordIssue = 'too_short' | 'missing_letter' | 'missing_digit';

export type PasswordValidation = {
  valid: boolean;
  issues: PasswordIssue[];
};

const LETTER = /[A-Za-z\u00C0-\u024F\u0250-\u02AF\u0400-\u04FF]/;
const DIGIT = /\d/;

export class PasswordPolicy {
  readonly minLength = PASSWORD_MIN_LENGTH;

  validate(password: string): PasswordValidation {
    const issues: PasswordIssue[] = [];
    if (password.length < this.minLength) issues.push('too_short');
    if (!LETTER.test(password)) issues.push('missing_letter');
    if (!DIGIT.test(password)) issues.push('missing_digit');
    return { valid: issues.length === 0, issues };
  }
}