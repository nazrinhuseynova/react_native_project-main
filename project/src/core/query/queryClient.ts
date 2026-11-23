import { onlineManager, QueryClient } from '@tanstack/react-query';

import { QUERY_GC_TIME_MS, QUERY_STALE_TIME_MS } from '@/core/config/constants';
import { NetworkError } from '@/core/errors/NetworkError';
import type { NetworkMonitor } from '@/core/network/NetworkMonitor';

const MAX_QUERY_RETRIES = 1;

function shouldRetry(failureCount: number, error: Error): boolean {
  return (
    failureCount < MAX_QUERY_RETRIES && error instanceof NetworkError && error.isRetryable
  );
}

export function createQueryClient(networkMonitor: NetworkMonitor): QueryClient {
  onlineManager.setEventListener((setOnline) =>
    networkMonitor.subscribe((status) => setOnline(status.isInternetReachable)),
  );

  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERY_STALE_TIME_MS,
        gcTime: QUERY_GC_TIME_MS,
        retry: shouldRetry,
        refetchOnReconnect: true,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}