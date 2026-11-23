export type PasswordStrengthLevel = 'weak' | 'medium' | 'strong';

export type PasswordStrength = {
  level: PasswordStrengthLevel;
  score: number;
};

export class PasswordStrengthPolicy {
  evaluate(password: string): PasswordStrength {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    const level: PasswordStrengthLevel = score <= 2 ? 'weak' : score <= 3 ? 'medium' : 'strong';
    return { level, score };
  }
}