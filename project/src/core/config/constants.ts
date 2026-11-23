export const APP_NAME = 'CineVerse';
export const DEEP_LINK_SCHEME = 'cineverse';

export const MAX_PROFILES = 5;
export const PIN_LENGTH = 4;
export const PIN_MAX_ATTEMPTS = 5;
export const PIN_LOCKOUT_SECONDS = 300;

export const PASSWORD_MIN_LENGTH = 8;
export const LOGIN_MAX_ATTEMPTS = 5;
export const LOGIN_LOCKOUT_SECONDS = 300;

export const OTP_LENGTH = 6;
export const OTP_EXPIRY_SECONDS = 300;
export const OTP_RESEND_COOLDOWN_SECONDS = 60;
export const OTP_MAX_ATTEMPTS = 5;

export const COMPLETE_THRESHOLD = 0.92;
export const PROGRESS_SAVE_INTERVAL_MS = 10_000;
export const SEEK_STEP_SECONDS = 10;

export const RENT_AVAILABILITY_DAYS = 30;
export const RENT_PLAYBACK_HOURS = 48;
export const DELETE_GRACE_DAYS = 14;
export const DOWNLOAD_LICENSE_CHECK_DAYS = 7;

export const HTTP_TIMEOUT_MS = 15_000;
export const HTTP_RETRY_COUNT = 2;
export const HTTP_RETRY_BASE_DELAY_MS = 400;

export const QUERY_STALE_TIME_MS = 5 * 60 * 1000;
export const QUERY_GC_TIME_MS = 24 * 60 * 60 * 1000;
export const QUERY_PERSIST_MAX_AGE_MS = QUERY_GC_TIME_MS;
export const QUERY_CACHE_BUSTER = 'v1';

export const ANALYTICS_BATCH_SIZE = 20;
export const ANALYTICS_FLUSH_INTERVAL_MS = 15_000;

export const NOTIFICATION_CHANNEL_ID = 'default';