import { useTranslation } from 'react-i18next';

import { Chip } from '@/shared/ui/Chip';

import type { GenreOption } from '../../domain/OnboardingStep';

type GenreChipProps = {
  option: GenreOption;
  selected: boolean;
  onToggle: (id: number) => void;
};

export function GenreChip({ option, selected, onToggle }: GenreChipProps) {
  const { t } = useTranslation();

  return (
    <Chip
      label={t(option.labelKey)}
      selected={selected}
      icon={selected ? 'checkmark' : undefined}
      onPress={() => onToggle(option.id)}
    />
  );
}