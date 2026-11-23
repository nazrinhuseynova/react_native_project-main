import type { RegistryItem } from '@/core/registry/Registry';
import type { Title } from '@/features/catalog';

import type { CategoryKind } from './CategoryFilter';
import type { HomeContext } from './HomeContext';

export type HomeRowVariant = 'poster' | 'backdrop' | 'top10' | 'continue';
export type HomeAudience = 'standard' | 'kids' | 'all';

export type HomeEntry = {
  title: Title;
  progress: number | null;
};

export type HomeRowResult = {
  entries: HomeEntry[];
  titleParams?: Record<string, string>;
};

export interface HomeRow extends RegistryItem {
  readonly id: string;
  readonly order: number;
  readonly titleKey: string;
  readonly variant: HomeRowVariant;
  readonly audience: HomeAudience;
  readonly categories: readonly CategoryKind[];
  load(ctx: HomeContext): Promise<HomeRowResult>;
}