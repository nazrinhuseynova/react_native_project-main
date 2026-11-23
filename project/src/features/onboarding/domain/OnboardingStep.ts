import type { RegistryItem } from '@/core/registry/Registry';

export interface OnboardingStep extends RegistryItem {
  readonly id: string;
  readonly order: number;
  readonly titleKey: string;
  readonly bodyKey: string;
  readonly icon: string;
}

export type GenreOption = {
  readonly id: number;
  readonly labelKey: string;
};