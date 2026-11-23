export type EventBusOptions = {
  onHandlerError?: (error: unknown, event: string) => void;
};

export class EventBus<TEvents extends object> {
  private readonly handlers = new Map<keyof TEvents, Set<(payload: never) => void>>();
  private readonly onHandlerError?: (error: unknown, event: string) => void;

  constructor(options: EventBusOptions = {}) {
    this.onHandlerError = options.onHandlerError;
  }

  on<K extends keyof TEvents>(event: K, handler: (payload: TEvents[K]) => void): () => void {
    const existing = this.handlers.get(event) ?? new Set<(payload: never) => void>();
    existing.add(handler);
    this.handlers.set(event, existing);

    return () => {
      existing.delete(handler);
    };
  }

  once<K extends keyof TEvents>(event: K, handler: (payload: TEvents[K]) => void): () => void {
    const unsubscribe = this.on(event, (payload) => {
      unsubscribe();
      handler(payload);
    });
    return unsubscribe;
  }

  emit<K extends keyof TEvents>(event: K, payload: TEvents[K]): void {
    this.handlers.get(event)?.forEach((handler) => {
      try {
        (handler as (value: TEvents[K]) => void)(payload);
      } catch (error) {
        this.onHandlerError?.(error, String(event));
      }
    });
  }

  clear(): void {
    this.handlers.clear();
  }
}