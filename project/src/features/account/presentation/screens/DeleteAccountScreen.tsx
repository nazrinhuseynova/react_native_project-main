import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { toUserMessage } from '@/core/errors/toUserMessage';
import { useDisclosure } from '@/shared/hooks/useDisclosure';
import { AppText } from '@/shared/ui/AppText';
import { Button } from '@/shared/ui/Button';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { Screen } from '@/shared/ui/Screen';
import { ScreenHeader } from '@/shared/ui/ScreenHeader';
import { SwitchRow } from '@/shared/ui/SwitchRow';
import { useToast } from '@/shared/ui/ToastProvider';

import { useDeleteAccount } from '../../application/hooks/useDeleteAccount';
import { DeletionReasonPicker, type DeletionReason } from '../components/DeletionReasonPicker';
import { ReauthSheet } from '../components/ReauthSheet';

export function DeleteAccountScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const confirmDialog = useDisclosure();
  const deletion = useDeleteAccount();

  const [reason, setReason] = useState<DeletionReason | null>(null);
  const [understood, setUnderstood] = useState(false);

  const header = <ScreenHeader title={t('account.delete.title')} onBack={() => router.back()} />;

  const onRestore = async () => {
    try {
      await deletion.restoreAccount();
      toast.success(t('account.delete.restored'));
      router.back();
    } catch (error) {
      toast.error(t(toUserMessage(error)));
    }
  };

  const onConfirm = async () => {
    confirmDialog.close();
    try {
      await deletion.requestDeletion(reason);
    } catch (error) {
      toast.error(t(toUserMessage(error)));
    }
  };

  if (deletion.isPendingDeletion) {
    return (
      <Screen scroll header={header}>
        <View style={{ gap: 12 }}>
          <AppText variant="title3">{t('account.delete.pendingTitle')}</AppText>
          <AppText variant="body" color="textSecondary">
            {t('account.delete.pendingMessage', { days: deletion.daysLeft ?? 0 })}
          </AppText>
          <Button
            label={t('account.delete.restore')}
            loading={deletion.isRestoring}
            onPress={() => void onRestore()}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll header={header}>
      <View style={{ gap: 16 }}>
        <AppText variant="body" color="textSecondary">
          {t('account.delete.warning')}
        </AppText>
        <AppText variant="callout" color="textMuted">
          {t('account.delete.grace', { days: deletion.graceDays })}
        </AppText>

        <AppText variant="captionStrong" color="textSecondary">
          {t('account.delete.reasonTitle')}
        </AppText>
        <DeletionReasonPicker value={reason} onChange={setReason} />

        <SwitchRow
          label={t('account.delete.understand')}
          value={understood}
          onValueChange={setUnderstood}
        />

        {deletion.requestErrorKey ? (
          <AppText variant="callout" color="danger" accessibilityLiveRegion="polite">
            {t(deletion.requestErrorKey)}
          </AppText>
        ) : null}

        <Button
          label={t('account.delete.submit')}
          variant="danger"
          disabled={!understood}
          loading={deletion.isRequesting}
          onPress={confirmDialog.open}
        />
      </View>

      <ConfirmDialog
        visible={confirmDialog.isOpen}
        title={t('account.delete.confirmTitle')}
        message={t('account.delete.confirmMessage', { days: deletion.graceDays })}
        confirmLabel={t('account.delete.submit')}
        cancelLabel={t('common.cancel')}
        destructive
        onConfirm={() => void onConfirm()}
        onCancel={confirmDialog.close}
      />

      <ReauthSheet {...deletion.sheet} />
    </Screen>
  );
}