export type TmdbVideoDto = {
  results: {
    id: string;
    key: string;
    site: string;
    name: string;
    type: string;
    official: boolean;
    published_at?: string;
  }[];
};