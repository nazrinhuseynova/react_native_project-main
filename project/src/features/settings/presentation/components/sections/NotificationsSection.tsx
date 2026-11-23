import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useServices } from '@/bootstrap/useServices';
import { useNotificationPermission } from '@/core/notifications/useNotificationPermission';
import { useTheme } from '@/shared/theme/useTheme';
import { ListRow } from '@/shared/ui/ListRow';
import { SectionHeader } from '@/shared/ui/SectionHeader';
import { SwitchRow } from '@/shared/ui/SwitchRow';

import { useSettings } from '../../../appplication/hooks/useSettings';

export function NotificationsSection() {
  const { t } = useTranslation();
  const { spacing } = useTheme();
  const { notifications: scheduler } = useServices();
  const permission = useNotificationPermission(scheduler);
  const { settings, update } = useSettings();

  const enabled = settings.notifications && permission.isGranted;

  const onToggle = async (value: boolean) => {
    if (!value) {
      update({ notifications: false });
      return;
    }
    if (permission.isGranted) {
      update({ notifications: true });
      return;
    }
    if (permission.canAskAgain) {
      const result = await permission.request();
      update({ notifications: result.status === 'granted' });
      return;
    }
    permission.openSettings();
  };

  return (
    <View style={{ gap: spacing.xs }}>
      <SectionHeader title={t('settings.notifications.title')} />
      <SwitchRow
        label={t('settings.notifications.enable')}
        description={t('settings.notifications.enableHint')}
        value={enabled}
        onValueChange={(value) => void onToggle(value)}
      />
      {permission.isDenied && !permission.canAskAgain ? (
        <ListRow
          icon="notifications-off-outline"
          title={t('settings.notifications.denied')}
          subtitle={t('settings.notifications.openSettings')}
          onPress={permission.openSettings}
          showChevron
        />
      ) : null}
    </View>
  );
}