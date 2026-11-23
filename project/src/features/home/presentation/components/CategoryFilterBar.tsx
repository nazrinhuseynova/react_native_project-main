import { ScrollView } from 'react-native';

import { useTheme } from '@/shared/theme/useTheme';
import { Chip } from '@/shared/ui/Chip';

import type { CategoryOption } from '../../application/hooks/useCategoryFilter';
import type { CategoryFilter } from '../../domain/CategoryFilter';

type CategoryFilterBarProps = {
  options: readonly CategoryOption[];
  isSelected: (option: CategoryOption) => boolean;
  onSelect: (filter: CategoryFilter) => void;
};

export function CategoryFilterBar({ options, isSelected, onSelect }: CategoryFilterBarProps) {
  const { spacing } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        gap: spacing.sm,
      }}
    >
      {options.map((option) => (
        <Chip
          key={option.key}
          label={option.label}
          selected={isSelected(option)}
          onPress={() => onSelect(option.filter)}
        />
      ))}
    </ScrollView>
  );
}