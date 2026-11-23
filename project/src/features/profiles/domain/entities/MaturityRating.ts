export const MATURITY_RATINGS = ['G', 'PG', 'PG-13', 'R', 'NC-17'] as const;

export type MaturityRating = (typeof MATURITY_RATINGS)[number];

export const DEFAULT_MATURITY: MaturityRating = 'NC-17';
export const KIDS_MATURITY: MaturityRating = 'PG';

export const UNRATED_ASSUMED: MaturityRating = 'R';

const ALIASES: Record<string, MaturityRating> = {
  G: 'G',
  PG: 'PG',
  'PG-13': 'PG-13',
  R: 'R',
  'NC-17': 'NC-17',
  'TV-Y': 'G',
  'TV-Y7': 'G',
  'TV-G': 'G',
  'TV-PG': 'PG',
  'TV-14': 'PG-13',
  'TV-MA': 'R',
};

export function isMaturityRating(value: unknown): value is MaturityRating {
  return typeof value === 'string' && (MATURITY_RATINGS as readonly string[]).includes(value);
}

export function parseMaturity(value?: string | null): MaturityRating | null {
  if (!value) return null;
  return ALIASES[value.trim().toUpperCase()] ?? null;
}

export function maturityRank(rating: MaturityRating): number {
  return MATURITY_RATINGS.indexOf(rating);
}

export function minMaturity(a: MaturityRating, b: MaturityRating): MaturityRating {
  return maturityRank(a) <= maturityRank(b) ? a : b;
}

export function isWithinMaturity(rating: MaturityRating, max: MaturityRating): boolean {
  return maturityRank(rating) <= maturityRank(max);
}

export function effectiveMaturity(
  isKids: boolean,
  requested: MaturityRating = DEFAULT_MATURITY,
): MaturityRating {
  return isKids ? minMaturity(requested, KIDS_MATURITY) : requested;
}