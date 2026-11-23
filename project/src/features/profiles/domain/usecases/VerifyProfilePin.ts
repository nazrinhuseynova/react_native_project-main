import { NotFoundError } from '@/core/errors/NotFoundError';
import { readJson, writeJson, type KeyValueStorage } from '@/core/storage/KeyValueStorage';
import { storageKeys } from '@/core/storage/storageKeys';

import {
  INITIAL_PIN_ATTEMPTS,
  type PinAttemptState,
  type PinPolicy,
} from '../policies/PinPolicy';
import type { PinCrypto, ProfileRepository } from '../repositories/ProfileRepository';

export type PinVerifyResult =
  | { status: 'ok' }
  | { status: 'wrong'; attemptsLeft: number }
  | { status: 'locked'; remainingSeconds: number };

export class VerifyProfilePin {
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

  async lockState(profileId: string): Promise<{ locked: boolean; remainingSeconds: number }> {
    const now = Date.now();
    const state = this.policy.normalize(await this.readState(profileId), now);
    return {
      locked: this.policy.isLocked(state, now),
      remainingSeconds: this.policy.remainingSeconds(state, now),
    };
  }

  async execute(profileId: string, pin: string): Promise<PinVerifyResult> {
    const now = Date.now();
    const state = this.policy.normalize(await this.readState(profileId), now);

    if (this.policy.isLocked(state, now)) {
      return { status: 'locked', remainingSeconds: this.policy.remainingSeconds(state, now) };
    }

    const profile = await this.repository.get(profileId);
    if (!profile) throw new NotFoundError('Profile not found', { resource: 'profile' });
    if (!profile.pinHash || !profile.pinSalt) return { status: 'ok' };

    const valid =
      this.policy.isValidFormat(pin) &&
      (await this.crypto.verify(pin, { hash: profile.pinHash, salt: profile.pinSalt }));

    const key = storageKeys.profilePinAttempts(profileId);

    if (valid) {
      await this.storage.remove(key);
      return { status: 'ok' };
    }

    const next = this.policy.recordFailure(state, now);
    await writeJson(this.storage, key, next);

    if (this.policy.isLocked(next, now)) {
      return { status: 'locked', remainingSeconds: this.policy.remainingSeconds(next, now) };
    }
    return { status: 'wrong', attemptsLeft: this.policy.attemptsLeft(next) };
  }

  private async readState(profileId: string): Promise<PinAttemptState> {
    return (
      (await readJson<PinAttemptState>(
        this.storage,
        storageKeys.profilePinAttempts(profileId),
      )) ?? INITIAL_PIN_ATTEMPTS
    );
  }
}