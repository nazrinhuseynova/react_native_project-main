import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native';

import { PersonAvatar } from '@/features/catalog';
import { SectionHeader } from '@/shared/ui/SectionHeader';
import { View } from 'react-native';

import type { DetailSectionProps } from '../../../application/detailSectionRegistry';

export function CastSection({ details }: DetailSectionProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View>
      <SectionHeader title={t('details.cast')} />
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={details.cast}
        keyExtractor={(member) => String(member.id)}
        renderItem={({ item }) => (
          <PersonAvatar
            name={item.name}
            subtitle={item.character}
            profile={item.profile}
            onPress={() => router.push({ pathname: '/person/[id]', params: { id: String(item.id) } })}
          />
        )}
      />
    </View>
  );
}