export type RegistryItem = {
  readonly id: string;
  readonly order?: number;
};

export class Registry<T extends RegistryItem> {
  private readonly items = new Map<string, T>();

  register(item: T): this {
    if (this.items.has(item.id)) {
      throw new Error(`Registry item already registered: ${item.id}`);
    }
    this.items.set(item.id, item);
    return this;
  }

  registerAll(items: readonly T[]): this {
    items.forEach((item) => this.register(item));
    return this;
  }

  unregister(id: string): boolean {
    return this.items.delete(id);
  }

  has(id: string): boolean {
    return this.items.has(id);
  }

  get(id: string): T | undefined {
    return this.items.get(id);
  }

  all(): T[] {
    return [...this.items.values()].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  get size(): number {
    return this.items.size;
  }
}