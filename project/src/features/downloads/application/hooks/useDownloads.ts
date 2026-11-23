import { useContext } from 'react';

import { DownloadsContext, type DownloadsContextValue } from '../DownloadsProvider';

export function useDownloads(): DownloadsContextValue {
  const value = useContext(DownloadsContext);
  if (!value) {
    throw new Error('useDownloads must be used inside <DownloadsProvider>');
  }
  return value;
}