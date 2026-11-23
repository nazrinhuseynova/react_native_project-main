import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Share } from 'react-native';

import { buildTitleShareUrl } from '@/core/linking/buildShareUrl';
import type { Title } from '@/features/catalog';

type Shareable = Pick<Title, 'name' | 'tmdbId' | 'kind'>;


export function useShareTitle(title: Shareable | undefined) {
  const { t } = useTranslation();

  return useCallback(async () => {
    if (!title) return;
    const url = buildTitleShareUrl(title.tmdbId, title.kind);
    try {
      await Share.share({ message: t('details.shareMessage', { title: title.name, url }) });
    } catch {
      // istifadəçi paylaşımı ləğv edib və ya cihaz dəstəkləmir; səssiz keç
    }
  }, [title, t]);
}