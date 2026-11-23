import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useNetworkStatus } from '@/core/network/useNetworkStatus';
import { buttonA11y } from '@/shared/a11y/accessibilityProps';
import { ScalePressable } from '@/shared/animations/ScalePressable';
import { OfflineBanner } from '@/shared/ui/OfflineBanner';

/** İnternet yoxdursa: banner + birbaşa Yüklənmişlər ekranına keçid. */
export function OfflineGateBanner({ linkToDownloads = true }: { linkToDownloads?: boolean }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { isOffline } = useNetworkStatus();

  if (!isOffline) return null;

  const banner = <OfflineBanner visible message={t(linkToDownloads ? 'downloads.offlineGo' : 'downloads.offline')} />;
  if (!linkToDownloads) return banner;

  return (
    <ScalePressable {...buttonA11y(t('downloads.offlineGo'))} onPress={() => router.push('/downloads')}>
      {banner}
    </ScalePressable>
  );
}