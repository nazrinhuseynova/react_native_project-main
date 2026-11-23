import { ValidationError } from '@/core/errors/ValidationError';
import type { KeyValueStorage } from '@/core/storage/KeyValueStorage';
import { storageKeys } from '@/core/storage/storageKeys';

import type { PinPolicy } from '../policies/PinPolicy';
import type { PinCrypto, ProfileRepository } from '../repositories/ProfileRepository';

export class SetProfilePin {
  private readonly repository: ProfileRepository;
  private readonly crypto: PinCrypto;
  private readonly policy: PinPolicy;
  private readonly storage: KeyValueStorage;

  constructor(
    repository: ProfileRepository,
    crypto: PinCrypto,
    policy: PinPolicy,
    storage: KeyValueStorage,
  ) {
    this.repository = repository;
    this.crypto = crypto;
    this.policy = policy;
    this.storage = storage;
  }

  
  async execute(profileId: string, pin: string | null): Promise<void> {
    if (pin === null) {
      await this.repository.setPin(profileId, null);
    } else {
      if (!this.policy.isValidFormat(pin)) {
        throw new ValidationError('Invalid PIN format', {
          fields: { pin: 'profiles.errors.pinFormat' },
        });
      }
      await this.repository.setPin(profileId, await this.crypto.create(pin));
    }
    await this.storage.remove(storageKeys.profilePinAttempts(profileId));
  }
}