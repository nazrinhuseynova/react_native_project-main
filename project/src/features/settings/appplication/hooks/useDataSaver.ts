import { useNetworkStatus } from '@/core/network/useNetworkStatus';

import { useSettings } from './useSettings';


export function useDataSaver() {
  const { settings } = useSettings();
  const network = useNetworkStatus();

  const isLimiting = settings.dataSaver && network.type === 'cellular';

  return {
    enabled: settings.dataSaver,
    isLimiting,
    maxQuality: isLimiting ? ('sd' as const) : ('auto' as const),
    autoplayAllowed: settings.autoplay && !isLimiting,
    previewsAllowed: !isLimiting,
  };
}