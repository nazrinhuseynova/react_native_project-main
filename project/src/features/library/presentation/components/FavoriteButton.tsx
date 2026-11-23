import { useTranslation } from 'react-i18next';

import type { TitleId } from '@/features/catalog';

import { useToggleFavorite } from '../../application/hooks/useToggleFavorite';
import { ToggleAction } from './ToggleAction';

type FavoriteButtonProps = {
  titleId: TitleId;
  showLabel?: boolean;
};

export function FavoriteButton({ titleId, showLabel = false }: FavoriteButtonProps) {
  const { t } = useTranslation();
  const { isFavorite, toggle } = useToggleFavorite();
  const favorite = isFavorite(titleId);

  return (
    <ToggleAction
      active={favorite}
      activeIcon="heart"
      inactiveIcon="heart-outline"
      label={t('library.favorite')}
      showLabel={showLabel}
      onPress={() => toggle(titleId)}
    />
  );
}