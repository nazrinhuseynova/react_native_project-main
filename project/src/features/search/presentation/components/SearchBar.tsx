import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { makeStyles } from '@/shared/theme/makeStyles';
import { AppText } from '@/shared/ui/AppText';
import { IconButton } from '@/shared/ui/IconButton';
import { TextField } from '@/shared/ui/TextField';

const useStyles = makeStyles(({ colors, spacing }) => ({
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing.sm,
  },
  field: { flex: 1 },
  counter: {
    position: 'absolute' as const,
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: colors.primary,
  },
}));

type SearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
  onSubmit: () => void;
  onOpenFilters: () => void;
  activeFilters: number;
};

export function SearchBar({
  value,
  onChangeText,
  onSubmit,
  onOpenFilters,
  activeFilters,
}: SearchBarProps) {
  const { t } = useTranslation();
  const styles = useStyles();

  return (
    <View style={styles.row}>
      <TextField
        containerStyle={styles.field}
        leftIcon="search"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={t('search.placeholder')}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        rightElement={
          value.length > 0 ? (
            <IconButton
              icon="close-circle"
              size={20}
              accessibilityLabel={t('search.clear')}
              onPress={() => onChangeText('')}
            />
          ) : null
        }
      />
      <View>
        <IconButton
          icon="options-outline"
          filled
          accessibilityLabel={t('search.filter')}
          onPress={onOpenFilters}
        />
        {activeFilters > 0 ? (
          <View style={styles.counter} pointerEvents="none">
            <AppText variant="overline" color="textOnPrimary">
              {activeFilters}
            </AppText>
          </View>
        ) : null}
      </View>
    </View>
  );
}