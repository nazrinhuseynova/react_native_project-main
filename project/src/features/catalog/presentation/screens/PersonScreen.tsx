import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { formatDate } from '@/core/utils/formatDate';
import { makeStyles } from '@/shared/theme/makeStyles';
import { AppText } from '@/shared/ui/AppText';
import { ErrorState } from '@/shared/ui/ErrorState';
import { IconButton } from '@/shared/ui/IconButton';
import { Screen } from '@/shared/ui/Screen';
import { Skeleton } from '@/shared/ui/Skeleton';
import { SectionHeader } from '@/shared/ui/SectionHeader';

import { usePerson } from '../../application/hooks/usePerson';
import { toRouteParams, type TitleId } from '../../domain/entities/TitleId';
import { PersonAvatar } from '../components/PersonAvatar';
import { TitleGrid } from '../components/TitleGrid';

const BIOGRAPHY_PREVIEW_LINES = 5;

const useStyles = makeStyles(({ spacing }) => ({
  topBar: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  header: { padding: spacing.lg, gap: spacing.md },
  identity: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: spacing.lg },
  identityText: { flex: 1, gap: spacing.xs },
}));

export function PersonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const styles = useStyles();
  const [expanded, setExpanded] = useState(false);

  const personId = /^\d+$/.test(id ?? '') ? Number(id) : null;
  const { person, credits, isLoading, isError, refetch } = usePerson(personId);

  const back = (
    <View style={styles.topBar}>
      <IconButton icon="chevron-back" accessibilityLabel={t('common.back')} onPress={() => router.back()} />
    </View>
  );

  if (isLoading) {
    return (
      <Screen header={back}>
        <Skeleton height={96} />
        <Skeleton height={120} style={{ marginTop: 16 }} />
      </Screen>
    );
  }

  if (isError || !person) {
    return (
      <Screen header={back}>
        <ErrorState
          message={t('errors.unknown')}
          onRetry={() => void refetch()}
          retryLabel={t('common.retry')}
        />
      </Screen>
    );
  }

  const openTitle = (titleId: TitleId) =>
    router.push({ pathname: '/movie/[id]', params: toRouteParams(titleId) });

  const header = (
    <View style={styles.header}>
      <View style={styles.identity}>
        <PersonAvatar name="" profile={person.profile} size={96} />
        <View style={styles.identityText}>
          <AppText variant="title1">{person.name}</AppText>
          {person.birthday ? (
            <AppText variant="callout" color="textSecondary">
              {t('catalog.person.born', { date: formatDate(person.birthday, i18n.language) })}
            </AppText>
          ) : null}
          {person.placeOfBirth ? (
            <AppText variant="caption" color="textMuted">
              {person.placeOfBirth}
            </AppText>
          ) : null}
        </View>
      </View>

      <View>
        <SectionHeader title={t('catalog.person.biography')} />
        <AppText
          variant="body"
          color="textSecondary"
          numberOfLines={expanded ? undefined : BIOGRAPHY_PREVIEW_LINES}
        >
          {person.biography || t('catalog.person.noBiography')}
        </AppText>
        {person.biography.length > 240 ? (
          <AppText
            variant="callout"
            color="primary"
            weight="600"
            style={{ marginTop: 8 }}
            onPress={() => setExpanded((value) => !value)}
          >
            {expanded ? t('catalog.person.readLess') : t('catalog.person.readMore')}
          </AppText>
        ) : null}
      </View>

      {credits.length > 0 ? <SectionHeader title={t('catalog.person.knownFor')} /> : null}
    </View>
  );

  return (
    <Screen padded={false} header={back}>
      <TitleGrid titles={credits} onPressTitle={openTitle} header={header} />
    </Screen>
  );
}