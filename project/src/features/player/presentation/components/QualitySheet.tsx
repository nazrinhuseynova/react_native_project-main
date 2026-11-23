import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/shared/theme/useTheme';
import { BottomSheet } from '@/shared/ui/BottomSheet';
import { ListRow } from '@/shared/ui/ListRow';

import { QUALITY_AUTO_ID, type QualityOption } from '../../application/hooks/useTracks';

type QualitySheetProps = {
  visible: boolean;
  qualities: QualityOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
};

export function QualitySheet({ visible, qualities, selectedId, onSelect, onClose }: QualitySheetProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const check = <Ionicons name="checkmark" size={22} color={colors.primary} />;

  return (
    <BottomSheet visible={visible} onClose={onClose} title={t('player.quality')} maxHeightRatio={0.9}>
      <ListRow
        title={t('player.qualityAuto')}
        subtitle={t('player.qualityAutoHint')}
        showChevron={false}
        right={selectedId === QUALITY_AUTO_ID ? check : null}
        onPress={() => {
          onSelect(QUALITY_AUTO_ID);
          onClose();
        }}
      />
      {qualities.map((item) => (
        <ListRow
          key={item.id}
          title={item.label}
          showChevron={false}
          right={item.id === selectedId ? check : null}
          onPress={() => {
            onSelect(item.id);
            onClose();
          }}
        />
      ))}
    </BottomSheet>
  );
}