import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { toUserMessage } from '@/core/errors/toUserMessage';
import { useAuth } from '@/features/auth';
import { useDisclosure } from '@/shared/hooks/useDisclosure';
import { Badge } from '@/shared/ui/Badge';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { Divider } from '@/shared/ui/Divider';
import { ListRow } from '@/shared/ui/ListRow';
import { Screen } from '@/shared/ui/Screen';
import { ScreenHeader } from '@/shared/ui/ScreenHeader';
import { useToast } from '@/shared/ui/ToastProvider';

export function SecurityScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const { user, signOutAllDevices } = useAuth();
  const dialog = useDisclosure();

  const onSignOutAll = async () => {
    try {
      await signOutAllDevices();
    } catch (error) {
      dialog.close();
      toast.error(t(toUserMessage(error)));
    }
  };

  return (
    <Screen
      scroll
      padded={false}
      header={<ScreenHeader title={t('account.security.title')} onBack={() => router.back()} />}
      contentContainerStyle={{ padding: 16 }}
    >
      <Divider />
      {user?.provider === 'email' ? (
        <>
          <ListRow icon="key-outline" title={t('account.sections.password')} onPress={() => router.push('/account/change-password')} />
          <Divider />
        </>
      ) : null}
      <ListRow icon="phone-portrait-outline" title={t('account.sections.devices')} onPress={() => router.push('/account/devices')} />
      <Divider />
      <ListRow
        icon="log-out-outline"
        title={t('account.devices.signOutAll')}
        subtitle={t('account.security.signOutAllHint')}
        onPress={dialog.open}
      />
      <Divider />
    
      <ListRow
        icon="shield-half-outline"
        title={t('account.security.twoFactor')}
        subtitle={t('account.security.twoFactorHint')}
        disabled
        showChevron={false}
        right={<View><Badge label={t('account.security.soon')} tone="neutral" /></View>}
      />
      <Divider />

      <ConfirmDialog
        visible={dialog.isOpen}
        title={t('account.devices.signOutAllTitle')}
        message={t('account.devices.signOutAllMessage')}
        confirmLabel={t('account.devices.signOutAll')}
        cancelLabel={t('common.cancel')}
        destructive
        onConfirm={() => void onSignOutAll()}
        onCancel={dialog.close}
      />
    </Screen>
  );
}