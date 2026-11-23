export const RECENT_SEARCHES_LIMIT = 10;

export interface RecentSearchRepository {
  list(): Promise<string[]>;
  add(query: string): Promise<void>;
  remove(query: string): Promise<void>;
  clear(): Promise<void>;
}