import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl, View } from 'react-native';

import { toUserMessage } from '@/core/errors/toUserMessage';
import type { Device } from '@/features/auth';
import { useDisclosure } from '@/shared/hooks/useDisclosure';
import { useRefresh } from '@/shared/hooks/useRefresh';
import { useTheme } from '@/shared/theme/useTheme';
import { Button } from '@/shared/ui/Button';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { Divider } from '@/shared/ui/Divider';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { Screen } from '@/shared/ui/Screen';
import { ScreenHeader } from '@/shared/ui/ScreenHeader';
import { Skeleton } from '@/shared/ui/Skeleton';
import { useToast } from '@/shared/ui/ToastProvider';

import { useDevices } from '../../application/hooks/useDevices';
import { DeviceRow } from '../components/DeviceRow';

export function DevicesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const { colors } = useTheme();
  const {
    devices,
    isLoading,
    isError,
    refetch,
    revokeDevice,
    isRevoking,
    signOutAllDevices,
    isSigningOutAll,
  } = useDevices();
  const { refreshing, onRefresh } = useRefresh(refetch);

  const [target, setTarget] = useState<Device | null>(null);
  const signOutAllDialog = useDisclosure();

  const onConfirmRevoke = async () => {
    if (!target) return;
    try {
      await revokeDevice(target.id);
    } catch (error) {
      toast.error(t(toUserMessage(error)));
    } finally {
      setTarget(null);
    }
  };

  const onConfirmSignOutAll = async () => {
    try {
      await signOutAllDevices();
    } catch (error) {
      signOutAllDialog.close();
      toast.error(t(toUserMessage(error)));
    }
  };

  const header = <ScreenHeader title={t('account.devices.title')} onBack={() => router.back()} />;

  if (isError) {
    return (
      <Screen header={header}>
        <ErrorState message={t('errors.unknown')} onRetry={() => void refetch()} retryLabel={t('common.retry')} />
      </Screen>
    );
  }

  return (
    <Screen header={header} padded={false}>
      {isLoading ? (
        <View style={{ padding: 16, gap: 12 }}>
          {[0, 1, 2].map((key) => (
            <Skeleton key={key} height={64} />
          ))}
        </View>
      ) : (
        <FlatList
          data={devices}
          keyExtractor={(device) => device.id}
          contentContainerStyle={{ paddingHorizontal: 16, flexGrow: 1 }}
          ItemSeparatorComponent={Divider}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          ListEmptyComponent={<EmptyState icon="phone-portrait-outline" title={t('account.devices.empty')} />}
          renderItem={({ item }) => (
            <DeviceRow device={item} disabled={isRevoking} onRemove={setTarget} />
          )}
          ListFooterComponent={() =>
            devices.length > 0 ? (
              <View style={{ paddingVertical: 24 }}>
                <Button
                  label={t('account.devices.signOutAll')}
                  variant="secondary"
                  leftIcon="log-out-outline"
                  onPress={signOutAllDialog.open}
                />
              </View>
            ) : null
          }
        />
      )}

      <ConfirmDialog
        visible={target !== null}
        title={t('account.devices.removeTitle')}
        message={t('account.devices.removeMessage', { name: target?.name ?? '' })}
        confirmLabel={t('account.devices.remove')}
        cancelLabel={t('common.cancel')}
        destructive
        loading={isRevoking}
        onConfirm={() => void onConfirmRevoke()}
        onCancel={() => setTarget(null)}
      />

      <ConfirmDialog
        visible={signOutAllDialog.isOpen}
        title={t('account.devices.signOutAllTitle')}
        message={t('account.devices.signOutAllMessage')}
        confirmLabel={t('account.devices.signOutAll')}
        cancelLabel={t('common.cancel')}
        destructive
        loading={isSigningOutAll}
        onConfirm={() => void onConfirmSignOutAll()}
        onCancel={signOutAllDialog.close}
      />
    </Screen>
  );
}