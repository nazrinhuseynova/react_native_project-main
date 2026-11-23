import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';

import type { SeasonSummary } from '@/features/catalog';
import { makeStyles } from '@/shared/theme/makeStyles';
import { Chip } from '@/shared/ui/Chip';

const useStyles = makeStyles(({ spacing }) => ({
  content: { gap: spacing.sm },
}));

type SeasonSelectorProps = {
  seasons: readonly SeasonSummary[];
  value: number | null;
  onChange: (seasonNumber: number) => void;
};

export function SeasonSelector({ seasons, value, onChange }: SeasonSelectorProps) {
  const { t } = useTranslation();
  const styles = useStyles();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
      {seasons.map((season) => (
        <Chip
          key={season.id}
          label={t('details.season', { number: season.seasonNumber })}
          selected={value === season.seasonNumber}
          onPress={() => onChange(season.seasonNumber)}
        />
      ))}
    </ScrollView>
  );
}