import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { toUserMessage } from '@/core/errors/toUserMessage';
import { buttonA11y } from '@/shared/a11y/accessibilityProps';
import { ScalePressable } from '@/shared/animations/ScalePressable';
import { useTheme } from '@/shared/theme/useTheme';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { useToast } from '@/shared/ui/ToastProvider';

import { useDownloadState } from '../../application/hooks/useDownloadState';
import { useDownloads } from '../../application/hooks/useDownloads';
import type { DownloadQuality } from '../../domain/entities/DownloadQuality';
import { DownloadProgressRing } from './DownloadProgressRing';

type DownloadButtonProps = {
  titleId: string;
  episodeId?: string | null;
  title: string;
  posterPath?: string | null;
  quality?: DownloadQuality;
  size?: number;
};

export function DownloadButton({
  titleId,
  episodeId = null,
  title,
  posterPath = null,
  quality,
  size = 28,
}: DownloadButtonProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const toast = useToast();
  const { enqueue, pause, resume, remove } = useDownloads();
  const { item, status, progress } = useDownloadState(titleId, episodeId);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const run = (action: () => Promise<unknown>) => {
    action().catch((error: unknown) => toast.error(t(toUserMessage(error))));
  };

  const start = () => run(() => enqueue({ titleId, episodeId, title, posterPath, quality }));

  const handlePress = () => {
    switch (status) {
      case 'none':
      case 'expired':
        return start();
      case 'queued':
      case 'downloading':
        return item && run(() => pause(item.id));
      case 'paused':
      case 'failed':
        return item && run(() => resume(item.id));
      case 'completed':
        return setConfirmDelete(true);
    }
  };

  const label = t(`downloads.state.${status}`);

  let content;
  if (status === 'queued' || status === 'downloading') {
    content = (
      <DownloadProgressRing progress={progress} size={size}>
        <Ionicons name="pause" size={size * 0.45} color={colors.text} />
      </DownloadProgressRing>
    );
  } else if (status === 'paused') {
    content = (
      <DownloadProgressRing progress={progress} size={size}>
        <Ionicons name="play" size={size * 0.45} color={colors.text} />
      </DownloadProgressRing>
    );
  } else {
    const icon =
      status === 'completed'
        ? 'checkmark-circle'
        : status === 'failed'
          ? 'refresh-circle-outline'
          : status === 'expired'
            ? 'alert-circle-outline'
            : 'download-outline';
    content = (
      <Ionicons
        name={icon}
        size={size}
        color={status === 'completed' ? colors.success : status === 'expired' ? colors.warning : colors.text}
      />
    );
  }

  return (
    <>
      <ScalePressable {...buttonA11y(label)} haptic hitSlop={8} onPress={handlePress}>
        {content}
      </ScalePressable>
      <ConfirmDialog
        visible={confirmDelete}
        title={t('downloads.deleteTitle')}
        message={t('downloads.deleteMessage', { title })}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        destructive
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          setConfirmDelete(false);
          if (item) run(() => remove(item.id));
        }}
      />
    </>
  );
}