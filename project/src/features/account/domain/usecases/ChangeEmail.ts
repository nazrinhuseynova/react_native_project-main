import { ValidationError } from '@/core/errors/ValidationError';
import { normalizeEmail } from '@/features/auth';

import type { AccountRepository } from '../repositories/AccountRepository';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class ChangeEmail {
  private readonly repository: AccountRepository;

  constructor(repository: AccountRepository) {
    this.repository = repository;
  }

  async execute(currentEmail: string, newEmail: string): Promise<string> {
    const next = normalizeEmail(newEmail);

    if (!EMAIL_PATTERN.test(next)) {
      throw new ValidationError('Invalid email', { fields: { email: 'auth.validation.emailInvalid' } });
    }
    if (next === normalizeEmail(currentEmail)) {
      throw new ValidationError('Email unchanged', { fields: { email: 'account.errors.emailSame' } });
    }

    await this.repository.requestEmailChange(next);
    return next;
  }
}