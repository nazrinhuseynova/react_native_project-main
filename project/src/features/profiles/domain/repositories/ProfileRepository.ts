import type { MaturityRating } from '../entities/MaturityRating';
import type { Profile } from '../entities/Profile';

export type ProfileWrite = {
  name: string;
  isKids: boolean;
  maturity: MaturityRating;
  avatarPreset: string | null;
  avatarUrl: string | null;
  avatarKey: string | null;
};

export type PinRecord = {
  hash: string;
  salt: string;
};

export interface ProfileRepository {
  list(): Promise<Profile[]>;
  get(id: string): Promise<Profile | null>;
  create(data: ProfileWrite): Promise<Profile>;
  update(id: string, data: Partial<ProfileWrite>): Promise<Profile>;
  remove(id: string): Promise<void>;
  setPin(id: string, pin: PinRecord | null): Promise<void>;
}


export interface PinCrypto {
  create(pin: string): Promise<PinRecord>;
  verify(pin: string, record: PinRecord): Promise<boolean>;
}