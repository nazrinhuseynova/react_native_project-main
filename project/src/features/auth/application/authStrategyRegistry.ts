import { Registry } from '@/core/registry/Registry';

import type { AuthStrategy } from '../domain/strategies/AuthStrategy';

export function createAuthStrategyRegistry(strategies: readonly AuthStrategy[]): Registry<AuthStrategy> {
  const registry = new Registry<AuthStrategy>();
  registry.registerAll(strategies);
  return registry;
}