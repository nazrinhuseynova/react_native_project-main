export type AppErrorOptions = {
  code: string;
  userMessageKey: string;
  cause?: unknown;
  details?: Record<string, unknown>;
};

export class AppError extends Error {
  readonly code: string;
  readonly userMessageKey: string;
  readonly details?: Record<string, unknown>;

  constructor(message: string, options: AppErrorOptions) {
    super(message, options.cause === undefined ? undefined : { cause: options.cause });
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = new.target.name;
    this.code = options.code;
    this.userMessageKey = options.userMessageKey;
    this.details = options.details;
  }
}