import type { LogContext, Logger, LogLevel } from './Logger';

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

export class ConsoleLogger implements Logger {
  private readonly minLevel: LogLevel;

  constructor(minLevel: LogLevel = __DEV__ ? 'debug' : 'warn') {
    this.minLevel = minLevel;
  }

  debug(message: string, context?: LogContext): void {
    this.write('debug', message, context);
  }

  info(message: string, context?: LogContext): void {
    this.write('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.write('warn', message, context);
  }

  error(message: string, context?: LogContext): void {
    this.write('error', message, context);
  }

  private write(level: LogLevel, message: string, context?: LogContext): void {
    if (LEVEL_ORDER[level] < LEVEL_ORDER[this.minLevel]) return;
    const text = `[${level}] ${message}`;
    if (context) {
      console[level](text, context);
    } else {
      console[level](text);
    }
  }
}