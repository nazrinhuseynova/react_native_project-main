import { normalizeEmail } from '../entities/AuthUser';
import type { AuthRepository } from '../repositories/AuthRepository';

export class RequestPasswordReset {
  private readonly repository: AuthRepository;

  constructor(repository: AuthRepository) {
    this.repository = repository;
  }

  execute(email: string): Promise<void> {
    return this.repository.requestPasswordReset(normalizeEmail(email));
  }
}