import type { HomeSources } from '../domain/HomeContext';


export const emptyHomeSources: HomeSources = {
  history: {
    continueWatching: async () => [],
    recentlyWatched: async () => [],
  },
  library: {
    savedTitleIds: async () => [],
  },
};