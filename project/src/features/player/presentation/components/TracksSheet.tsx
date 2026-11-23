import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/shared/theme/useTheme';
import { BottomSheet } from '@/shared/ui/BottomSheet';
import { Divider } from '@/shared/ui/Divider';
import { ListRow } from '@/shared/ui/ListRow';
import { SectionHeader } from '@/shared/ui/SectionHeader';

import type { AudioOption } from '../../domain/entities/AudioOption';
import { SUBTITLES_OFF_ID, type SubtitleOption } from '../../domain/entities/SubtitleOption';

type TracksSheetProps = {
  visible: boolean;
  audio: AudioOption[];
  subtitles: SubtitleOption[];
  audioId: string | null;
  subtitleId: string;
  onSelectAudio: (id: string) => void;
  onSelectSubtitle: (id: string) => void;
  onClose: () => void;
};

export function TracksSheet({
  visible,
  audio,
  subtitles,
  audioId,
  subtitleId,
  onSelectAudio,
  onSelectSubtitle,
  onClose,
}: TracksSheetProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const check = <Ionicons name="checkmark" size={22} color={colors.primary} />;

  return (
    <BottomSheet visible={visible} onClose={onClose} title={t('player.audioSubtitles')} maxHeightRatio={0.9}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SectionHeader title={t('player.audio')} />
        {audio.length === 0 ? (
          <ListRow title={t('player.defaultTrack')} showChevron={false} right={check} />
        ) : (
          audio.map((item) => (
            <ListRow
              key={item.id}
              title={item.label}
              showChevron={false}
              right={item.id === audioId ? check : null}
              onPress={() => onSelectAudio(item.id)}
            />
          ))
        )}
        <Divider />
        <SectionHeader title={t('player.subtitles')} style={{ marginTop: 12 }} />
        <ListRow
          title={t('player.subtitlesOff')}
          showChevron={false}
          right={subtitleId === SUBTITLES_OFF_ID ? check : null}
          onPress={() => onSelectSubtitle(SUBTITLES_OFF_ID)}
        />
        {subtitles.map((item) => (
          <ListRow
            key={item.id}
            title={item.label}
            showChevron={false}
            right={item.id === subtitleId ? check : null}
            onPress={() => onSelectSubtitle(item.id)}
          />
        ))}
      </ScrollView>
    </BottomSheet>
  );
}