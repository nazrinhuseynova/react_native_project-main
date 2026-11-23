import type { AuthRepository } from '../repositories/AuthRepository';

export class SignOut {
  private readonly repository: AuthRepository;

  constructor(repository: AuthRepository) {
    this.repository = repository;
  }

  execute(): Promise<void> {
    return this.repository.signOut('local');
  }
}