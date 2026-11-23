export type TmdbCreditsDto = {
  cast: {
    id: number;
    name: string;
    character: string;
    order: number;
    profile_path: string | null;
  }[];
  crew: {
    id: number;
    name: string;
    job: string;
    department: string;
    profile_path: string | null;
  }[];
};