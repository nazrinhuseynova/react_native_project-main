import { ValidationError } from '@/core/errors/ValidationError';
import { toUserMessage } from '@/core/errors/toUserMessage';

export function toErrorKey(error: unknown): string {
  if (error instanceof ValidationError) {
    const first = Object.values(error.fields)[0];
    if (first) return first;
  }
  return toUserMessage(error);
}