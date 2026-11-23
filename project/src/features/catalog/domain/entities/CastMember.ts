import type { Artwork } from './Title';

export type CastMember = {
  id: number;
  name: string;
  character: string;
  order: number;
  profile: Artwork | null;
};

export type CrewMember = {
  id: number;
  name: string;
  job: string;
  department: string;
  profile: Artwork | null;
};

export type TitleCredits = {
  cast: CastMember[];
  crew: CrewMember[];
};

export function directorsOf(credits: TitleCredits): CrewMember[] {
  return credits.crew.filter((member) => member.job === 'Director');
}