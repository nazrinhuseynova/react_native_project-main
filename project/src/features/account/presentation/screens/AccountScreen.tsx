import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { toUserMessage } from '@/core/errors/toUserMessage';
import { useAuth } from '@/features/auth';
import { useDisclosure } from '@/shared/hooks/useDisclosure';
import { makeStyles } from '@/shared/theme/makeStyles';
import { AppText } from '@/shared/ui/AppText';
import { Button } from '@/shared/ui/Button';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { Divider } from '@/shared/ui/Divider';
import { ListRow } from '@/shared/ui/ListRow';
import { Screen } from '@/shared/ui/Screen';
import { ScreenHeader } from '@/shared/ui/ScreenHeader';
import { useToast } from '@/shared/ui/ToastProvider';

const useStyles = makeStyles(({ spacing }) => ({
  email: { marginBottom: spacing.lg },
  footer: { marginTop: spacing.xl },
}));

export function AccountScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const styles = useStyles();
  const { user, signOut } = useAuth();
  const signOutDialog = useDisclosure();

  const onSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      signOutDialog.close();
      toast.error(t(toUserMessage(error)));
    }
  };

  // Google ilə daxil olanlarda şifrə/e-poçt provayderdə idarə olunur.
  const canChangePassword = user?.provider === 'email';

  return (
    <Screen
      scroll
      padded={false}
      header={<ScreenHeader title={t('account.title')} onBack={() => router.back()} />}
      contentContainerStyle={{ padding: 16 }}
    >
      <View style={styles.email}>
        <AppText variant="captionStrong" color="textSecondary">
          {t('account.email')}
        </AppText>
        <AppText variant="headline">{user?.email}</AppText>
      </View>

      <Divider />
      {canChangePassword ? (
        <>
          <ListRow icon="key-outline" title={t('account.sections.password')} onPress={() => router.push('/account/change-password')} />
          <Divider />
        </>
      ) : null}
      {canChangePassword ? (
        <>
          <ListRow icon="mail-outline" title={t('account.sections.email')} onPress={() => router.push('/account/change-email')} />
          <Divider />
        </>
      ) : null}
      <ListRow icon="shield-checkmark-outline" title={t('account.sections.security')} onPress={() => router.push('/account/security')} />
      <Divider />
      <ListRow icon="people-outline" title={t('account.sections.parental')} onPress={() => router.push('/parental')} />
      <Divider />
      <ListRow
        icon="trash-outline"
        title={t('account.sections.delete')}
        destructive
        onPress={() => router.push('/account/delete')}
      />
      <Divider />

      <View style={styles.footer}>
        <Button label={t('account.signOut')} variant="secondary" leftIcon="log-out-outline" onPress={signOutDialog.open} />
      </View>

      <ConfirmDialog
        visible={signOutDialog.isOpen}
        title={t('account.signOutConfirm.title')}
        message={t('account.signOutConfirm.message')}
        confirmLabel={t('account.signOut')}
        cancelLabel={t('common.cancel')}
        onConfirm={() => void onSignOut()}
        onCancel={signOutDialog.close}
      />
    </Screen>
  );
}