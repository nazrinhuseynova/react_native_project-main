import type { Hasher } from '@/core/security/Hasher';

import type { PinCrypto, PinRecord } from '../domain/repositories/ProfileRepository';

export class PinHasher implements PinCrypto {
  private readonly hasher: Hasher;

  constructor(hasher: Hasher) {
    this.hasher = hasher;
  }

  async create(pin: string): Promise<PinRecord> {
    const salt = this.hasher.generateSalt();
    return { hash: await this.hasher.hash(pin, salt), salt };
  }

  verify(pin: string, record: PinRecord): Promise<boolean> {
    return this.hasher.verify(pin, record.salt, record.hash);
  }
}