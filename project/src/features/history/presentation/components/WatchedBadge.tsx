import { useTranslation } from 'react-i18next';

import { Badge } from '@/shared/ui/Badge';

export function WatchedBadge() {
  const { t } = useTranslation();
  return <Badge label={t('history.watchedBadge')} tone="success" />;
}