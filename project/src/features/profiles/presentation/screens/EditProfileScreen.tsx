import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useDisclosure } from '@/shared/hooks/useDisclosure';
import { makeStyles } from '@/shared/theme/makeStyles';
import { AppText } from '@/shared/ui/AppText';
import { Button } from '@/shared/ui/Button';
import { Chip } from '@/shared/ui/Chip';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { Divider } from '@/shared/ui/Divider';
import { ListRow } from '@/shared/ui/ListRow';
import { Screen } from '@/shared/ui/Screen';
import { ScreenHeader } from '@/shared/ui/ScreenHeader';
import { TextField } from '@/shared/ui/TextField';
import { useToast } from '@/shared/ui/ToastProvider';

import { useAvatarPicker } from '../../application/hooks/useAvatarPicker';
import { toProfileErrorKey, useProfiles } from '../../application/hooks/useProfiles';
import { profileSchema, type ProfileFormValues } from '../../application/schemas/profileSchema';
import { DEFAULT_AVATAR_ID } from '../../domain/entities/AvatarOption';
import {
  DEFAULT_MATURITY,
  KIDS_MATURITY,
  MATURITY_RATINGS,
} from '../../domain/entities/MaturityRating';
import { hasPin, type AvatarInput } from '../../domain/entities/Profile';
import { AvatarPicker } from '../components/AvatarPicker';
import { KidsToggle } from '../components/KidsToggle';
import { PinSetupSheet } from '../components/PinSetupSheet';

const useStyles = makeStyles(({ spacing }) => ({
  section: { marginTop: spacing.xl },
  chips: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  actions: { marginTop: spacing.xl, gap: spacing.sm },
}));

export function EditProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const styles = useStyles();
  const { profileId } = useLocalSearchParams<{ profileId: string }>();
  const isNew = profileId === 'new';

  const { profiles, createProfile, updateProfile, deleteProfile, setProfilePin, isSaving } =
    useProfiles();
  const profile = isNew ? undefined : profiles.find((item) => item.id === profileId);

  const picker = useAvatarPicker();
  const pinSheet = useDisclosure();
  const deleteDialog = useDisclosure();

  const { control, handleSubmit, watch, setValue, reset } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', isKids: false, maturity: DEFAULT_MATURITY },
  });

  const [avatar, setAvatar] = useState<{ presetId: string; imageUri: string | null }>({
    presetId: DEFAULT_AVATAR_ID,
    imageUri: null,
  });
  const [avatarChanged, setAvatarChanged] = useState(false);

  const initialized = useRef(false);
  useEffect(() => {
    if (!profile || initialized.current) return;
    initialized.current = true;
    reset({ name: profile.name, isKids: profile.isKids, maturity: profile.maturity });
    setAvatar({ presetId: profile.avatarPreset ?? DEFAULT_AVATAR_ID, imageUri: profile.avatarUrl });
  }, [profile, reset]);

  const isKids = watch('isKids');
  const name = watch('name');

  const onPickImage = async () => {
    const uri = await picker.pick();
    if (!uri) return;
    setAvatar((current) => ({ ...current, imageUri: uri }));
    setAvatarChanged(true);
  };

  const onSelectPreset = (presetId: string) => {
    setAvatar({ presetId, imageUri: null });
    setAvatarChanged(true);
  };

  const onKidsChange = (value: boolean) => {
    setValue('isKids', value);
    if (value) setValue('maturity', KIDS_MATURITY);
  };

  const onSubmit = handleSubmit(async (values) => {
    const avatarInput: AvatarInput = avatar.imageUri
      ? { kind: 'upload', localUri: avatar.imageUri }
      : { kind: 'preset', presetId: avatar.presetId };

    try {
      if (isNew) {
        await createProfile({ ...values, avatar: avatarInput });
      } else if (profile) {
        await updateProfile({
          id: profile.id,
          patch: { ...values, ...(avatarChanged ? { avatar: avatarInput } : {}) },
        });
      }
      router.back();
    } catch (error) {
      toast.error(t(toProfileErrorKey(error)));
    }
  });

  const onDelete = async () => {
    if (!profile) return;
    try {
      await deleteProfile(profile.id);
      deleteDialog.close();
      router.back();
    } catch (error) {
      deleteDialog.close();
      toast.error(t(toProfileErrorKey(error)));
    }
  };

  return (
    <Screen
      scroll
      keyboardAvoiding
      padded={false}
      header={
        <ScreenHeader
          title={isNew ? t('profiles.edit.newTitle') : t('profiles.edit.editTitle')}
          onBack={() => router.back()}
        />
      }
      contentContainerStyle={{ padding: 16 }}
    >
      <AvatarPicker
        name={name}
        presetId={avatar.presetId}
        imageUri={avatar.imageUri}
        onSelectPreset={onSelectPreset}
        onPickImage={() => void onPickImage()}
        isPicking={picker.isPicking}
        permissionDenied={picker.permissionDenied}
        onOpenSettings={picker.openSettings}
      />

      <View style={styles.section}>
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <TextField
              label={t('profiles.edit.name')}
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message ? t(fieldState.error.message) : null}
              maxLength={30}
              autoCapitalize="words"
              returnKeyType="done"
            />
          )}
        />
      </View>

      <KidsToggle value={isKids} onChange={onKidsChange} />

      {!isKids ? (
        <View style={styles.section}>
          <AppText variant="captionStrong" color="textSecondary">
            {t('profiles.edit.maturity')}
          </AppText>
          <View style={styles.chips}>
            {MATURITY_RATINGS.map((rating) => (
              <Chip
                key={rating}
                label={rating}
                selected={watch('maturity') === rating}
                onPress={() => setValue('maturity', rating)}
              />
            ))}
          </View>
        </View>
      ) : null}

      {profile ? (
        <View style={styles.section}>
          <Divider />
          <ListRow
            icon="lock-closed-outline"
            title={t('profiles.edit.pin')}
            subtitle={hasPin(profile) ? t('profiles.edit.pinOn') : t('profiles.edit.pinOff')}
            onPress={pinSheet.open}
          />
          <Divider />
        </View>
      ) : null}

      <View style={styles.actions}>
        <Button
          label={t('common.save')}
          loading={isSaving}
          onPress={() => void onSubmit()}
        />
        {profile ? (
          <Button
            label={t('profiles.edit.delete')}
            variant="ghost"
            onPress={deleteDialog.open}
          />
        ) : null}
      </View>

      {profile ? (
        <>
          <PinSetupSheet
            visible={pinSheet.isOpen}
            hasPin={hasPin(profile)}
            onClose={pinSheet.close}
            onSubmit={(pin) => setProfilePin({ id: profile.id, pin })}
            onRemove={() => setProfilePin({ id: profile.id, pin: null })}
          />
          <ConfirmDialog
            visible={deleteDialog.isOpen}
            title={t('profiles.edit.deleteTitle')}
            message={t('profiles.edit.deleteMessage', { name: profile.name })}
            confirmLabel={t('common.delete')}
            cancelLabel={t('common.cancel')}
            destructive
            loading={isSaving}
            onConfirm={() => void onDelete()}
            onCancel={deleteDialog.close}
          />
        </>
      ) : null}
    </Screen>
  );
}