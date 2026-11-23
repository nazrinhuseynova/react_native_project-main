import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/shared/theme/useTheme';
import { BottomSheet } from '@/shared/ui/BottomSheet';
import { ListRow } from '@/shared/ui/ListRow';

import {
  formatSpeed,
  PLAYBACK_SPEEDS,
  type PlaybackSpeed,
} from '../../domain/entities/PlaybackSpeed';

type SpeedSheetProps = {
  visible: boolean;
  speed: PlaybackSpeed;
  onSelect: (speed: PlaybackSpeed) => void;
  onClose: () => void;
};

export function SpeedSheet({ visible, speed, onSelect, onClose }: SpeedSheetProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <BottomSheet visible={visible} onClose={onClose} title={t('player.speed')} maxHeightRatio={0.9}>
      {PLAYBACK_SPEEDS.map((item) => (
        <ListRow
          key={item}
          title={formatSpeed(item)}
          showChevron={false}
          right={item === speed ? <Ionicons name="checkmark" size={22} color={colors.primary} /> : null}
          onPress={() => {
            onSelect(item);
            onClose();
          }}
        />
      ))}
    </BottomSheet>
  );
}