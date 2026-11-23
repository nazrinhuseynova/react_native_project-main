import * as Crypto from 'expo-crypto';

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) {
    difference |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return difference === 0;
}

export class Hasher {
  generateSalt(bytes = 16): string {
    return toHex(Crypto.getRandomBytes(bytes));
  }

  hash(value: string, salt: string): Promise<string> {
    return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${value}`);
  }

  async verify(value: string, salt: string, expectedHash: string): Promise<boolean> {
    const actual = await this.hash(value, salt);
    return safeEqual(actual, expectedHash);
  }
}