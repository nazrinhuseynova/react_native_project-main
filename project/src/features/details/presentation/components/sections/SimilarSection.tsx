import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';

import { PosterCard, toRouteParams, useSimilarTitles, type TitleId } from '@/features/catalog';
import { makeStyles } from '@/shared/theme/makeStyles';
import { SectionHeader } from '@/shared/ui/SectionHeader';

import type { DetailSectionProps } from '../../../application/detailSectionRegistry';

const useStyles = makeStyles(({ spacing }) => ({
  list: { gap: spacing.md },
}));


export function SimilarSection({ details }: DetailSectionProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const styles = useStyles();
  const { titles } = useSimilarTitles(details.title.id);

  if (titles.length === 0) return null;

  const open = (id: TitleId) => router.push({ pathname: '/movie/[id]', params: toRouteParams(id) });

  return (
    <View>
      <SectionHeader title={t('details.similar')} />
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={titles}
        keyExtractor={(title) => title.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <PosterCard title={item} onPress={open} />}
      />
    </View>
  );
}