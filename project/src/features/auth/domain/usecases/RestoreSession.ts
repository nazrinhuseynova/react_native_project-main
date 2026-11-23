import type { Session } from '../entities/Session';
import type { AuthRepository } from '../repositories/AuthRepository';

export class RestoreSession {
  private readonly repository: AuthRepository;

  constructor(repository: AuthRepository) {
    this.repository = repository;
  }

  execute(): Promise<Session | null> {
    return this.repository.getSession();
  }
}