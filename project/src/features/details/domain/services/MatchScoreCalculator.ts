import { clamp } from '@/core/utils/clamp';
import type { Title } from '@/features/catalog';

export type MatchInput = Pick<Title, 'genreIds' | 'voteAverage' | 'voteCount'>;

export type TasteProfile = {
  genreWeights: Readonly<Record<number, number>>;
};

const GENRE_SHARE = 0.65;
const COMMUNITY_SHARE = 0.35;
const CONFIDENCE_VOTES = 200;
const NEUTRAL_COMMUNITY = 0.6;
const TOP_GENRES = 3;
const PREFERRED_WEIGHT = 2;


export function buildTasteProfile(
  likedGenreLists: readonly (readonly number[])[],
  preferredGenreIds: readonly number[],
): TasteProfile {
  const weights: Record<number, number> = {};
  preferredGenreIds.forEach((id) => {
    weights[id] = (weights[id] ?? 0) + PREFERRED_WEIGHT;
  });
  likedGenreLists.forEach((ids) =>
    ids.forEach((id) => {
      weights[id] = (weights[id] ?? 0) + 1;
    }),
  );
  return { genreWeights: weights };
}

function genreAffinity(genreIds: readonly number[], taste: TasteProfile): number | null {
  const weights = Object.values(taste.genreWeights).sort((a, b) => b - a);
  const ceiling = weights.slice(0, TOP_GENRES).reduce((sum, weight) => sum + weight, 0);
  if (ceiling <= 0) return null;

  const matched = genreIds.reduce((sum, id) => sum + (taste.genreWeights[id] ?? 0), 0);
  return clamp(matched / ceiling, 0, 1);
}

function communityScore(input: MatchInput): number {
  const confidence = clamp(input.voteCount / CONFIDENCE_VOTES, 0, 1);
  return confidence * (input.voteAverage / 10) + (1 - confidence) * NEUTRAL_COMMUNITY;
}


export function calculateMatchScore(input: MatchInput, taste: TasteProfile): number {
  const community = communityScore(input);
  const affinity = genreAffinity(input.genreIds, taste);
  const score = affinity === null ? community : GENRE_SHARE * affinity + COMMUNITY_SHARE * community;
  return clamp(Math.round(score * 100), 40, 99);
}