import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { makeStyles } from '@/shared/theme/makeStyles';
import { ListRow } from '@/shared/ui/ListRow';
import { IconButton } from '@/shared/ui/IconButton';
import { SectionHeader } from '@/shared/ui/SectionHeader';

const useStyles = makeStyles(({ spacing }) => ({
  root: { marginBottom: spacing.xl },
}));

type RecentSearchesListProps = {
  items: readonly string[];
  onPress: (query: string) => void;
  onRemove: (query: string) => void;
  onClear: () => void;
};

export function RecentSearchesList({ items, onPress, onRemove, onClear }: RecentSearchesListProps) {
  const { t } = useTranslation();
  const styles = useStyles();

  if (items.length === 0) return null;

  return (
    <View style={styles.root}>
      <SectionHeader
        title={t('search.recent.title')}
        actionLabel={t('search.recent.clear')}
        onAction={onClear}
      />
      {items.map((query) => (
        <ListRow
          key={query}
          icon="time-outline"
          title={query}
          showChevron={false}
          onPress={() => onPress(query)}
          right={
            <IconButton
              icon="close"
              size={18}
              accessibilityLabel={t('search.recent.remove')}
              onPress={() => onRemove(query)}
            />
          }
        />
      ))}
    </View>
  );
}