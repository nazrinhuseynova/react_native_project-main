import { normalizeEmail } from '../entities/AuthUser';
import type { AuthRepository } from '../repositories/AuthRepository';

export class ResendVerification {
  private readonly repository: AuthRepository;

  constructor(repository: AuthRepository) {
    this.repository = repository;
  }

  execute(email: string): Promise<void> {
    return this.repository.resendVerification(normalizeEmail(email));
  }
}