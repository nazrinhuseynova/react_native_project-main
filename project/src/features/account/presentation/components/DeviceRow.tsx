import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import type { Device } from '@/features/auth';
import type { IconName } from '@/shared/types/common';
import { useTheme } from '@/shared/theme/useTheme';
import { AppText } from '@/shared/ui/AppText';
import { Badge } from '@/shared/ui/Badge';
import { IconButton } from '@/shared/ui/IconButton';

type DeviceRowProps = {
  device: Device;
  onRemove: (device: Device) => void;
  disabled?: boolean;
};

const ICONS: Record<Device['platform'], IconName> = {
  android: 'phone-portrait-outline',
  ios: 'phone-portrait-outline',
  web: 'desktop-outline',
  unknown: 'hardware-chip-outline',
};

export function DeviceRow({ device, onRemove, disabled = false }: DeviceRowProps) {
  const { t } = useTranslation();
  const { colors, spacing } = useTheme();
  const lastActive = new Date(device.lastActiveAt).toLocaleString();
  const details = [device.model, device.osVersion].filter(Boolean).join(' · ');

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md }}>
      <Ionicons name={ICONS[device.platform]} size={26} color={colors.textSecondary} style={{ marginRight: spacing.md }} />
      <View style={{ flex: 1, gap: 2 }}>
        <AppText variant="bodyStrong" numberOfLines={1}>
          {device.name}
        </AppText>
        {details ? (
          <AppText variant="caption" color="textMuted" numberOfLines={1}>
            {details}
          </AppText>
        ) : null}
        <AppText variant="caption" color="textMuted">
          {t('account.devices.lastActive', { date: lastActive })}
        </AppText>
      </View>
      {device.isCurrent ? (
        <Badge label={t('account.devices.current')} tone="success" />
      ) : (
        <IconButton
          icon="trash-outline"
          accessibilityLabel={t('account.devices.remove')}
          disabled={disabled}
          onPress={() => onRemove(device)}
        />
      )}
    </View>
  );
}