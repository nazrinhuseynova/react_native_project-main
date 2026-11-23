import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl, View } from 'react-native';

import { toUserMessage } from '@/core/errors/toUserMessage';
import { useRefresh } from '@/shared/hooks/useRefresh';
import { useTheme } from '@/shared/theme/useTheme';
import { Divider } from '@/shared/ui/Divider';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { Screen } from '@/shared/ui/Screen';
import { ScreenHeader } from '@/shared/ui/ScreenHeader';
import { Skeleton } from '@/shared/ui/Skeleton';
import { useToast } from '@/shared/ui/ToastProvider';

import { useParentalSettings } from '../../application/hooks/useParentalSettings';
import type { BlockedTitle } from '../../domain/entities/ParentalSettings';
import { BlockedTitleRow } from '../components/BlockedTitleRow';

export function BlockedTitlesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const { colors } = useTheme();
  const { profileId } = useLocalSearchParams<{ profileId?: string }>();

  const { settings, isLoading, isError, refetch, unblockTitle, isSaving } = useParentalSettings(profileId);
  const { refreshing, onRefresh } = useRefresh(refetch);

  const onUnblock = (item: BlockedTitle) => {
    unblockTitle(item.titleId).catch((error: unknown) => toast.error(t(toUserMessage(error))));
  };

  const header = <ScreenHeader title={t('parental.blocked.title')} onBack={() => router.back()} />;

  if (isError) {
    return (
      <Screen header={header}>
        <ErrorState message={t('errors.unknown')} onRetry={() => void refetch()} retryLabel={t('common.retry')} />
      </Screen>
    );
  }

  return (
    <Screen header={header} padded={false}>
      {isLoading ? (
        <View style={{ padding: 16, gap: 12 }}>
          {[0, 1, 2, 3].map((key) => (
            <Skeleton key={key} height={72} />
          ))}
        </View>
      ) : (
        <FlatList
          data={settings?.blockedTitles ?? []}
          keyExtractor={(item) => item.titleId}
          contentContainerStyle={{ paddingHorizontal: 16, flexGrow: 1 }}
          ItemSeparatorComponent={Divider}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          ListEmptyComponent={
            <EmptyState
              icon="eye-outline"
              title={t('parental.blocked.empty.title')}
              message={t('parental.blocked.empty.message')}
            />
          }
          renderItem={({ item }) => (
            <BlockedTitleRow item={item} onUnblock={onUnblock} disabled={isSaving} />
          )}
        />
      )}
    </Screen>
  );
}