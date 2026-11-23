import type { KeyValueStorage } from './KeyValueStorage';

export interface SecureStorage extends KeyValueStorage {
  readonly secure: true;
}