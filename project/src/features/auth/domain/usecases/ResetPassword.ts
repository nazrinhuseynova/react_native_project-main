import { AuthError } from '@/core/errors/AuthError';

import type { PasswordPolicy } from '../policies/PasswordPolicy';
import type { AuthRepository } from '../repositories/AuthRepository';

export class ResetPassword {
  private readonly repository: AuthRepository;
  private readonly passwordPolicy: PasswordPolicy;

  constructor(repository: AuthRepository, passwordPolicy: PasswordPolicy) {
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
    await this.repository.updatePassword(newPassword);
  }
}