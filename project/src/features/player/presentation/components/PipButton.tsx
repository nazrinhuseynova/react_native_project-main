import { useTranslation } from 'react-i18next';

import { IconButton } from '@/shared/ui/IconButton';

type PipButtonProps = {
  supported: boolean;
  onPress: () => void;
};

export function PipButton({ supported, onPress }: PipButtonProps) {
  const { t } = useTranslation();
  if (!supported) return null;
  return <IconButton icon="albums-outline" accessibilityLabel={t('player.pip')} onPress={onPress} color="#FFFFFF" />;
}