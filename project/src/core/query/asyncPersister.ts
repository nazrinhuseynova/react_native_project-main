import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { defaultShouldDehydrateQuery } from '@tanstack/react-query';
import type { PersistQueryClientOptions } from '@tanstack/react-query-persist-client';

import { QUERY_CACHE_BUSTER, QUERY_PERSIST_MAX_AGE_MS } from '@/core/config/constants';
import type { KeyValueStorage } from '@/core/storage/KeyValueStorage';
import { storageKeys } from '@/core/storage/storageKeys';

export type QueryPersister = ReturnType<typeof createAsyncStoragePersister>;

export function createQueryPersister(storage: KeyValueStorage): QueryPersister {
  return createAsyncStoragePersister({
    storage: {
      getItem: (key) => storage.getString(key),
      setItem: (key, value) => storage.setString(key, value),
      removeItem: (key) => storage.remove(key),
    },
    key: storageKeys.queryCache,
    throttleTime: 1000,
  });
}

export function createPersistOptions(
  persister: QueryPersister,
): Omit<PersistQueryClientOptions, 'queryClient'> {
  return {
    persister,
    maxAge: QUERY_PERSIST_MAX_AGE_MS,
    buster: QUERY_CACHE_BUSTER,
    dehydrateOptions: {
      shouldDehydrateQuery: (query) =>
        defaultShouldDehydrateQuery(query) && query.meta?.persist !== false,
    },
  };
}