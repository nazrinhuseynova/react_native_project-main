import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SectionList, View } from 'react-native';

import { useNetworkStatus } from '@/core/network/useNetworkStatus';
import { formatBytes } from '@/core/utils/formatBytes';
import { toRouteParams, type TitleId } from '@/features/catalog';
import { useToast } from '@/shared/ui/ToastProvider';
import { makeStyles } from '@/shared/theme/makeStyles';
import { AppText } from '@/shared/ui/AppText';
import { EmptyState } from '@/shared/ui/EmptyState';
import { IconButton } from '@/shared/ui/IconButton';
import { Screen } from '@/shared/ui/Screen';
import { ScreenHeader } from '@/shared/ui/ScreenHeader';
import { SectionHeader } from '@/shared/ui/SectionHeader';
import { buttonA11y } from '@/shared/a11y/accessibilityProps';
import { ScalePressable } from '@/shared/animations/ScalePressable';

import { useDownloads } from '../../application/hooks/useDownloads';
import type { DownloadItem } from '../../domain/entities/DownloadItem';
import { DownloadButton } from '../components/DownloadButton';
import { StorageUsageBar } from '../components/StorageUsageBar';

const useStyles = makeStyles(({ colors, spacing, radius }) => ({
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: spacing.sm,
  },
  poster: {
    width: 56,
    height: 84,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceElevated,
  },
  info: { flex: 1, marginHorizontal: spacing.md },
}));

function parseEpisode(id: string | null): { season: string; episode: string } | null {
  const match = id ? /^s(\d+)e(\d+)$/.exec(id) : null;
  return match ? { season: match[1], episode: match[2] } : null;
}

type Section = { key: 'ready' | 'progress'; title: string; data: DownloadItem[] };

function DownloadRow({ item, onPlay, onRemove }: { item: DownloadItem; onPlay: () => void; onRemove: () => void }) {
  const { t } = useTranslation();
  const styles = useStyles();
  const episode = parseEpisode(item.episodeId);
  const subtitle =
    item.status === 'completed'
      ? formatBytes(item.bytesTotal)
      : `${t(`downloads.state.${item.status}`)} · ${Math.round(item.progress * 100)}%`;

  return (
    <View style={styles.row}>
      <ScalePressable
        {...buttonA11y(item.title)}
        disabled={item.status !== 'completed'}
        onPress={onPlay}
        style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
      >
        <Image source={item.posterPath ? { uri: item.posterPath } : undefined} style={styles.poster} contentFit="cover" />
        <View style={styles.info}>
          <AppText variant="bodyStrong" numberOfLines={2}>
            {item.title}
          </AppText>
          <AppText variant="caption" color="textMuted">
            {episode ? `S${episode.season}:E${episode.episode} · ${subtitle}` : subtitle}
          </AppText>
        </View>
      </ScalePressable>
      {item.status === 'completed' ? (
        <IconButton icon="trash-outline" accessibilityLabel={t('common.delete')} onPress={onRemove} />
      ) : (
        <DownloadButton titleId={item.titleId} episodeId={item.episodeId} title={item.title} posterPath={item.posterPath} />
      )}
    </View>
  );
}

export function DownloadsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const styles = useStyles();
  const { items, isLoading, remove } = useDownloads();
  const { isOffline } = useNetworkStatus();

  const sections = useMemo<Section[]>(() => {
    const ready = items.filter((item) => item.status === 'completed');
    const rest = items.filter((item) => item.status !== 'completed');
    return [
      { key: 'ready' as const, title: t('downloads.ready'), data: ready },
      { key: 'progress' as const, title: t('downloads.inProgress'), data: rest },
    ].filter((section) => section.data.length > 0);
  }, [items, t]);

  const play = (item: DownloadItem) => {
    const route = toRouteParams(item.titleId as TitleId);
    const episode = parseEpisode(item.episodeId);
    router.push({
      pathname: '/player/[id]',
      params: { id: route.id, type: route.type, ...(episode ?? {}) },
    });
  };

  return (
    <Screen
      padded={false}
      header={<ScreenHeader title={t('downloads.title')} onBack={() => router.back()} />}
    >
      <View style={styles.header}>
        <StorageUsageBar />
        {isOffline ? (
          <AppText variant="caption" color="warning" style={{ marginTop: 8 }}>
            {t('downloads.offline')}
          </AppText>
        ) : null}
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => <SectionHeader title={section.title} style={{ marginTop: 12 }} />}
        renderItem={({ item }) => (
          <DownloadRow
            item={item}
            onPlay={() => play(item)}
            onRemove={() => remove(item.id).catch(() => toast.error(t('errors.unknown')))}
          />
        )}
        ListEmptyComponent={() =>
          isLoading ? null : (
            <EmptyState
              icon="download-outline"
              title={t('downloads.emptyTitle')}
              message={t('downloads.emptyMessage')}
            />
          )
        }
      />
    </Screen>
  );
}