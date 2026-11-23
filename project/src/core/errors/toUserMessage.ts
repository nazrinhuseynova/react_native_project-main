import { AppError } from './AppError';

export const UNKNOWN_ERROR_KEY = 'errors.unknown';

export function toUserMessage(error: unknown): string {
  if (error instanceof AppError) return error.userMessageKey;
  if (error instanceof TypeError && /network request failed/i.test(error.message)) {
    return 'errors.network.offline';
  }
  return UNKNOWN_ERROR_KEY;
}