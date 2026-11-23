import { useTranslation } from 'react-i18next';

import type { TitleId } from '@/features/catalog';

import { useToggleSaved } from '../../application/hooks/useToggleSaved';
import { ToggleAction } from './ToggleAction';

type SaveButtonProps = {
  titleId: TitleId;
  showLabel?: boolean;
};

export function SaveButton({ titleId, showLabel = false }: SaveButtonProps) {
  const { t } = useTranslation();
  const { isSaved, toggle } = useToggleSaved();
  const saved = isSaved(titleId);

  return (
    <ToggleAction
      active={saved}
      activeIcon="checkmark-circle"
      inactiveIcon="add-circle-outline"
      label={t('library.myList')}
      showLabel={showLabel}
      onPress={() => toggle(titleId)}
    />
  );
}