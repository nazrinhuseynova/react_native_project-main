import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IconButton } from '@/shared/ui/IconButton';

import type { CastPort, CastState } from '../../domain/ports/CastPort';

type CastButtonProps = {
  cast: CastPort;
  onPress: () => void;
};

export function CastButton({ cast, onPress }: CastButtonProps) {
  const { t } = useTranslation();
  const [state, setState] = useState<CastState>(cast.getState());

  useEffect(() => cast.subscribe(setState), [cast]);

  if (state === 'unavailable') return null;

  return (
    <IconButton
      icon={state === 'connected' ? 'tv' : 'tv-outline'}
      accessibilityLabel={t('player.cast')}
      onPress={onPress}
      color="#FFFFFF"
      selected={state === 'connected'}
    />
  );
}