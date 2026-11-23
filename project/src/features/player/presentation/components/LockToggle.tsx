import { useTranslation } from 'react-i18next';

import { IconButton } from '@/shared/ui/IconButton';

type LockToggleProps = {
  locked: boolean;
  onPress: () => void;
};

export function LockToggle({ locked, onPress }: LockToggleProps) {
  const { t } = useTranslation();
  return (
    <IconButton
      icon={locked ? 'lock-closed' : 'lock-open-outline'}
      accessibilityLabel={locked ? t('player.unlock') : t('player.lock')}
      onPress={onPress}
      color="#FFFFFF"
      filled={locked}
    />
  );
}