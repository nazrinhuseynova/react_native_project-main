import type { Title } from '@/features/catalog';
import type { Paginated } from '@/shared/types/common';

import { mediaKindOf, type CategoryFilter } from '../../domain/CategoryFilter';
import type { HomeContext } from '../../domain/HomeContext';
import type { HomeEntry } from '../../domain/HomeRow';

const DEFAULT_LIMIT = 20;

export function interleave<T>(a: readonly T[], b: readonly T[]): T[] {
  const result: T[] = [];
  const length = Math.max(a.length, b.length);
  for (let index = 0; index < length; index += 1) {
    if (index < a.length) result.push(a[index] as T);
    if (index < b.length) result.push(b[index] as T);
  }
  return result;
}

export function toEntries(titles: readonly Title[], limit = DEFAULT_LIMIT): HomeEntry[] {
  const seen = new Set<string>();
  const entries: HomeEntry[] = [];
  for (const title of titles) {
    if (seen.has(title.id)) continue;
    seen.add(title.id);
    entries.push({ title, progress: null });
    if (entries.length >= limit) break;
  }
  return entries;
}

export async function loadPerKind(
  ctx: HomeContext,
  loaders: { movie: () => Promise<Paginated<Title>>; tv: () => Promise<Paginated<Title>> },
): Promise<Title[]> {
  const kind = mediaKindOf(ctx.category);
  if (kind === 'movie') return (await loaders.movie()).items;
  if (kind === 'tv') return (await loaders.tv()).items;
  const [movies, shows] = await Promise.all([loaders.movie(), loaders.tv()]);
  return interleave(movies.items, shows.items);
}

export function matchesCategory(title: Title, category: CategoryFilter): boolean {
  const kind = mediaKindOf(category);
  return kind === null || title.kind === kind;
}


export async function settleTitles(
  ids: readonly string[],
  load: (id: string) => Promise<Title>,
): Promise<Title[]> {
  const results = await Promise.allSettled(ids.map(load));
  return results.flatMap((result) => (result.status === 'fulfilled' ? [result.value] : []));
}