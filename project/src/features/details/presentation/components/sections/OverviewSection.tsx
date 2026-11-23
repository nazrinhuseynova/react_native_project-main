import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { directorsOf } from '@/features/catalog';
import { buttonA11y } from '@/shared/a11y/accessibilityProps';
import { ScalePressable } from '@/shared/animations/ScalePressable';
import { makeStyles } from '@/shared/theme/makeStyles';
import { AppText } from '@/shared/ui/AppText';

import type { DetailSectionProps } from '../../../application/detailSectionRegistry';

const useStyles = makeStyles(({ spacing }) => ({
  root: { gap: spacing.sm },
}));

const COLLAPSE_AFTER = 200;

export function OverviewSection({ details }: DetailSectionProps) {
  const { t } = useTranslation();
  const styles = useStyles();
  const [expanded, setExpanded] = useState(false);

  const { title } = details;
  const directors = directorsOf({ cast: details.cast, crew: details.crew });
  const genres = title.genres.map((genre) => genre.name).join(' · ');
  const isLong = title.overview.length > COLLAPSE_AFTER;

  return (
    <View style={styles.root}>
      {title.tagline ? (
        <AppText variant="callout" color="textSecondary" style={{ fontStyle: 'italic' }}>
          {title.tagline}
        </AppText>
      ) : null}
      {title.overview ? (
        <AppText variant="body" numberOfLines={expanded ? undefined : 4}>
          {title.overview}
        </AppText>
      ) : null}
      {isLong ? (
        <ScalePressable
          {...buttonA11y(expanded ? t('details.less') : t('details.more'))}
          onPress={() => setExpanded((value) => !value)}
          style={{ alignSelf: 'flex-start' }}
        >
          <AppText variant="callout" color="primary" weight="600">
            {expanded ? t('details.less') : t('details.more')}
          </AppText>
        </ScalePressable>
      ) : null}
      {genres ? (
        <AppText variant="callout" color="textSecondary">
          {genres}
        </AppText>
      ) : null}
      {directors.length > 0 ? (
        <AppText variant="callout" color="textSecondary">
          {t('details.director')}: {directors.map((director) => director.name).join(', ')}
        </AppText>
      ) : null}
    </View>
  );
}