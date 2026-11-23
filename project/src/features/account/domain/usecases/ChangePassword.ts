import { AuthError } from '@/core/errors/AuthError';
import type { PasswordPolicy } from '@/features/auth';

import type { AccountRepository } from '../repositories/AccountRepository';

export class ChangePassword {
  private readonly repository: AccountRepository;
  private readonly passwordPolicy: PasswordPolicy;

  constructor(repository: AccountRepository, passwordPolicy: PasswordPolicy) {
    this.repository = repository;
    this.passwordPolicy = passwordPolicy;
  }

  async execute(newPassword: string): Promise<void> {
    const validation = this.passwordPolicy.validate(newPassword);
    if (!validation.valid) {
      throw new AuthError('Password does not meet the policy', {
        reason: 'weak_password',
        details: { issues: validation.issues },
      });
    }
    await this.repository.changePassword(newPassword);
  }
}