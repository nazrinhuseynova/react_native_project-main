import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { titleIdFromRoute, useTitleDetails } from '@/features/catalog';
import { useTitleProgress } from '@/features/history';
import { makeStyles } from '@/shared/theme/makeStyles';
import { ErrorState } from '@/shared/ui/ErrorState';
import { Screen } from '@/shared/ui/Screen';
import { Skeleton } from '@/shared/ui/Skeleton';

import { detailSectionRegistry } from '../../application/detailSectionRegistry';
import { useMatchScore } from '../../application/hooks/useMatchScore';
import { useTitleActions } from '../../application/hooks/useTitleActions';
import { qualityBadgesFor } from '../../domain/services/QualityBadges';
import { ActionBar } from '../components/ActionBar';
import { DetailsHeader } from '../components/DetailsHeader';
import { MetaRow } from '../components/MetaRow';

const useStyles = makeStyles(({ spacing }) => ({
  body: { padding: spacing.lg, gap: spacing.xl },
  skeleton: { padding: spacing.lg, gap: spacing.md },
}));

export function TitleDetailsScreen() {
  const params = useLocalSearchParams<{ id: string; type?: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const styles = useStyles();

  const titleId = titleIdFromRoute(params.id, params.type);
  const { details, isLoading, isError, refetch } = useTitleDetails(titleId);
  const title = details?.title;

  const matchScore = useMatchScore(title);
  const actions = useTitleActions(title);
  const { fraction, isCompleted } = useTitleProgress(titleId);

  const sections = useMemo(
    () =>
      details
        ? detailSectionRegistry.all().filter((section) => section.isVisible?.(details) ?? true)
        : [],
    [details],
  );

  if (!titleId || isError) {
    return (
      <Screen>
        <ErrorState
          title={t('details.error')}
          retryLabel={t('details.retry')}
          onRetry={titleId ? () => void refetch() : undefined}
        />
      </Screen>
    );
  }

  if (isLoading || !details || !title) {
    return (
      <Screen padded={false} edges={['left', 'right']}>
        <Skeleton height={240} radius={0} />
        <View style={styles.skeleton}>
          <Skeleton height={28} width="70%" />
          <Skeleton height={48} />
          <Skeleton height={100} />
        </View>
      </Screen>
    );
  }

  const resume = fraction !== null && fraction > 0 && !isCompleted;

  return (
    <Screen scroll padded={false} edges={['left', 'right']}>
      <DetailsHeader title={title} onBack={() => router.back()} />
      <View style={styles.body}>
        <MetaRow title={title} matchScore={matchScore} badges={qualityBadgesFor(title)} />
        <ActionBar
          title={title}
          resume={resume}
          myRating={actions.myRating}
          onPlay={actions.play}
          onDownload={actions.download}
          onRate={actions.rate}
          onShare={() => void actions.share()}
        />
        {sections.map(({ id, Component }) => (
          <Component key={id} details={details} />
        ))}
      </View>
    </Screen>
  );
}