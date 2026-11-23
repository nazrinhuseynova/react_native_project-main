import { Registry } from '@/core/registry/Registry';

import type { ContentPolicy } from '../domain/policies/ContentPolicy';
import { BlockedTitlePolicy } from '../domain/policies/BlockedTitlePolicy';
import { KidsModePolicy } from '../domain/policies/KidsModePolicy';
import { MaturityPolicy } from '../domain/policies/MaturityPolicy';


export function createContentPolicyRegistry(): Registry<ContentPolicy> {
  return new Registry<ContentPolicy>().registerAll([
    new KidsModePolicy(),
    new MaturityPolicy(),
    new BlockedTitlePolicy(),
  ]);
}