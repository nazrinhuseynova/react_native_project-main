import type { Title } from '@/features/catalog';

export type QualityBadge = 'HD' | '4K' | 'ATMOS';

type QualityInput = Pick<Title, 'releaseDate' | 'voteCount'>;

type QualityRule = {
  badge: QualityBadge;
  applies: (title: QualityInput, year: number) => boolean;
};

/** TMDB keyfiyyət məlumatı vermir → nişanlar sadə qaydalarla təyin olunur. */
const RULES: readonly QualityRule[] = [
  { badge: 'HD', applies: () => true },
  { badge: '4K', applies: (_title, year) => year >= 2016 },
  { badge: 'ATMOS', applies: (title, year) => year >= 2014 && title.voteCount >= 3000 },
];

export function qualityBadgesFor(title: QualityInput): QualityBadge[] {
  const year = title.releaseDate ? Number(title.releaseDate.slice(0, 4)) : 0;
  return RULES.filter((rule) => rule.applies(title, year)).map((rule) => rule.badge);
}