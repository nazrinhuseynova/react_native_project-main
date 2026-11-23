import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import { makeStyles } from '@/shared/theme/makeStyles';
import { Chip } from '@/shared/ui/Chip';
import { Divider } from '@/shared/ui/Divider';

import type { LibraryFilter } from '../../domain/filters/LibraryFilter';
import type { LibrarySorter } from '../../domain/sorters/LibrarySorter';

const useStyles = makeStyles(({ spacing }) => ({
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    alignItems: 'center' as const,
  },
}));

type LibraryToolbarProps = {
  sorters: readonly LibrarySorter[];
  sorterId: string;
  onSortChange: (id: string) => void;
  filters: readonly LibraryFilter[];
  filterId: string | null;
  onFilterChange: (id: string | null) => void;
};

export function LibraryToolbar({
  sorters,
  sorterId,
  onSortChange,
  filters,
  filterId,
  onFilterChange,
}: LibraryToolbarProps) {
  const { t } = useTranslation();
  const styles = useStyles();

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Chip
          label={t('library.filter.all')}
          selected={filterId === null}
          onPress={() => onFilterChange(null)}
        />
        {filters.map((filter) => (
          <Chip
            key={filter.id}
            label={t(filter.labelKey)}
            selected={filterId === filter.id}
            onPress={() => onFilterChange(filter.id)}
          />
        ))}
        <Divider vertical inset={6} />
        {sorters.map((sorter) => (
          <Chip
            key={sorter.id}
            icon="swap-vertical"
            label={t(sorter.labelKey)}
            selected={sorterId === sorter.id}
            onPress={() => onSortChange(sorter.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}